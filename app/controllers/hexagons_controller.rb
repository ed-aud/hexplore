class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])

    @pois = Poi.all
    @poi = get_points_of_interest(@hexagon.lat, @hexagon.lon)
    @markers = create_makers_object(@poi)
    @hives = Hive.all
    @questions = Question.all
    @question = Question.new
    @itinerary = Itinerary.new

    @fontAwsomeIcons = {
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
      # @itinerary = Itinerary.create(user: current_user)
      # ItineraryJob.set(wait: 2.second).perform_later(@hexagon, @itinerary)
      redirect_to hexagon_path(@hexagon)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def create_makers_object(arr)
    poi = []
    poi[0] = { lat: @hexagon.lat,
               lng: @hexagon.lon }
    arr.each do |el|
      poi << { lat: el.lat, lng: el.lon, info_window_html: render_to_string(partial: "shared/info_window", locals: {poi: el}) }
    end
    return poi
  end

  def get_points_of_interest(lat, lon)
    min_lat = lat - 0.0018
    min_lon = lon - 0.0029
    max_lat = lat + 0.0018
    max_lon = lon + 0.0029
    poi = Poi.where(lat: min_lat..max_lat, lon: min_lon..max_lon)
    return poi
  end

  def set_hexagon
    @hexagon = Hexagon.find(params[:id])
  end

  def hexagon_params
    params.require(:hexagon).permit(:lat, :lon)
  end
end
