# Add scraped locations to sort and refine into the "places" array
places = [

]

def order_and_remove_duplicates(array)
  array.uniq { |object| [object[:category], object[:name], object[:lat], object[:lon]]  }
     .sort_by { |object| object[:name] }
end

output = order_and_remove_duplicates(places)
puts output
