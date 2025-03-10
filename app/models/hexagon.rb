class Hexagon < ApplicationRecord
  has_many :hives
  has_many :filters
  belongs_to :hex_grid

  validates :lat, :lon, presence: true
end
