# name: discourse faucet plugin
# about: discourse faucet plugin
# version: 0.1
# authors: null
# url: https://github.com/zhangml123/discourse_faucet_plugin

puts "faucet plugin"
register_asset "javascripts/discourse/controllers/faucet.js"
register_asset "javascripts/discourse/faucet-route-map.js"
load File.expand_path('../lib/engine.rb', __FILE__)

