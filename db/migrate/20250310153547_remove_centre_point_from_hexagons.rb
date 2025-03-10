class RemoveCentrePointFromHexagons < ActiveRecord::Migration[7.2]
  def change
    remove_column :hexagons, :centre_point, :string
    add_column :hexagons, :lat, :float
    add_column :hexagons, :lon, :float
  end
end
