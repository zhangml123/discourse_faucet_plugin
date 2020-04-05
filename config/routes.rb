require_dependency "faucet_constraint"
DiscourseFaucet::Engine.routes.draw do
  get "/faucet" => "faucet#index", constraints: FaucetConstraint.new
  get "/faucet/get-balance" => "faucet#get_balance", constraints: FaucetConstraint.new
  post "/faucet/claim" => "faucet#claim", constraints: FaucetConstraint.new
  get "/faucet/histories" => "faucet#index", constraints: AdminConstraint.new
  get "/faucet_history_items" => "faucet#history_items", constraints: AdminConstraint.new
  get "/faucet/check_address" => "faucet#check_address", constraints: FaucetConstraint.new
  get "/faucet/export" => "faucet#export" ,constraints: AdminConstraint.new
end