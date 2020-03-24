class FaucetConstraint
  def matches?(request)
    SiteSetting.discourse_faucet
  end
end