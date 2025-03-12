class Poi < ApplicationRecord
  validates :category, :name, :lon, :lat, presence: true
end
