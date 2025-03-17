class Hive < ApplicationRecord
  has_many :hive_pois
  belongs_to :user
  belongs_to :hexagon
end
