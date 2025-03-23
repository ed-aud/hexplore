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

# def fetch_locations
#   places = [
#             "Gym",
#             "Climbing Gym",
#             "Fitness Center",
#             "Subway Station",
#             "Train Station",
#             "Transportation",
#             "Public Transit Station",
#             "Art Gallery",
#             "Concert Hall",
#             "Library",
#             "Night Club",
#             "Nightclub",
#             "Bank",
#             "Post Office",
#             "Church",

#             # # "Bar",
#             # "Cafe",
#             # "Church",
#             # "Cinema",
#             # # "Cocktail Bar",
#             # # "Deli",
#             # "Gym",
#             # # "Hospital",
#             # # "Market",
#             # # "Massage",
#             # "Museum",
#             # "Mosque",
#             # "Nail Salon",
#             # # "Nightlife",
#             # "Park",
#             # "Pub",
#             # "Station",
#             # "Restaurant",
#             # "Spa",
#             # "Supermarket",
#             # "Synagogue",
#             # "Temple",
#             # "Theatre",
#             # # "University",
#             # "Wine Bar",
#             # "Yoga"
#           ]

#   access_token = ENV['MAPBOX_API_KEY']
#   all_locations = []

#   centre_point = [-0.04063119, 51.52406612]

#   # Define bounding box points
#   nw_point = [centre_point[0] + 0.02, centre_point[1] + 0.01]
#   se_point = [centre_point[0] - 0.02, centre_point[1] - 0.01]

#   lon_step = 0.01 # Approx. 400m in longitude at London's latitude
#   lat_step = 0.005 # Approx. 400m in latitude

#   # Iterate over the bounding box in 400m steps
#   (se_point[1]..nw_point[1]).step(lat_step) do |lat|
#     (se_point[0]..nw_point[0]).step(lon_step) do |lon|
#       bounds = [lon, lat, lon + lon_step, lat + lat_step] # Mini bounding box

#       places.each do |place|
#         formatted_place = place.downcase.gsub(' ', '+')
#         uri = URI("https://api.mapbox.com/search/searchbox/v1/category/#{formatted_place}?access_token=#{access_token}&language=en&limit=25&bbox=#{bounds.join(',')}")

#         response = Net::HTTP.get(uri)
#         data = JSON.parse(response)

#         locations = data["features"]&.map do |feature|
#           {
#             category: place,
#             name: feature["properties"]["name"],
#             lat: feature["geometry"]["coordinates"][1],
#             lon: feature["geometry"]["coordinates"][0]
#           }
#         end || []

#         all_locations.concat(locations)
#       end
#     end
#   end
#   p all_locations
# end

# fetch_locations

# def fetch_locations
#   places = [
#         "Gym",
#         "Fitness Center",
#         "Subway Station",
#         "Train Station",
#         "Transportation",
#         "Public Transit Station"
#         # # "Bar",
#         # "Cafe",
#         # "Church",
#         # "Cinema",
#         # # "Cocktail Bar",
#         # # "Deli",
#         # "Gym",
#         # # "Hospital",
#         # # "Market",
#         # # "Massage",
#         # "Museum",
#         # "Mosque",
#         # "Nail Salon",
#         # # "Nightlife",
#         # "Park",
#         # "Pub",
#         # "Station",
#         # "Restaurant",
#         # "Spa",
#         # "Supermarket",
#         # "Synagogue",
#         # "Temple",
#         # "Theatre",
#         # # "University",
#         # "Wine Bar",
#         # "Yoga"
#       ]
#   access_token = ENV['MAPBOX_API_KEY']
#   all_locations = []

#   centre_point = [-0.04063119, 51.52406612]

#   # Define bounding box points
#   nw_point = [centre_point[0] + 0.03825, centre_point[1] + 0.02395]
#   se_point = [centre_point[0] - 0.03825, centre_point[1] - 0.02395]

#   lon_step = 0.005 # Approx. 400m in longitude at London's latitude
#   lat_step = 0.0036 # Approx. 400m in latitude

#   # Iterate over the bounding box in 400m steps
#   (se_point[1]..nw_point[1]).step(lat_step) do |lat|
#     (se_point[0]..nw_point[0]).step(lon_step) do |lon|
#       bounds = [lon, lat, lon + lon_step, lat + lat_step] # Mini bounding box

#       places.each do |place|
#         formatted_place = place.downcase.gsub(' ', '+')
#         uri = URI("https://api.mapbox.com/search/searchbox/v1/category/#{formatted_place}?access_token=#{access_token}&language=en&limit=25&bbox=#{bounds.join(',')}")

#         response = Net::HTTP.get(uri)
#         data = JSON.parse(response)

#         locations = data["features"]&.map do |feature|
#           {
#             category: place,
#             name: feature["properties"]["name"],
#             lat: feature["geometry"]["coordinates"][1],
#             lon: feature["geometry"]["coordinates"][0]
#           }
#         end || []

#         all_locations.concat(locations)
#       end
#     end
#   end

#   puts all_locations
# end

# fetch_locations




# uri = URI("https://api.mapbox.com/search/searchbox/v1/suggest?q=train+station&language=en&navigation_profile=driving&country=gb&poi_category=public_transportation_station&origin=-0.11536282487301719,51.54322536809835&session_token=0e3e6783-a15f-4238-8195-ada284e1059c&access_token=pk.eyJ1IjoiZWQtYXVkIiwiYSI6ImNtNzF2OWlybDAzZGwyanIwMm1sYzJlNzIifQ.XHxwzYEwLqcTOAzLgWnfag")
# response = Net::HTTP.get(uri)
# data = JSON.parse(response)

# p data
