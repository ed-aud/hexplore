require 'net/http'
require 'json'
require 'uri'
require 'dotenv/load'

def fetch_locations
  places = [
    "Cinema", "Museum", "Park", "Theatre", "Nightlife", "Bar", "Restaurant", "Pub", "Cocktail Bar",
    "Coffee Shop", "Deli", "Wine Bar", "Supermarket", "Bakery", "Butcher", "Market", "Salon", "Barber",
    "Nail Salon", "Spa", "Massage", "Gym", "Yoga Studio", "Church", "Mosque", "Synagogue", "Temple", "University", "Hospital"
  ]

  # London bounds
  bounds = [-0.489, 51.28, 0.236, 51.686]

  # Bethnal Green bounds
  # bounds = [-0.068506, 51.502972, -0.032506, 51.538972]
  access_token = ENV['MAPBOX_API_KEY']

  all_locations = []

  places.each do |place|
    formatted_place = place.downcase.gsub(' ', '+')
    url = URI("https://api.mapbox.com/search/searchbox/v1/category/#{formatted_place}?access_token=#{access_token}&language=en&limit=25&bbox=#{bounds.join(',')}")

    response = Net::HTTP.get(url)
    data = JSON.parse(response)

    locations = data["features"].map do |feature|
      {
        category: place,  # Include the category (e.g., "Cinema") at the start
        name: feature["properties"]["name"],
        lat: feature["geometry"]["coordinates"][1],  # Latitude at index 1
        lon: feature["geometry"]["coordinates"][0]   # Longitude at index 0
      }
    end

    all_locations.concat(locations)
  end

  puts all_locations
end

fetch_locations
