class FaucetConstraint
  def matches?(request)
    SiteSetting.faucet_enabled
  end
end