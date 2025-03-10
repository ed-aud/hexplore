class HexGrid < ApplicationRecord
  has_many :hexagons

  validates :min_lat, :max_lat, :min_lon, :max_lon, :hexagon_width, presence: true
end
