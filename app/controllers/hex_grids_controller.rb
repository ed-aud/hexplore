class HexGridsController < ApplicationController
  def index
    @cafes = Poi.where(category: "cafe")
    @gyms = Poi.where(category: "gym")
    @parks = Poi.where(category: "park")
    @pubs = Poi.where(category: "pub")
    @restaurants = Poi.where(category: "restaurant")
    @stations = Poi.where(category: "station")
  end
end
