class PagesController < ApplicationController
  def home
  end

  def map
    @hexagons = Hexagon.all
    @params =  params[:address]
    # Retrieve distinct categories from the POI database and create a Filters hash to pass to HTML & JS
    categories = Poi.distinct.pluck(:category).sort

    @filters = categories.each_with_object({}) do |category, hash|
      hash[category] = Poi.where(category: category).map { |poi| { lon: poi.lon, lat: poi.lat } }
    end
    # Retrieve the search address from params (pushed from Home) and then retrieve the associated coordinates
    address = params[:address]
    address_formatted = address.gsub(/[^a-zA-Z0-9\s]/, '').gsub(" ", "%20")
    url = "https://api.mapbox.com/geocoding/v5/mapbox.places/#{address_formatted}.json?access_token=#{ENV['MAPBOX_API_KEY']}"
    uri = URI.parse(url)
    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)
    @coordinates = data["features"][0]["geometry"]["coordinates"]
    # raise
  end
end
