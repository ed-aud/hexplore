require 'net/http'
require 'json'
require 'uri'
require 'dotenv/load'

poi = []

categories = ["Art Gallery",
  "Bar",
  "Cafe",
  "Church",
  "Cinema",
  "Climbing Gym",
  "Concert Hall",
  "Deli",
  "Fitness Center",
  "Gym",
  "Hospital",
  "Library",
  "Market",
  "Museum",
  "Mosque",
  "Nightclub",
  "Park",
  "Post Office",
  "Pub",
  "Spa",
  "Station",
  "Restaurant",
  "School",
  "Stadium",
  "Supermarket",
  "Synagogue",
  "Theatre",
  "Wine Bar",
  "Yoga Studio"]

access_token = ENV['MAPBOX_API_KEY']

categories.each do |category|
  formatted_category = category.downcase.gsub(' ', '_')
  uri = URI("https://api.mapbox.com/search/searchbox/v1/category/#{formatted_category}?access_token=#{access_token}&language=en&limit=25&bbox=-0.1351,51.5029,-0.1205,51.5119")
  response = Net::HTTP.get(uri)
  data = JSON.parse(response)

  location = data["features"]&.map do |feature|
    {
      category: category.downcase,
      name: feature["properties"]["name"],
      lat: feature["geometry"]["coordinates"][1],
      lon: feature["geometry"]["coordinates"][0]
    }
  end || []

  poi << location
end

puts poi