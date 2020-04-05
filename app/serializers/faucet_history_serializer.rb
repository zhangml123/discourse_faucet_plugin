class FaucetHistorySerializer < ApplicationSerializer
  attributes :id,
             :user_id,
             :user_name,
             :address,
             :amount,
             :status,
             :txid,
             :created_at,
             :updated_at
end


