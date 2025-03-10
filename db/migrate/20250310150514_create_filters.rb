class CreateFilters < ActiveRecord::Migration[7.2]
  def change
    create_table :filters do |t|
      t.string :category
      t.integer :associated_distance
      t.references :hexagons, null: false, foreign_key: true

      t.timestamps
    end
  end
end
