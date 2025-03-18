class Hive < ApplicationRecord
  has_many :hive_pois, dependent: :destroy
  belongs_to :user
  belongs_to :hexagon
end
