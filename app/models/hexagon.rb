class Hexagon < ApplicationRecord
  has_many :hives
  has_many :itineraries, dependent: :destroy
  geocoded_by :address

  validates :lat, :lon, presence: true
end
