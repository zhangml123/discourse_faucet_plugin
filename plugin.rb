# name: discourse faucet plugin
# about: discourse faucet plugin
# version: 0.1
# authors: null
# url: https://github.com/zhangml123/discourse_faucet_plugin

register_asset 'stylesheets/common/faucet.scss'
enabled_site_setting :faucet_enabled
after_initialize do

  [ "../app/models/faucet_history",
  ].each { |path| require File.expand_path(path, __FILE__) }
end

load File.expand_path('../lib/engine.rb', __FILE__)

