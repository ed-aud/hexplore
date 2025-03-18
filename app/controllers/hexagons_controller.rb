class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])
    @poi = get_points_of_interest(@hexagon.lat, @hexagon.lon, params[:poi_params])
    @markers = create_markers_object(@poi)
    @hives = Hive.all
    @questions = Question.all
    @question = Question.new

    @categoryIcons = {
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
  end

  def new
    @hexagon = Hexagon.new
  end

  def create
    @hexagon = Hexagon.new(hexagon_params)
    if @hexagon.save
      redirect_to hexagon_path(@hexagon, poi_params: params[:pois])
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def create_markers_object(arr)
    poi = []
    poi[0] = { lat: @hexagon.lat,
               lng: @hexagon.lon }
    arr.each do |el|
      poi << { lat: el.lat,
               lng: el.lon,
               info_window_html: render_to_string(partial: "shared/info_window",
               locals: { poi: el })
             }
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
    params.require(:hexagon).permit(:lat, :lon, :pois)
  end
end
