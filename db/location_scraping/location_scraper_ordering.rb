# Add scraped locations to sort and refine into the "places" array
places = [
  { category: "", name: "Anytime Fitness Stepney", lon: -0.0412, lat: 51.5209 },
  { category: "gym", name: "Anytime Fitness", lon: -0.0297, lat: 51.5248 },
  { category: "gym", name: "Anytime Fitness Hackney", lon: -0.0471, lat: 51.5497 },
  { category: "gym", name: "Anytime Fitness London Fields", lon: -0.0623, lat: 51.5452 },
  { category: "gym", name: "Anytime Fitness Mile End", lon: -0.0405, lat: 51.5224 },
  { category: "gym", name: "Anytime Fitness Stepney", lon: -0.0412, lat: 51.5209 },
]

# def order_and_remove_duplicates(array)
#   array.uniq { |object| [object[:category], object[:name], object[:lat], object[:lon]] }
#      .sort_by { |object| object[:name] }
# end

# output = order_and_remove_duplicates(places)
# puts output

def order_and_remove_duplicates(array)
  array.uniq { |object| [object[:category], object[:name], object[:lat], object[:lon]] }
  array.filter { |object| object[:category].length.positive? }
end

output = order_and_remove_duplicates(places)
puts output
