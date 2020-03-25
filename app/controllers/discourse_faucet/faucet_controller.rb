# frozen_string_literal: true
module DiscourseFaucet
  class FaucetController < ApplicationController
    def index

      	
      render_json_dump("PlatON NewBaleyworld testnet faucet")
    end
    def get_balance
    	render json: {"status": "balance"}
    end
  end
end