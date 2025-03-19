# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'net/http'
require 'json'
require 'uri'
require 'dotenv/load'

puts "Cleaning Database..."
Hive.destroy_all
User.destroy_all
Hexagon.destroy_all
Poi.destroy_all
puts "Cleaned Database"

puts "> Creating Users..."
new_user_1 = User.create!(first_name: "Tom", last_name: "Jones", email: "tom@gmail.com", password: "123456")
new_user_2 = User.create!(first_name: "Ben", last_name: "Hill", email: "ben@gmail.com", password: "123456")
puts "#{User.count} users created"

puts "> Creating Hexagons..."
hexagon = Hexagon.create!(lon: -0.1278, lat: 51.5074)
puts "#{Hexagon.count} users created"

puts "> Creating Hives..."
Hive.create!(name: "Hammersmith Grove", notes: "A a lively and well-connected street stretching from Hammersmith's bustling center towards Shepherd's Bush. Lined with charming period buildings, independent cafés, and stylish eateries, the area is a favorite among professionals and young families. You'll find popular spots like Café Plum and Betty Blythe offering great coffee and brunch, while restaurants such as The Grove and Honest Burgers cater to food lovers. Hammersmith Grove's proximity to major transport hubs makes it a convenient base, with easy access to the River Thames for scenic walks or a visit to the nearby Eventim Apollo for live entertainment.", user: new_user_1, hexagon: hexagon)
Hive.create!(name: "Brackenbury Village", notes: "One of West London's hidden gems, known for its peaceful, village-like atmosphere and picturesque Victorian houses. Nestled between Hammersmith and Shepherd's Bush, it offers a quieter alternative to the busier surrounding areas. The heart of the village is home to charming local businesses like the Brackenbury Wine Rooms and the family-run Sisi Hardware. There are several green spaces nearby, perfect for a leisurely stroll, and top-rated gastropubs such as The Anglesea Arms provide a cozy retreat. Its strong sense of community and excellent schools make Brackenbury Village a desirable residential spot.", user: new_user_1, hexagon: hexagon)
Hive.create!(name: "Askew Road", notes: "A a vibrant and evolving high street running through the heart of Shepherd's Bush, known for its mix of independent shops, artisan cafés, and local markets. The area has a creative and eclectic feel, with businesses like Laveli Bakery offering freshly baked goods and The Ginger Pig providing high-quality meats. The Eagle pub is a local favorite for its relaxed beer garden, while The Becklow Social and The Pocket Watch add to the thriving bar scene. Just a short walk from Ravenscourt Park and Wendell Park, Askew Road is a great place to explore for both shopping and socializing.", user: new_user_1, hexagon: hexagon)
Hive.create!(name: "Stamford Brook", notes: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", user: new_user_2, hexagon: hexagon)
puts "#{Hive.count} users created"

# Static seed data [DO NOT DELETE]
poi = [
  { category: "gym", name: "Anytime Fitness", lon: -0.0297, lat: 51.5248 },
  { category: "gym", name: "Anytime Fitness Hackney", lon: -0.0471, lat: 51.5497 },
  { category: "gym", name: "Anytime Fitness London Fields", lon: -0.0623, lat: 51.5452 },
  { category: "gym", name: "Anytime Fitness Mile End", lon: -0.0405, lat: 51.5224 },
  { category: "gym", name: "Anytime Fitness Stepney", lon: -0.0412, lat: 51.5209 },
  { category: "gym", name: "Barry's Bootcamp East London", lon: -0.0810, lat: 51.5206 },
  { category: "gym", name: "Barry's Bootcamp London", lon: -0.1463, lat: 51.5264 },
  { category: "gym", name: "Bethnal Green Leisure Centre", lon: -0.0534, lat: 51.5238 },
  { category: "gym", name: "Bethnal Green Weightlifting Club", lon: -0.0446, lat: 51.5236 },
  { category: "gym", name: "Bow Community Fitness", lon: -0.0277, lat: 51.5234 },
  { category: "gym", name: "BXR London", lon: -0.1562, lat: 51.5242 },
  { category: "gym", name: "Cyclebar Soho", lon: -0.1391, lat: 51.5141 },
  { category: "gym", name: "CrossFit 1971", lon: -0.0693, lat: 51.5142 },
  { category: "gym", name: "CrossFit Bethnal Green", lon: -0.0481, lat: 51.5227 },
  { category: "gym", name: "CrossFit London Fields", lon: -0.0570, lat: 51.5443 },
  { category: "gym", name: "CrossFit Mile End", lon: -0.0317, lat: 51.5264 },
  { category: "gym", name: "CrossFit Stepney", lon: -0.0410, lat: 51.5216 },
  { category: "gym", name: "David Lloyd Canary Wharf", lon: -0.0187, lat: 51.5071 },
  { category: "gym", name: "Energie Fitness Club", lon: -0.0491, lat: 51.5421 },
  { category: "gym", name: "Fieldworks Gym", lon: -0.0674, lat: 51.5483 },
  { category: "gym", name: "Fitness 4 Less", lon: -0.1033, lat: 51.4938 },
  { category: "gym", name: "Fitness First Bethnal Green", lon: -0.0512, lat: 51.5220 },
  { category: "gym", name: "Fitness First Hackney", lon: -0.0581, lat: 51.5444 },
  { category: "gym", name: "Fitness First Mile End", lon: -0.0290, lat: 51.5251 },
  { category: "gym", name: "Fitness First Shoreditch", lon: -0.0794, lat: 51.5200 },
  { category: "gym", name: "Fitness First Stepney", lon: -0.0402, lat: 51.5220 },
  { category: "gym", name: "Fitness First London Fields", lon: -0.0543, lat: 51.5435 },
  { category: "gym", name: "Fitness First Stepney", lon: -0.0402, lat: 51.5220 },
  { category: "gym", name: "Fitness4Less Bow", lon: -0.0237, lat: 51.5225 },
  { category: "gym", name: "Fitness4Less Mile End", lon: -0.0372, lat: 51.5257 },
  { category: "gym", name: "Fitness4Less Southwark", lon: -0.1033, lat: 51.4938 },
  { category: "gym", name: "Fitness4Less Stepney", lon: -0.0387, lat: 51.5221 },
  { category: "gym", name: "Fit4Less Tower Hamlets", lon: -0.0429, lat: 51.5172 },
  { category: "gym", name: "F45 Dalston", lon: -0.0767, lat: 51.5496 },
  { category: "gym", name: "F45 Bow", lon: -0.0205, lat: 51.5223 },
  { category: "gym", name: "F45 Training Hackney", lon: -0.0549, lat: 51.5426 },
  { category: "gym", name: "F45 Training London Bridge", lon: -0.0824, lat: 51.5059 },
  { category: "gym", name: "F45 Training Shoreditch", lon: -0.0843, lat: 51.5250 },
  { category: "gym", name: "Gymbox Bethnal Green", lon: -0.0455, lat: 51.5228 },
  { category: "gym", name: "Gymbox Hackney", lon: -0.0463, lat: 51.5486 },
  { category: "gym", name: "Gymbox Holborn", lon: -0.1176, lat: 51.5186 },
  { category: "gym", name: "Gymbox Kings Cross", lon: -0.1229, lat: 51.5315 },
  { category: "gym", name: "Gymbox London Fields", lon: -0.0535, lat: 51.5423 },
  { category: "gym", name: "Gymbox Mile End", lon: -0.0302, lat: 51.5229 },
  { category: "gym", name: "Gymbox Stepney", lon: -0.0399, lat: 51.5215 },
  { category: "gym", name: "Hackney Fitness Club", lon: -0.0482, lat: 51.5479 },
  { category: "gym", name: "Hackney Fitness Centre", lon: -0.0598, lat: 51.5423 },
  { category: "gym", name: "London Aquatics Centre", lon: -0.0165, lat: 51.5372 },
  { category: "gym", name: "London Fields Fitness Studio", lon: -0.0574, lat: 51.5364 },
  { category: "gym", name: "London Fields Fitness Centre", lon: -0.0543, lat: 51.5435 },
  { category: "gym", name: "London Fitness Mile End", lon: -0.0307, lat: 51.5226 },
  { category: "gym", name: "London Metropolitan University Gym", lon: -0.1042, lat: 51.5532 },
  { category: "gym", name: "Mile End Fitness Centre", lon: -0.0312, lat: 51.5221 },
  { category: "gym", name: "Mile End Park Leisure Centre", lon: -0.0291, lat: 51.5283 },
  { category: "gym", name: "Metropolitan Gym", lon: -0.1041, lat: 51.5134 },
  { category: "gym", name: "Nuffield Health Mile End", lon: -0.0395, lat: 51.5275 },
  { category: "gym", name: "Nuffield Health Shoreditch Fitness & Wellbeing Gym", lon: -0.0776, lat: 51.5253 },
  { category: "gym", name: "Nuffield Health Stepney", lon: -0.0421, lat: 51.5203 },
  { category: "gym", name: "PureGym Aldgate", lon: -0.0746, lat: 51.5145 },
  { category: "gym", name: "PureGym Aldgate East", lon: -0.0673, lat: 51.5144 },
  { category: "gym", name: "PureGym Bow", lon: -0.0206, lat: 51.5228 },
  { category: "gym", name: "PureGym Hackney", lon: -0.0522, lat: 51.5489 },
  { category: "gym", name: "PureGym London Borough", lon: -0.0878, lat: 51.5016 },
  { category: "gym", name: "PureGym London Great Portland Street", lon: -0.1404, lat: 51.5183 },
  { category: "gym", name: "PureGym Mile End", lon: -0.0331, lat: 51.5200 },
  { category: "gym", name: "PureGym Stepney", lon: -0.0408, lat: 51.5211 },
  { category: "gym", name: "Qmotion Sport & Fitness Centre", lon: -0.0369, lat: 51.5243 },
  { category: "gym", name: "Reebok CrossFit 3D", lon: -0.0752, lat: 51.5160 },
  { category: "gym", name: "SoulCycle East London", lon: -0.0807, lat: 51.5237 },
  { category: "gym", name: "SPACe", lon: -0.0473, lat: 51.5345 },
  { category: "gym", name: "Sweat by BXR", lon: -0.1581, lat: 51.5233 },
  { category: "gym", name: "Sweat by Bow", lon: -0.0272, lat: 51.5209 },
  { category: "gym", name: "The Foundry Bethnal Green", lon: -0.0458, lat: 51.5225 },
  { category: "gym", name: "The Foundry Climbing Centre", lon: -0.1040, lat: 51.5223 },
  { category: "gym", name: "The Foundry Hackney", lon: -0.0427, lat: 51.5495 },
  { category: "gym", name: "The Foundry Mile End", lon: -0.0324, lat: 51.5278 },
  { category: "gym", name: "The Foundry Stepney", lon: -0.0399, lat: 51.5215 },
  { category: "gym", name: "The Gym Group Bethnal Green", lon: -0.0576, lat: 51.5222 },
  { category: "gym", name: "The Gym Group Bow", lon: -0.0270, lat: 51.5227 },
  { category: "gym", name: "The Gym Group Bow Road", lon: -0.0274, lat: 51.5238 },
  { category: "gym", name: "The Gym Group Hackney", lon: -0.0528, lat: 51.5406 },
  { category: "gym", name: "The Gym Group London Angel", lon: -0.1055, lat: 51.5331 },
  { category: "gym", name: "The Gym Group London Fields", lon: -0.0543, lat: 51.5435 },
  { category: "gym", name: "The Gym Group Oxford Street", lon: -0.1421, lat: 51.5174 },
  { category: "gym", name: "The Gym Group Stepney", lon: -0.0395, lat: 51.5202 },
  { category: "gym", name: "The Gym Group Waterloo", lon: -0.1102, lat: 51.5051 },
  { category: "gym", name: "The Gym Group Bloomsbury", lon: -0.1307, lat: 51.5218 },
  { category: "gym", name: "The Healthy Living Gym", lon: -0.0499, lat: 51.5218 },
  { category: "gym", name: "The Third Space Shoreditch", lon: -0.0846, lat: 51.5228 },
  { category: "gym", name: "Victoria Park", lon: -0.0439, lat: 51.5360 },
  { category: "gym", name: "Westfield Stratford City Gym", lon: -0.0048, lat: 51.5418 },
  { category: "gym", name: "W10 Fitness", lon: -0.2033, lat: 51.5239 },
  { category: "station", name: "Acton Central", lat: 51.5088, lon: -0.2634 },
  { category: "station", name: "Acton Main Line", lat: 51.5169, lon: -0.2669 },
  { category: "station", name: "Albany Park", lat: 51.4358, lon: 0.1266 },
  { category: "station", name: "Aldgate", lat: 51.5140, lon: -0.0756 },
  { category: "station", name: "Aldgate East", lat: 51.5154, lon: -0.0727 },
  { category: "station", name: "Alexandra Palace", lat: 51.5983, lon: -0.1197 },
  { category: "station", name: "Anerley", lat: 51.4125, lon: -0.0651 },
  { category: "station", name: "Angel", lat: 51.5327, lon: -0.1030 },
  { category: "station", name: "Balham", lat: 51.4426, lon: -0.1520 },
  { category: "station", name: "Banstead", lat: 51.3292, lon: -0.2132 },
  { category: "station", name: "Bank", lat: 51.5134, lon: -0.0890 },
  { category: "station", name: "Barking", lat: 51.5393, lon: 0.0817 },
  { category: "station", name: "Barking Riverside", lat: 51.5191, lon: 0.1147 },
  { category: "station", name: "Barnehurst", lat: 51.4648, lon: 0.1595 },
  { category: "station", name: "Barnes", lat: 51.4671, lon: -0.242 },
  { category: "station", name: "Barnes Bridge", lat: 51.4722, lon: -0.2523 },
  { category: "station", name: "Battersea Park", lat: 51.4779, lon: -0.1477 },
  { category: "station", name: "Beckenham Hill", lat: 51.4246, lon: -0.0161 },
  { category: "station", name: "Beckenham Junction", lat: 51.4109, lon: -0.0257 },
  { category: "station", name: "Bellingham", lat: 51.4342, lon: -0.0199 },
  { category: "station", name: "Belmont", lat: 51.344, lon: -0.1986 },
  { category: "station", name: "Belvedere", lat: 51.4927, lon: 0.1524 },
  { category: "station", name: "Berrylands", lat: 51.3988, lon: -0.2803 },
  { category: "station", name: "Bethnal Green", lat: 51.523, lon: -0.0595 },
  { category: "station", name: "Bethnal Green Overground", lat: 51.5241, lon: 0.0601 },
  { category: "station", name: "Bexley", lat: 51.4403, lon: 0.1479 },
  { category: "station", name: "Bexleyheath", lat: 51.4635, lon: 0.1338 },
  { category: "station", name: "Bickley", lat: 51.3995, lon: 0.0441 },
  { category: "station", name: "Birkbeck", lat: 51.4039, lon: -0.0568 },
  { category: "station", name: "BlackfriarsLondon", lat: 51.5116, lon: -0.103 },
  { category: "station", name: "Blackheath", lat: 51.4663, lon: 0.0064 },
  { category: "station", name: "Blackhorse Road", lat: 51.5866, lon: -0.0416 },
  { category: "station", name: "Bond Street", lat: 51.5142, lon: -0.1485 },
  { category: "station", name: "Borough", lat: 51.5047, lon: -0.0912 },
  { category: "station", name: "Bow Road", lat: 51.5265, lon: -0.0247 },
  { category: "station", name: "Bowes Park", lat: 51.6078, lon: -0.1209 },
  { category: "station", name: "Brent Cross West", lat: 51.5687, lon: -0.2269 },
  { category: "station", name: "Brentford", lat: 51.4875, lon: -0.3096 },
  { category: "station", name: "Brimsdown", lat: 51.6556, lon: -0.0301 },
  { category: "station", name: "Brixton", lat: 51.4629, lon: -0.1132 },
  { category: "station", name: "Brockley", lat: 51.4645, lon: -0.0369 },
  { category: "station", name: "Bromley North", lat: 51.4088, lon: 0.0179 },
  { category: "station", name: "Bromley South", lat: 51.4004, lon: 0.0181 },
  { category: "station", name: "Brondesbury", lat: 51.5451, lon: -0.202 },
  { category: "station", name: "Brondesbury Park", lat: 51.5407, lon: -0.2103 },
  { category: "station", name: "Bruce Grove", lat: 51.594, lon: -0.0704 },
  { category: "station", name: "Bush Hill Park", lat: 51.6418, lon: -0.0691 },
  { category: "station", name: "Caledonian Road & Barnsbury", lat: 51.5432, lon: -0.1145 },
  { category: "station", name: "Cambridge Heath", lat: 51.5321, lon: -0.0572 },
  { category: "station", name: "Camden Road", lat: 51.5444, lon: -0.1401 },
  { category: "station", name: "Camden Town", lat: 51.5419, lon: -0.1448 },
  { category: "station", name: "Canada Water", lat: 51.4983, lon: -0.05 },
  { category: "station", name: "Canary Wharf", lat: 51.5061, lon: -0.0158 },
  { category: "station", name: "Cannon StreetLondon", lat: 51.5101, lon: -0.0912 },
  { category: "station", name: "Canonbury", lat: 51.5482, lon: -0.0925 },
  { category: "station", name: "Carshalton", lat: 51.3686, lon: -0.1659 },
  { category: "station", name: "Carshalton Beeches", lat: 51.3577, lon: -0.1714 },
  { category: "station", name: "Castle Bar Park", lat: 51.5228, lon: -0.3323 },
  { category: "station", name: "Caterham", lat: 51.2821, lon: -0.0783 },
  { category: "station", name: "Catford", lat: 51.4447, lon: -0.0261 },
  { category: "station", name: "Catford Bridge", lat: 51.4446, lon: -0.025 },
  { category: "station", name: "Chadwell Heath", lat: 51.5678, lon: 0.1292 },
  { category: "station", name: "Charing Cross", lat: 51.5075, lon: -0.1231 },
  { category: "station", name: "Charlton", lat: 51.4868, lon: 0.031 },
  { category: "station", name: "Cheam", lat: 51.356, lon: -0.2147 },
  { category: "station", name: "Chelsfield", lat: 51.3565, lon: 0.1076 },
  { category: "station", name: "Chessington North", lat: 51.3642, lon: -0.3005 },
  { category: "station", name: "Chessington South", lat: 51.3569, lon: -0.308 },
  { category: "station", name: "Chingford", lat: 51.6331, lon: 0.0094 },
  { category: "station", name: "Chipstead", lat: 51.3093, lon: -0.1693 },
  { category: "station", name: "Chislehurst", lat: 51.4057, lon: 0.0573 },
  { category: "station", name: "Chiswick", lat: 51.4813, lon: -0.2683 },
  { category: "station", name: "City ThameslinkLondon", lat: 51.5163, lon: -0.1037 },
  { category: "station", name: "Clapham High Street", lat: 51.4658, lon: -0.1328 },
  { category: "station", name: "Clapham Junction", lat: 51.4654, lon: -0.1704 },
  { category: "station", name: "Clapton", lat: 51.5634, lon: -0.0553 },
  { category: "station", name: "Colindale", lat: 51.6019, lon: -0.2346 },
  { category: "station", name: "Colliers Wood", lat: 51.4107, lon: -0.1986 },
  { category: "station", name: "Congleton", lat: 53.1606, lon: -2.2083 },
  { category: "station", name: "Convent Garden", lat: 51.5122, lon: -0.1253 },
  { category: "station", name: "Cranbrook", lat: 51.4019, lon: -0.0487 },
  { category: "station", name: "Crofton Park", lat: 51.4481, lon: -0.0427 },
  { category: "station", name: "Cromwell Road", lat: 51.4893, lon: -0.1968 },
  { category: "station", name: "Croydon", lat: 51.372, lon: -0.0994 },
  { category: "station", name: "Cumbernauld", lat: 55.9646, lon: -3.889 },
  { category: "station", name: "Dagenham", lat: 51.543, lon: 0.1405 },
  { category: "station", name: "Dalston Junction", lat: 51.5488, lon: -0.0876 },
  { category: "station", name: "Dalston Kingsland", lat: 51.5464, lon: -0.0814 },
  { category: "station", name: "Danbury", lat: 51.7125, lon: 0.5264 },
  { category: "station", name: "Dartford", lat: 51.446, lon: 0.2237 },
  { category: "station", name: "Deptford", lat: 51.4781, lon: -0.0235 },
  { category: "station", name: "Deptford Bridge", lat: 51.4759, lon: -0.0279 },
  { category: "station", name: "Denham", lat: 51.582, lon: -0.4985 },
  { category: "station", name: "Denham Golf Club", lat: 51.5803, lon: -0.4956 },
  { category: "station", name: "Dorking", lat: 51.2332, lon: -0.3379 },
  { category: "station", name: "Dorking Deepdene", lat: 51.2267, lon: -0.3316 },
  { category: "station", name: "East Croydon", lat: 51.375, lon: -0.0872 },
  { category: "station", name: "East Finchley", lat: 51.5893, lon: -0.1593 },
  { category: "station", name: "East Ham", lat: 51.5405, lon: 0.0592 },
  { category: "station", name: "East Putney", lat: 51.4635, lon: -0.2156 },
  { category: "station", name: "Eastbourne", lat: 50.7705, lon: 0.2695 },
  { category: "station", name: "Ealing Broadway", lat: 51.5135, lon: -0.3025 },
  { category: "station", name: "Ealing Common", lat: 51.5079, lon: -0.2988 },
  { category: "station", name: "Ealing Mortlake", lat: 51.4815, lon: -0.2643 },
  { category: "station", name: "Ealing South", lat: 51.5023, lon: -0.3027 },
  { category: "station", name: "Ealing West", lat: 51.4961, lon: -0.3207 },
  { category: "station", name: "Earls Court", lat: 51.493, lon: -0.1905 },
  { category: "station", name: "East Finchley", lat: 51.591, lon: -0.1654 },
  { category: "station", name: "East Grinstead", lat: 51.1324, lon: -0.0186 },
  { category: "station", name: "East Ham", lat: 51.5362, lon: 0.0425 },
  { category: "station", name: "East London", lat: 51.5064, lon: 0.0596 },
  { category: "station", name: "East Thornton Heath", lat: 51.3751, lon: -0.0973 },
  { category: "station", name: "Edgware", lat: 51.6165, lon: -0.2768 },
  { category: "station", name: "Elmers End", lat: 51.3996, lon: -0.0582 },
  { category: "station", name: "Eltham", lat: 51.4586, lon: 0.0814 },
  { category: "station", name: "Embankment", lat: 51.5079, lon: -0.1255 },
  { category: "station", name: "Epsom", lat: 51.3289, lon: -0.2666 },
  { category: "station", name: "Epsom Downs", lat: 51.3414, lon: -0.2358 },
  { category: "station", name: "Euston", lat: 51.5282, lon: -0.1322 },
  { category: "station", name: "Farringdon", lat: 51.5208, lon: -0.1048 },
  { category: "station", name: "Feltham", lat: 51.4467, lon: -0.4132 },
  { category: "station", name: "Fenchurch Street", lat: 51.5122, lon: -0.0777 },
  { category: "station", name: "Finchley Road", lat: 51.5513, lon: -0.1866 },
  { category: "station", name: "Forest Gate", lat: 51.5489, lon: 0.0299 },
  { category: "station", name: "Forest Hill", lat: 51.4481, lon: -0.0646 },
  { category: "station", name: "Fulham Broadway", lat: 51.4798, lon: -0.1943 },
  { category: "station", name: "Gants Hill", lat: 51.5741, lon: 0.0543 },
  { category: "station", name: "Gatwick Airport", lat: 51.1471, lon: -0.1901 },
  { category: "station", name: "Glasgow Central", lat: 55.8581, lon: -4.2591 },
  { category: "station", name: "Gillingham", lat: 51.3887, lon: 0.5396 },
  { category: "station", name: "Golders Green", lat: 51.5774, lon: -0.2019 },
  { category: "station", name: "Goodge Street", lat: 51.5227, lon: -0.1338 },
  { category: "station", name: "Greenford", lat: 51.5436, lon: -0.3253 },
  { category: "station", name: "Greenwich", lat: 51.4762, lon: -0.0075 },
  { category: "station", name: "Hackney Central", lat: 51.5463, lon: -0.0545 },
  { category: "station", name: "Hackney Downs", lat: 51.5487, lon: -0.0617 },
  { category: "station", name: "Hackney Wick", lat: 51.5435, lon: -0.0255 },
  { category: "station", name: "Haggerston", lat: 51.5392, lon: -0.0741 },
  { category: "station", name: "Hainault", lat: 51.5959, lon: 0.1083 },
  { category: "station", name: "Halifax", lat: 53.7175, lon: -1.8553 },
  { category: "station", name: "Hammersmith", lat: 51.4937, lon: -0.2243 },
  { category: "station", name: "Hampstead", lat: 51.5563, lon: -0.1747 },
  { category: "station", name: "Harringay", lat: 51.5778, lon: -0.0998 },
  { category: "station", name: "Harrow & Wealdstone", lat: 51.5934, lon: -0.3323 },
  { category: "station", name: "Harrow-on-the-Hill", lat: 51.5801, lon: -0.3382 },
  { category: "station", name: "Hatton Cross", lat: 51.4628, lon: -0.4562 },
  { category: "station", name: "Heathrow Terminal 4", lat: 51.4725, lon: -0.4528 },
  { category: "station", name: "Heathrow Terminal 5", lat: 51.4713, lon: -0.4901 },
  { category: "station", name: "Hendon", lat: 51.6023, lon: -0.2226 },
  { category: "station", name: "High Barnet", lat: 51.6539, lon: -0.2001 },
  { category: "station", name: "Highbury & Islington", lat: 51.5467, lon: -0.1032 },
  { category: "station", name: "Highgate", lat: 51.5777, lon: -0.1428 },
  { category: "station", name: "Hillingdon", lat: 51.5471, lon: -0.4734 },
  { category: "station", name: "Homerton", lat: 51.5477, lon: -0.0429 },
  { category: "station", name: "Hounslow", lat: 51.4755, lon: -0.3702 },
  { category: "station", name: "Hounslow Central", lat: 51.4748, lon: -0.3631 },
  { category: "station", name: "Hounslow East", lat: 51.4768, lon: -0.3662 },
  { category: "station", name: "Hounslow West", lat: 51.4753, lon: -0.3852 },
  { category: "station", name: "Hoxton", lat: 51.5312, lon: -0.0767 },
  { category: "station", name: "Hyde Park Corner", lat: 51.5058, lon: -0.1479 },
  { category: "station", name: "Ickenham", lat: 51.5513, lon: -0.4196 },
  { category: "station", name: "Ilford", lat: 51.5619, lon: 0.0819 },
  { category: "station", name: "Imperial Wharf", lat: 51.4725, lon: -0.1817 },
  { category: "station", name: "Ipswich", lat: 52.0577, lon: 1.1552 },
  { category: "station", name: "Kensal Green", lat: 51.5302, lon: -0.2241 },
  { category: "station", name: "Kensington (Olympia)", lat: 51.4958, lon: -0.2059 },
  { category: "station", name: "Kentish Town", lat: 51.5491, lon: -0.1449 },
  { category: "station", name: "Kilburn", lat: 51.5503, lon: -0.2043 },
  { category: "station", name: "King's Cross", lat: 51.5305, lon: -0.1235 },
  { category: "station", name: "Kingston", lat: 51.4115, lon: -0.3030 },
  { category: "station", name: "Kirkcaldy", lat: 56.0690, lon: -3.1641 },
  { category: "station", name: "Ladbroke Grove", lat: 51.5182, lon: -0.2135 },
  { category: "station", name: "Lambeth North", lat: 51.4995, lon: -0.1105 },
  { category: "station", name: "Lancaster Gate", lat: 51.5145, lon: -0.1797 },
  { category: "station", name: "Langdon Park", lat: 51.5235, lon: -0.0094 },
  { category: "station", name: "Leicester Square", lat: 51.5114, lon: -0.1280 },
  { category: "station", name: "Lewisham", lat: 51.4642, lon: -0.0057 },
  { category: "station", name: "Limehouse", lat: 51.5106, lon: -0.0372 },
  { category: "station", name: "Liverpool Street", lat: 51.5175, lon: -0.0823 },
  { category: "station", name: "London Bridge", lat: 51.5045, lon: -0.0865 },
  { category: "station", name: "London Cannon Street", lat: 51.5105, lon: -0.0870 },
  { category: "station", name: "London Fields", lat: 51.5422, lon: -0.0575 },
  { category: "station", name: "London Liverpool Street", lat: 51.5185, lon: -0.0814 },
  { category: "station", name: "London Victoria", lat: 51.4960, lon: -0.1445 },
  { category: "station", name: "Loughton", lat: 51.6362, lon: 0.0609 },
  { category: "station", name: "Maida Vale", lat: 51.5291, lon: -0.1836 },
  { category: "station", name: "Manor House", lat: 51.5653, lon: -0.0899 },
  { category: "station", name: "Margate", lat: 51.3810, lon: 1.3866 },
  { category: "station", name: "Mile End", lat: 51.5216, lon: -0.0439 },
  { category: "station", name: "Mill Hill East", lat: 51.6091, lon: -0.2019 },
  { category: "station", name: "Morden", lat: 51.3982, lon: -0.1987 },
  { category: "station", name: "Mornington Crescent", lat: 51.5344, lon: -0.1330 },
  { category: "station", name: "New Cross", lat: 51.4757, lon: -0.0436 },
  { category: "station", name: "New Cross Gate", lat: 51.4747, lon: -0.0510 },
  { category: "station", name: "North Acton", lat: 51.5234, lon: -0.2703 },
  { category: "station", name: "North Ealing", lat: 51.5226, lon: -0.2803 },
  { category: "station", name: "North Greenwich", lat: 51.5031, lon: 0.0005 },
  { category: "station", name: "Northumberland Park", lat: 51.6027, lon: -0.0659 },
  { category: "station", name: "Notting Hill Gate", lat: 51.5096, lon: -0.1970 },
  { category: "station", name: "Old Street", lat: 51.5259, lon: -0.0872 },
  { category: "station", name: "Oval", lat: 51.4867, lon: -0.1022 },
  { category: "station", name: "Paddington", lat: 51.5154, lon: -0.1745 },
  { category: "station", name: "Pimlico", lat: 51.4919, lon: -0.1295 },
  { category: "station", name: "Pitsea", lat: 51.5570, lon: 0.5077 },
  { category: "station", name: "Preston Park", lat: 50.8479, lon: -0.1419 },
  { category: "station", name: "Pudding Mill Lane", lat: 51.5147, lon: -0.0101 },
  { category: "station", name: "Putney", lat: 51.4654, lon: -0.2120 },
  { category: "station", name: "Queen's Park", lat: 51.5294, lon: -0.2073 },
  { category: "station", name: "Rotherhithe", lat: 51.4983, lon: -0.0453 },
  { category: "station", name: "Royal Albert Hall", lat: 51.5010, lon: -0.1770 },
  { category: "station", name: "Royal Oak", lat: 51.5170, lon: -0.1999 },
  { category: "station", name: "Russell Square", lat: 51.5242, lon: -0.1253 },
  { category: "station", name: "Shadwell", lat: 51.5107, lon: -0.0458 },
  { category: "station", name: "Shepherd's Bush", lat: 51.5042, lon: -0.2207 },
  { category: "station", name: "Shoreditch High Street", lat: 51.5235, lon: -0.0755 },
  { category: "station", name: "Sidcup", lat: 51.4219, lon: 0.1189 },
  { category: "station", name: "Silvertown", lat: 51.5107, lon: -0.0395 },
  { category: "station", name: "South Acton", lat: 51.4971, lon: -0.2749 },
  { category: "station", name: "South Bank", lat: 51.5056, lon: -0.1111 },
  { category: "station", name: "South Harrow", lat: 51.5561, lon: -0.3442 },
  { category: "station", name: "South Kensington", lat: 51.4945, lon: -0.1766 },
  { category: "station", name: "South Quay", lat: 51.5021, lon: -0.0223 },
  { category: "station", name: "Southend Victoria", lat: 51.5490, lon: 0.7055 },
  { category: "station", name: "Southgate", lat: 51.6317, lon: -0.1343 },
  { category: "station", name: "Southwark", lat: 51.5040, lon: -0.1030 },
  { category: "station", name: "St. Albans City", lat: 51.7489, lon: -0.3308 },
  { category: "station", name: "St. James's Park", lat: 51.4996, lon: -0.1349 },
  { category: "station", name: "St. John's Wood", lat: 51.5371, lon: -0.1773 },
  { category: "station", name: "St. Pancras International", lat: 51.5304, lon: -0.1260 },
  { category: "station", name: "St. Paul's", lat: 51.5139, lon: -0.0984 },
  { category: "station", name: "St. Mary's Cray", lat: 51.3962, lon: 0.1349 },
  { category: "station", name: "Stepney Green", lat: 51.5215, lon: -0.0466 },
  { category: "station", name: "Stratford", lat: 51.5414, lon: -0.0032 },
  { category: "station", name: "Sutton", lat: 51.3602, lon: -0.1926 },
  { category: "station", name: "Surbiton", lat: 51.3885, lon: -0.3007 },
  { category: "station", name: "Swiss Cottage", lat: 51.5490, lon: -0.1782 },
  { category: "station", name: "Temple", lat: 51.5120, lon: -0.1123 },
  { category: "station", name: "Thornton Heath", lat: 51.3995, lon: -0.1014 },
  { category: "station", name: "Tottenham", lat: 51.5889, lon: -0.0656 },
  { category: "station", name: "Tottenham Hale", lat: 51.5956, lon: -0.0629 },
  { category: "station", name: "Tower Hill", lat: 51.5097, lon: -0.0769 },
  { category: "station", name: "Tufnell Park", lat: 51.5525, lon: -0.1412 },
  { category: "station", name: "Turnham Green", lat: 51.4930, lon: -0.2682 },
  { category: "station", name: "Tulse Hill", lat: 51.4456, lon: -0.1029 },
  { category: "station", name: "Upminster", lat: 51.5555, lon: 0.2593 },
  { category: "station", name: "Upminster Bridge", lat: 51.5505, lon: 0.2461 },
  { category: "station", name: "Vauxhall", lat: 51.4844, lon: -0.1187 },
  { category: "station", name: "Walthamstow Central", lat: 51.5813, lon: -0.0164 },
  { category: "station", name: "Wapping", lat: 51.5072, lon: -0.0592 },
  { category: "station", name: "Waterloo", lat: 51.5030, lon: -0.1135 },
  { category: "station", name: "West Acton", lat: 51.5191, lon: -0.2743 },
  { category: "station", name: "West Brompton", lat: 51.4915, lon: -0.1944 },
  { category: "station", name: "West Hampstead", lat: 51.5533, lon: -0.1899 },
  { category: "station", name: "West Kensington", lat: 51.4914, lon: -0.2087 },
  { category: "station", name: "West Norwood", lat: 51.4349, lon: -0.1049 },
  { category: "station", name: "West Ruislip", lat: 51.5651, lon: -0.3961 },
  { category: "station", name: "West Sutton", lat: 51.3751, lon: -0.1976 },
  { category: "station", name: "Westbourne Park", lat: 51.5217, lon: -0.1959 },
  { category: "station", name: "Whitechapel", lat: 51.5105, lon: -0.0605 },
  { category: "station", name: "Willesden Junction", lat: 51.5274, lon: -0.2252 },
  { category: "station", name: "Wimbledon", lat: 51.4236, lon: -0.2170 },
  { category: "station", name: "Wimbledon Park", lat: 51.4279, lon: -0.2069 },
  { category: "station", name: "Wood Green", lat: 51.5953, lon: -0.1069 },
  { category: "station", name: "Woodford", lat: 51.6091, lon: 0.0194 },
  { category: "station", name: "Woolwich Arsenal", lat: 51.4865, lon: 0.0753 },
  { category: "station", name: "Worcester Park", lat: 51.3809, lon: -0.2467 },
  { category: "yoga studio", name: "Yoganest at St Margaret's House", lat: 51.5275, lon: -0.0575 },
  { category: "yoga studio", name: "London Buddhist Centre", lat: 51.5270, lon: -0.0630 },
  { category: "yoga studio", name: "Hotpod Yoga Hackney", lat: 51.5395, lon: -0.0580 },
  { category: "yoga studio", name: "MoreYoga Aldgate", lat: 51.5155, lon: -0.0710 },
  { category: "yoga studio", name: "Anjani Kundalini Yoga", lat: 51.5275, lon: -0.0330 }
]

# Location categories for MapBox query
places = ["Bar",
          "Cafe",
          "Church",
          "Cinema",
          "Cocktail Bar",
          "Deli",
          "Gym",
          "Hospital",
          "Market",
          "Museum",
          "Mosque",
          "Park",
          "Pub",
          "Spa",
          "Station",
          "Restaurant",
          "Supermarket",
          "Synagogue",
          "Theatre",
          "University",
          "Wine Bar"]

access_token = ENV['MAPBOX_API_KEY']

# London bounds
# bounds = [-0.489, 51.28, 0.236, 51.686]

# Queen Mary Uni coords
centre_point = [-0.04063119, 51.52406612]

# Define bounding box points
nw_point = [centre_point[0] + 0.03825, centre_point[1] + 0.02395]
se_point = [centre_point[0] - 0.03825, centre_point[1] - 0.02395]

# Steps of ~400m in lat / lon to mirror size of hexagons
lon_step = 0.005
lat_step = 0.0036

# Iterate over the bounding box in 400m steps
(se_point[1]..nw_point[1]).step(lat_step) do |lat|
  (se_point[0]..nw_point[0]).step(lon_step) do |lon|
    bounds = [lon, lat, lon + lon_step, lat + lat_step]

    places.each do |place|
      formatted_place = place.downcase.gsub(' ', '+')
      uri = URI("https://api.mapbox.com/search/searchbox/v1/category/#{formatted_place}?access_token=#{access_token}&language=en&limit=25&bbox=#{bounds.join(',')}")

      response = Net::HTTP.get(uri)
      data = JSON.parse(response)

      location = data["features"]&.map do |feature|
        {
          category: place.downcase,
          name: feature["properties"]["name"],
          lat: feature["geometry"]["coordinates"][1],
          lon: feature["geometry"]["coordinates"][0]
        }
      end || []

      poi << location
    end
  end
end

puts "> Creating POIs..."

# Create each POI instance
poi.each { |i| Poi.create!(i) }
# Update POI category names
# Poi.where("LOWER(category) = ?", "subway station").find_each do |poi|
#   poi.update(category: "station")
# end

puts "> #{Poi.where(category: 'bar').count} bar created"
puts "> #{Poi.where(category: 'cafe').count} cafes created"
puts "> #{Poi.where(category: 'cinema').count} cinemas created"
puts "> #{Poi.where(category: 'church').count} churches created"
puts "> #{Poi.where(category: 'gym').count} gyms created"
puts "> #{Poi.where(category: 'hospital').count} hospitals created"
puts "> #{Poi.where(category: 'market').count} markets created"
puts "> #{Poi.where(category: 'mosque').count} mosques created"
puts "> #{Poi.where(category: 'museum').count} museums created"
puts "> #{Poi.where(category: 'park').count} parks created"
puts "> #{Poi.where(category: 'pub').count} pubs created"
puts "> #{Poi.where(category: 'restaurant').count} restaurants created"
puts "> #{Poi.where(category: 'station').count} stations created"
puts "> #{Poi.where(category: 'supermarket').count} supermarkets created"
puts "> #{Poi.where(category: 'synagogue').count} synagogues created"
puts "> #{Poi.where(category: 'theatre').count} theatres created"
puts "> #{Poi.where(category: 'university').count} universities created"
puts "> #{Poi.where(category: 'yoga studio').count} yoga studios created"
