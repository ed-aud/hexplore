class CreateHivePois < ActiveRecord::Migration[7.2]
  def change
    create_table :hive_pois do |t|
      t.references :hive, null: false, foreign_key: true
      t.references :poi, null: false, foreign_key: true

      t.timestamps
    end
  end
end
