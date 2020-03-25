# frozen_string_literal: true

class Faucet < ActiveRecord::Base
 puts "models faucet loaded"
end

# == Schema Information
#
# Table name: faucet
#
#  id              :integer           not null, primary key
#  user_limit      :integer
#  daily_limit     :integer          not null
#  status          :tring            not null
#  anonymous_votes :integer
#  last_update_at  :datetime         not null
# 
