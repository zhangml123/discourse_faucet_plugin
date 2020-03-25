# name: discourse faucet plugin
# about: discourse faucet plugin
# version: 0.1
# authors: null
# url: https://github.com/zhangml123/discourse_faucet_plugin

puts "faucet plugin111111"

after_initialize do

  [ "../app/models/faucet",
  ].each { |path| require File.expand_path(path, __FILE__) }
end

load File.expand_path('../lib/engine.rb', __FILE__)

