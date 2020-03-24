require_dependency "faucet_constraint"
DiscourseFaucet::Engine.routes.draw do
  get "/" => "faucet#index", constraints: FaucetConstraint.new
end