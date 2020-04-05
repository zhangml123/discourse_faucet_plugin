# frozen_string_literal: true
require "net/http"
require "uri"
module DiscourseFaucet
  class FaucetController < ApplicationController

    skip_before_action :check_xhr, only: [:export]
     
    
    requires_login only: [:claim, :history_items]
    before_action :ensure_staff , only: [:history_items]

    def index
      render_json_dump("PlatON NewBaleyworld testnet faucet")
    end
    def get_balance
      json = {}
      claimed = FaucetHistory.claimed(date) || 0
      daily_limit = SiteSetting.faucet_daily_limit
      amount = daily_limit - claimed
      amount = amount >= 0 ? amount : 0
      json["amount"] = amount
      if current_user
         result = FaucetHistory.where(user_id: current_user&.id).where("created_at > '#{date}'")
         json["claimed"] = result        
      end

      host = ENV['DOCKER_HOST_IP']
    	uri=URI.parse("http://" + host + ":8080/test/getBalance")
		  http=Net::HTTP.new(uri.host,uri.port)
		  response=Net::HTTP.get_response(uri)
      res = JSON.parse(response.body)
      json["status"] = res["status"]
      json["balance"] = res["balance"]
    	render json: json
    end
    def check_address
      params.require(:address)
      address = params[:address]
      result = FaucetHistory.where(address: address).where("created_at > '#{date}' and status <> 'failed'" )
      # 用户已领取
      if result.count > 0
        render json: { claimed: true }
      else
        render json: { claimed: false }
      end
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

      level = SiteSetting.faucet_level_limit_set
      puts "level = "
      puts level
      # 用户等级不足
      if current_user&.trust_level < level
        return fail_with("faucet.user.level_limit")
      end
 
      claimed = FaucetHistory.claimed(date) || 0
      daily_limit = SiteSetting.faucet_daily_limit
  
       #今日申领额度用尽
      if claimed >= daily_limit
        return fail_with("faucet.daily_limit")
      end
      user_id = current_user&.id
      
      result = FaucetHistory.where(user_id: user_id).where("created_at > '#{date}' and status <> 'failed'" )
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
      render_json_dump({success: true, message: I18n.t("faucet.claim_success")}) 
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
        #result = FaucetHistory.update_status( history_id ,"pending",txid)
        result = FaucetHistory.update_status( history_id ,"success",txid)
      else
        puts "history_id33333 ="
        puts history_id
        result = FaucetHistory.update_status( history_id ,"failed","")
        return fail_with("faucet.user.claim_failed")
      end
    end
    PAGE_SIZE = 2
    def history_items
      result = FaucetHistory.order("id desc")
      page = params[:page].to_i
      result_count = result.count
      result = result.limit(PAGE_SIZE).offset(PAGE_SIZE * page).to_a

      more_params = params.slice(:order, :asc).permit!
      more_params[:page] = page + 1
      datas = serialize_data(result, FaucetHistorySerializer)
      datas1 = []
      datas.each do |data|
         data[:created_at] =  Time.at(data[:created_at]).strftime("%Y-%m-%d %H:%M:%S")
         #user = User.find_by(id: data[:user_id])
         #data[:user_name] = user.username
      end

      render_json_dump(faucet_history_items: datas,
                total_rows_faucet_history_items: result_count,
                load_more_faucet_history_items: faucet_history_items_path(more_params)
      )

    end
    def export

      #encoding:utf-8
      require "ole/storage"
      require "spreadsheet/excel"
      #设置表格的编码为utf-8
      Spreadsheet.client_encoding="utf-8"
      #创建表格对象
      book=Spreadsheet::Workbook.new
      #创建工作表
      sheet1=book.create_worksheet :name => "sheet1"
      #在表格第一行设置分类
      sheet1.row(0)[0]="user id"
      sheet1.row(0)[1]="user name"
      sheet1.row(0)[2]="address"
      sheet1.row(0)[3]="amount"
      sheet1.row(0)[4]="txid"
      sheet1.row(0)[5]="created_at"
      sheet1.row(0)[6]="status"
      result = FaucetHistory.order("id desc")
      datas = serialize_data(result, FaucetHistorySerializer)
      datas.times do |i|
          sheet1.row(i+1)[0] = datas[i]["user_id"]
          sheet1.row(i+1)[1] = ""
          sheet1.row(i+1)[2] = datas[i]["address"]
          sheet1.row(i+1)[3] = datas[i]["amount"]
          sheet1.row(i+1)[4] = datas[i]["txit"]
          sheet1.row(i+1)[5] = datas[i]["created_at"]
          sheet1.row(i+1)[2] = datas[i]["status"]
      end
      #在指定路径下面创建test1.xls表格，并写book对象
      path = "#{Dir.pwd}/public/histories.xls"
      book.write path
      #render_json_dump("PlatON NewBaleyworld testnet export")
      send_file path
    end
  end
end