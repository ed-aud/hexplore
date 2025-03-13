class RemoveHexGridIdFromHexagons < ActiveRecord::Migration[7.2]
  def change
    remove_reference :hexagons, :hex_grid, null: false, foreign_key: true
  end
end
