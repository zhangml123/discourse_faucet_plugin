# frozen_string_literal: true
require "net/http"
require "uri"
module DiscourseFaucet
  class FaucetController < ApplicationController
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
  end
end