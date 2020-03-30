# frozen_string_literal: true
require "net/http"
require "uri"
module DiscourseFaucet
  class FaucetController < ApplicationController

    #skip_before_action :check_xhr, only: [:histories]
     
    
    requires_login only: [:claim, :history_items]
    before_action :ensure_staff , only: [:history_items]

    def index
      render_json_dump("PlatON NewBaleyworld testnet faucet")
    end
    def get_balance
      puts "ENV['PATH']"
      puts ENV['DOCKER_HOST_IP']
      claimed = FaucetHistory.claimed(date) || 0
      daily_limit = SiteSetting.faucet_daily_limit
      amount = daily_limit - claimed
      amount = amount >= 0 ? amount : 0
      host = ENV['DOCKER_HOST_IP']
    	uri=URI.parse("http://" + host + ":8080/test/getBalance")
		  http=Net::HTTP.new(uri.host,uri.port)
		  response=Net::HTTP.get_response(uri)
      res = JSON.parse(response.body)
    	render json: {status: res["status"], balance: res["balance"], amount: amount}
    end
    def claim 
      
      params.require(:address)
      address = params[:address]
      # 地址错误
      if address.length != 42 || address[0,2] != "0x"
        puts address.length
        puts address[0,2]
        return fail_with("faucet.address.invalid")
      end
      # 用户等级不足
      if current_user&.trust_level < 1
        return fail_with("faucet.user.level_limit")
      end
      
      puts date

      claimed = FaucetHistory.claimed(date) || 0
      daily_limit = SiteSetting.faucet_daily_limit
      puts "claimed"
      puts claimed
      puts "daily_limit"
      puts daily_limit
       #今日申领额度用尽
      if claimed >= daily_limit
        return fail_with("faucet.daily_limit")
      end
      user_id = current_user&.id
      
      result = FaucetHistory.where(user_id: user_id).where("created_at > '#{date}' and status <> 'success'" )
      # 用户已领取
      if result.count > 0
        return fail_with("faucet.user.user_limit")
      end
     
      amount = SiteSetting.faucet_user_limit
      result_claimed = FaucetHistory.where(user_id: user_id).where("created_at > '#{date}' and status = 'claimed'" )
     
      if result_claimed.count == 0
        history_id = FaucetHistory.add_history(user_id, address, amount, "claimed")
        puts "history_id ="
        puts history_id
      else
        return fail_with("faucet.user.user_claimed")
      end
      transfar(address, amount, history_id)
      render_json_dump({success: true, message: I18n.t("claim_success")}) 
    end
    def fail_with(key)
      render json: { success: false, message: I18n.t(key) }
    end
    def date
       t = Time.new
      if t.hour < 16
        yesterday = t - 1.day 
        date = yesterday.strftime('%Y-%m-%d 16:00:00')
      else
        date =  t.strftime('%Y-%m-%d 16:00:00')
      end
      return date 
    end

    def transfar(address, amount, history_id)
      host = ENV['DOCKER_HOST_IP']
      param = {} 
      param["address"] = address
      param["amount"] = amount
      uri=URI.parse("http://" + host + ":8080/test/send")
      http=Net::HTTP.new(uri.host,uri.port)
      response=Net::HTTP.post_form(uri, param)

      puts "transfar response"
      puts response.body
      res = JSON.parse(response.body)
      
      if res["status"] == "0x1"
        txid = res["txid"]

        puts "history_id1111 ="
        puts history_id
        result = FaucetHistory.update_status( history_id ,"pending",txid)
      else
        puts "history_id33333 ="
        puts history_id
        result = FaucetHistory.update_status( history_id ,"failed","")
        return fail_with("faucet.user.claim_failed")
      end
    end
    PAGE_SIZE = 10
    def history_items
      result = FaucetHistory.order("id desc")
      page = params[:page].to_i
      result_count = result.count
      result = result.limit(PAGE_SIZE).offset(PAGE_SIZE * page).to_a
      more_params = params.slice(:order, :asc).permit!
      more_params[:page] = page + 1
      datas = serialize_data(result, FaucetHistorySerializer)
      render_json_dump(faucet_history_items: datas,
                total_rows_faucet_history_items: result_count,
                load_more_faucet_history_items: faucet_history_items_path(more_params)
      )

    end
  end
end