class Poi < ApplicationRecord
  has_many :hive_pois

  validates :category, :name, :lon, :lat, presence: true
end
