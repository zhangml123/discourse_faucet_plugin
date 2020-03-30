module DiscourseFaucet
  class Engine < ::Rails::Engine
    isolate_namespace DiscourseFaucet

    config.after_initialize do

      Discourse::Application.routes.append do
        mount ::DiscourseFaucet::Engine, at: "/"
      end
    end

  end
end