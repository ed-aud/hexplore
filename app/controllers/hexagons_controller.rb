class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])
    @pois = get_points_of_interest(@hexagon.lat, @hexagon.lon, params[:poi_params])
    @markers = create_markers(@pois)
    @hives = Hive.all
    @questions = Question.all
    @question = Question.new
    @itinerary = Itinerary.new
    @category_icons = {
      pub: 'beer-mug-empty',
      station: 'train',
      church: 'church',
      spa: 'spa',
      restaurant: 'utensils',
      park: 'tree-city',
      gym: 'dumbbell',
      cafe: 'mug-saucer',
      supermarket: 'store',
      cinema: 'film',
      hospital: 'hospital',
      mosque: 'mosque',
      winebar: 'wine-glass',
      yogastudio: 'hands-praying',
      synagogue: 'synagogue',
      museum: 'landmark',
      university: 'landmark-flag',
      theatre: 'masks-theater'
    }
    @myparam = { address: params[:address][9..].gsub('+', ' ').gsub('%', ' ')}

    @clickedFilters = {poi_params: params[:poi_params]}

  end

  def new
    @hexagon = Hexagon.new
  end

  def create
    @hexagon = Hexagon.new(hexagon_params)
    if @hexagon.save
      redirect_to hexagon_path(@hexagon, poi_params: params[:pois], address: params[:myparam])
    else
      render 'new', status: :unprocessable_entity
    end
    # raise
  end

  private

  def create_markers(array)
    poi = []
    poi[0] = { lat: @hexagon.lat,
               lon: @hexagon.lon }
    array.each do |element|
      poi << { lat: element.lat,
               lon: element.lon,
               info_window_html: render_to_string(partial: "shared/info_window", locals: { poi: element }) }
    end
    return poi
  end

  def get_points_of_interest(lat, lon, pois)
    min_lat = lat - 0.0018
    min_lon = lon - 0.0029
    max_lat = lat + 0.0018
    max_lon = lon + 0.0029

    displayed_locations = []

    selected_categories = pois.split(",")
    selected_categories.each do |category|
      displayed_locations << Poi.where(category: category, lat: min_lat..max_lat, lon: min_lon..max_lon)
    end

    poi = displayed_locations.flatten
    return poi
  end

  def set_hexagon
    @hexagon = Hexagon.find(params[:id])
  end

  def hexagon_params
    params.require(:hexagon).permit(:lat, :lon, :pois, :myparam, :clickedFilters)
  end
end
