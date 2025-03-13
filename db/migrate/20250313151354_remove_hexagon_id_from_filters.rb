class RemoveHexagonIdFromFilters < ActiveRecord::Migration[7.2]
  def change
    remove_reference :filters, :hexagon, null: false, foreign_key: true
  end
end
