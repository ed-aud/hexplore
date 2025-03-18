class RemoveUserFromItinerary < ActiveRecord::Migration[7.2]
  def change
    remove_reference :itineraries, :user, null: false, foreign_key: true
  end
end
