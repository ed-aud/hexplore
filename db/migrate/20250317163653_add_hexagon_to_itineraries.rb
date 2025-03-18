class AddHexagonToItineraries < ActiveRecord::Migration[7.2]
  def change
    add_reference :itineraries, :hexagon, null: false, foreign_key: true
  end
end
