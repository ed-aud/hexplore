class RemoveFiltersTable < ActiveRecord::Migration[7.2]
  def change
    drop_table :filters
  end
end
