module DiscourseFaucet
  class Engine < ::Rails::Engine
    isolate_namespace DiscourseFaucet

    config.after_initialize do

      Discourse::Application.routes.append do
        mount ::DiscourseFaucet::Engine, at: "/faucet"
      end
    end

  end
end