# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Cleaning Database"
User.destroy_all
HexGrid.destroy_all
Hexagon.destroy_all
Hive.destroy_all
Filter.destroy_all

puts "> Creating Users"
new_user_1 = User.create!(first_name: "Tom", last_name: "Jones", email: "tom@gmail.com", password: "123456")
new_user_2 = User.create!(first_name: "Ben", last_name: "Hill", email: "ben@gmail.com", password: "123456")
puts "#{User.count} users created"

# Below will be deleted after API will be used instead

puts "> Creating Hex Grids"
hex_grid = HexGrid.create!(min_lat: 51.286760, min_lon: -0.510375, max_lat: 51.691874, max_lon: 51.691874, hexagon_width: 0.4)
# Min and Max coordinates define bounding box
puts "#{HexGrid.count} users created"

puts "> Creating Hexagons"
hexagon = Hexagon.create!(lon: -0.1278, lat: 51.5074, hex_grid: hex_grid)
puts "#{Hexagon.count} users created"

puts "> Creating Hives"
hive = Hive.create!(name: "Hive Test 01", notes: "Lets see", user: new_user_1, hexagon: hexagon)
puts "#{Hive.count} users created"

puts "> Creating Filters"
filter = Filter.create!(category: "bar", associated_distance: "4", hexagon: hexagon)
puts "#{Filter.count} users created"
