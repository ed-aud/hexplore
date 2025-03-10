class RenameHexagonsIdToHexagonId < ActiveRecord::Migration[7.2]
  def change
    rename_column :filters, :hexagons_id, :hexagon_id
  end
end
