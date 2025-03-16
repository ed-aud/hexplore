require 'net/http'
require 'json'
require 'uri'
require 'dotenv/load'

def fetch_locations
  places = [
    # "Bar",
    "Cafe",
    "Church",
    "Cinema",
    # "Cocktail Bar",
    # "Deli",
    "Gym",
    # "Hospital",
    # "Market",
    # "Massage",
    "Museum",
    "Mosque",
    "Nail Salon",
    # "Nightlife",
    "Park",
    "Pub",
    "Restaurant",
    "Spa",
    "Supermarket",
    "Synagogue",
    "Temple",
    "Theatre",
    # "University",
    "Wine Bar",
    "Yoga"
  ]

  # London bounds
  # bounds = [-0.489, 51.28, 0.236, 51.686]

  # Bethnal Green bounds
  # bounds = [-0.068506, 51.502972, -0.032506, 51.538972]

  # Mile End bounds
  # bounds = [-0.0539, 51.5130, -0.0249, 51.5310]

  # Hackney Wick bounds
  # bounds = [-0.0375, 51.5435, 0.0085, 51.5615]

  # Dalston Juntion bounds
  # bounds = [-0.0915, 51.5400, -0.0575, 51.5580]

  # Limehouse bouunds
  # bounds = [-0.0505, 51.5105, 0.0045, 51.5285]

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
