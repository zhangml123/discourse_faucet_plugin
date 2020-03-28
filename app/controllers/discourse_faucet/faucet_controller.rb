# frozen_string_literal: true
require "net/http"
require "uri"
module DiscourseFaucet
  class FaucetController < ApplicationController
    #requires_login only: [:live_post_counts]
   
    #config.active_record.default_timezone = :local


    skip_before_action :check_xhr, only: [:test, :claim]
    requires_login only: [:claim]

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
    	uri=URI.parse("http://" + host + ":8080/test/getBalance?address=0xb5f81e8a65f9b537fee333cc79c3dc2196a35877")
		  http=Net::HTTP.new(uri.host,uri.port)
		  response=Net::HTTP.get_response(uri)
      res = JSON.parse(response.body)
    	render json: {status: res["status"], balance: res["balance"], amount: amount}
    end
    def claim 
      
      params.require(:address)
      address = params[:address]
      # 地址错误
      if false
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
      else
        return fail_with("faucet.user.user_claimed")
      end
      
=begin
      host = ENV['DOCKER_HOST_IP']
      uri=URI.parse("http://" + host + ":8080/test/send?address=" + address)
      http=Net::HTTP.new(uri.host,uri.port)
      response=Net::HTTP.get_response(uri)
      result = response.body
      if body.success
        txid = body.txid
        result = FaucetHistory.update_status( history_id ,"pending",txid)
      else
        result = FaucetHistory.update_status( history_id ,"failed","")
        render_json_dump({success: true, mag: I18n.t("claim_failed")})s
      end
=end
      render_json_dump({success: true, mag: I18n.t("claim_success")}) 
    end
    def test

      date = Time.zone.now.strftime('%Y-%m-%d')
      result = FaucetHistory.where("created_at > " + date)

      render plain:result.count
    end
    def fail_with(key)
      render json: { success: false, message: I18n.t(key) }
    end
    def date
      t = Time.new
      timestamp = Time.mktime(t.year,t.month,t.day,0,0,0).to_i - 8 * 60 * 60
      return Time.at(timestamp).strftime('%Y-%m-%d %H:%M:%S')
    end

    
  end
end