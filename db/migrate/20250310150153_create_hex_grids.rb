class CreateHexGrids < ActiveRecord::Migration[7.2]
  def change
    create_table :hex_grids do |t|
      t.float :min_lat
      t.float :max_lat
      t.float :min_lon
      t.float :max_lon
      t.integer :hexagon_width
      t.string :hexagons_array

      t.timestamps
    end
  end
end
