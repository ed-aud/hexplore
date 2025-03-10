class CreateHives < ActiveRecord::Migration[7.2]
  def change
    create_table :hives do |t|
      t.string :name
      t.text :notes
      t.references :users, null: false, foreign_key: true
      t.references :hexagons, null: false, foreign_key: true

      t.timestamps
    end
  end
end
