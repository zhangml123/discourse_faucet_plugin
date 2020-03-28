# frozen_string_literal: true

class CreateFaucetTables <ActiveRecord::Migration[5.2]
  def change
    create_table :faucet_histories do |t|
      t.integer :user_id, null: false
      t.string :address, null: false
      t.integer :amount, null: false
      t.string :status
      t.string :txid
      t.timestamps null: false
    end
   	add_index :faucet_histories, [:user_id, :created_at]
  end
end