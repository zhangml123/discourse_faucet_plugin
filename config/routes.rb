require_dependency "faucet_constraint"
DiscourseFaucet::Engine.routes.draw do
  get "/" => "faucet#index", constraints: FaucetConstraint.new
  get "/get-balance" => "faucet#get_balance", constraints: FaucetConstraint.new
end