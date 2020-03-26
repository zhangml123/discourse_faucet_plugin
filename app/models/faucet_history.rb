# frozen_string_literal: true

class FaucetHistory < ActiveRecord::Base
 puts "models faucet loaded"


  def self.add_history(user_id, address, amount, status)
  	puts "add_history"
  	puts  user_id
  	puts "address = " + address
  	puts "status = "+ status
  	now = Time.zone.now
    result = DB.exec("INSERT INTO faucet_histories ( user_id, address, amount, status, created_at, updated_at) VALUES (#{user_id}, '#{address}', '#{amount}', '#{status}','#{now}','#{now}')")
    puts result
  end
  def self.have_claimed
  	date = Time.now.strftime('%Y-%m-%d')
  	result = DB.exec("SELECT COUNT(amount) FROM faucet_histories WHERE created_at > #{date}")
  	puts result
  	return result
  end

end


# == Schema Information
#
# Table name: faucet_histories
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  address         :string           not null
#  amount          :integer          not null
#  status          :string           not null
# 