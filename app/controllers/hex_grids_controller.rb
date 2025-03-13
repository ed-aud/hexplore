class HexGridsController < ApplicationController
  def index
    @cafes = Poi.where(category: "cafe")
    @gyms = Poi.where(category: "gym")
    @parks = Poi.where(category: "park")
    @pubs = Poi.where(category: "pub")
    @restaurants = Poi.where(category: "restaurant")
    @stations = Poi.where(category: "station")

    categories = Poi.distinct.pluck(:category).sort

    @filters = categories.each_with_object({}) do |category, hash|
      hash[category] = Poi.where(category: category)
    end


    address = params[:address].gsub(/[^a-zA-Z0-9\s]/, '').gsub(" ", "%20")
    url = "https://api.mapbox.com/geocoding/v5/mapbox.places/#{address}.json?access_token=#{ENV['MAPBOX_API_KEY']}"
    uri = URI.parse(url)

    # Make the HTTP GET request
    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)
    @coordinates = data["features"][0]["geometry"]["coordinates"]
  end
end
