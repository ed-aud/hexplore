class CreateHexagons < ActiveRecord::Migration[7.2]
  def change
    create_table :hexagons do |t|
      t.string :centre_point
      t.references :hex_grids, null: false, foreign_key: true

      t.timestamps
    end
  end
end
