# frozen_string_literal: true

class FaucetHistory < ActiveRecord::Base
 puts "models faucet loaded"

  def self.add_history(user_id, address, amount, status)
  	
  	now = Time.zone.now

  	sql = <<~SQL
        INSERT INTO faucet_histories ( user_id, address, amount, status, created_at, updated_at) 
             VALUES (#{user_id}, '#{address}', #{amount}, '#{status}','#{now}','#{now}') 
          RETURNING id
      SQL
    history_id = DB.query_single(sql)
    
    return history_id
  end
  def self.claimed(date)
  	puts "SELECT SUM(amount) AS amount FROM faucet_histories WHERE created_at > '#{date}' AND status <> 'failed'"
  	
  	sql = <<~SQL
       	SELECT SUM(amount) 
       	    AS amount 
       	  FROM faucet_histories 
       	 WHERE created_at > '#{date}' 
       	   AND status <> 'failed'
      SQL

  	result = DB.query(sql)

  	puts "result = /////"
  	puts result[0].amount
  	puts "/////"
  	return result[0].amount
  end
  def self.update_status(history_id, status, txid)
  	now = Time.zone.now
  	sql = <<~SQL
       	UPDATE faucet_histories
       	   SET status = '#{status}' , updated_at = '#{now}', txid = '#{txid}'
       	 WHERE id = '#{history_id}' 
      SQL
    result = DB.query(sql)
    puts "update result = "
    puts result

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
#  txid            :string
# 