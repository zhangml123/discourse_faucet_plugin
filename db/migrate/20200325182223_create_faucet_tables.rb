# frozen_string_literal: true

class CreateFaucetTables <ActiveRecord::Migration[5.2]
  def change


  	puts "load createfaucet tables"
  	create_table :faucet do |t|
      t.integer :user_limit, null: false
      t.integer :daily_limit, null: false
      t.string :status
      t.datetime :last_update_at
      t.timestamps null: false
    end

    create_table :faucet_history do |t|
      t.integer :user_id, null: false
      t.string :address, null: false
      t.string :status
      t.timestamps null: false
    end
    add_index :faucet_history, :user_id
  end
