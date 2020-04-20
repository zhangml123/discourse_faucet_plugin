# name: discourse faucet plugin
# about: discourse faucet plugin
# version: 0.1
# authors: null
# url: https://github.com/zhangml123/discourse_faucet_plugin

register_asset 'stylesheets/common/faucet.scss'
register_asset "stylesheets/mobile/faucet.scss", :mobile
enabled_site_setting :faucet_enabled
gem 'ruby-ole', '1.2.12.2',  require: false
gem "spreadsheet", "1.2.6",require: false

after_initialize do

  [ "../app/models/faucet_history",
  ].each { |path| require File.expand_path(path, __FILE__) }

  on(:site_setting_saved) do |site_settings|
	
	setting_name = site_settings.name
	if setting_name == "faucet_open" || setting_name == "faucet_user_limit" || setting_name == "faucet_daily_limit" || setting_name == "faucet_level_limit_set" 
	  setting_value = site_settings.value
	  MessageBus.publish("/faucet/site_setting_saved", {setting_name: setting_name, setting_value: setting_value})
	end
  end
end



load File.expand_path('../lib/engine.rb', __FILE__)

