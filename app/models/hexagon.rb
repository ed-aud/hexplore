class Hexagon < ApplicationRecord
  has_many :hives
  has_many :itineraries
  geocoded_by :address
  # after_validation :geocode, if: :will_save_change_to_address?

  validates :lat, :lon, presence: true

end
