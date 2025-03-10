class ChangeHexGridsIdtoHexGridId < ActiveRecord::Migration[7.2]
  def change
    rename_column :hexagons, :hex_grids_id, :hex_grid_id
  end
end
