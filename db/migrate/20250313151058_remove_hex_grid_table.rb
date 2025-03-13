class RemoveHexGridTable < ActiveRecord::Migration[7.2]
  def change
    drop_table :hex_grids
  end
end
