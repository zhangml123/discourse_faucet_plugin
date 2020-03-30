class FaucetHistorySerializer < ApplicationSerializer
  attributes :id,
             :user_id,
             :address,
             :amount,
             :status,
             :txid,
             :created_at,
             :updated_at
end


