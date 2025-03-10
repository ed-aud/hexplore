class RenameTwoColumnNames < ActiveRecord::Migration[7.2]
  def change
    rename_column :hives, :users_id, :user_id
    rename_column :hives, :hexagons_id, :hexagon_id
  end
end
