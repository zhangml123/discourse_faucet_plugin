# frozen_string_literal: true
require "net/http"
require "uri"
module DiscourseFaucet
  class FaucetController < ApplicationController
    #requires_login only: [:live_post_counts]

    skip_before_action :check_xhr, only: [:test, :claim]
    requires_login only: [:claim]

    def index
    	puts "ENV['PATH'] "
        puts ENV['DOCKER_HOST_IP']
      	
      render_json_dump("PlatON NewBaleyworld testnet faucet")
    end
    def get_balance
      puts "ENV['PATH']"
      puts ENV['DOCKER_HOST_IP']

      host = ENV['DOCKER_HOST_IP']
    	uri=URI.parse("http://" + host + ":8080/test/getBalance?address=0xb5f81e8a65f9b537fee333cc79c3dc2196a35877")
		  http=Net::HTTP.new(uri.host,uri.port)
		  response=Net::HTTP.get_response(uri)
    	render json: response.body
    end
    def claim 
      
      params.require(:address)
      address = params[:address]
      # 地址错误
      if false
        return fail_with("faucet.address.invalid")
      end
      # 用户等级不足
      user_id = current_user&.id
      if false
        return fail_with("faucet.user.level_limit")
      end
      # 今日申领额度用尽
      if false
        return fail_with("faucet.daily_limit")
      end
      # 用户已领取
      if false
        return fail_with("faucet.user.user_limit")
      end
      
      amount = SiteSetting.faucet_user_limit
      
      puts current_user
      FaucetHistory.add_history(user_id, address, amount, "claimed")
      render_json_dump("claim111111")
    end
    def test

      date = Time.now.strftime('%Y-%m-%d')
      result = FaucetHistory.where("created_at > " + date)

      render plain:result.count
    end
    def fail_with(key)
      render json: { success: false, message: I18n.t(key) }
    end

  end
end