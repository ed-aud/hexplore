class HexGridsController < ApplicationController
  def index
    address = params[:address].gsub(/[^a-zA-Z0-9\s]/, '').gsub(" ", "%20")
    url = "https://api.mapbox.com/geocoding/v5/mapbox.places/#{address}.json?access_token=#{ENV['MAPBOX_API_KEY']}"
    uri = URI.parse(url)

    # Make the HTTP GET request
    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)
    @coordinates = data["features"][0]["geometry"]["coordinates"]
  end
end

# Code to generate hexagons via Ruby (server-side)
# def index
#   @hexagons = generate_hex_grid
# end

# private

# def generate_hex_grid
#   hexagons = []
#   london_bounds = {
#     min_lat: -0.489, min_lon: 51.28,
#     max_lat: 0.236, max_lon: 51.686
#   }
#   step_size = 0.0045 # ~500m in lat / lon, so change this line if we change hexagon size

#   (london_bounds[:min_lat]..london_bounds[:max_lat]).step(step_size).each do |hexagon_centre_lat|
#     (london_bounds[:min_lon]..london_bounds[:max_lon]).step(step_size).each do |hexagon_centre_lon|
#       hexagons << { lat: hexagon_centre_lat, lon: hexagon_centre_lon }
#     end
#   end
#   hexagons
# end
