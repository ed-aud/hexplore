class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])
    @pois = Poi.all
    @poi = get_points_of_interest(@hexagon.lat, @hexagon.lon)
    @markers = [{
      lat: @hexagon.lat,
      lng: @hexagon.lon
    }
    ]

    @hives = Hive.all
    @questions = Question.all
    @question = Question.new
  end

  def new
    @hexagon = Hexagon.new
  end

  def create
    @hexagon = Hexagon.new(hexagon_params)
    if @hexagon.save
      redirect_to hexagon_path(@hexagon)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def get_lat_lon(arr)
    poi = []
    arr.each do |el|
      poi << { lat: el.lat, lng: el.lon }
    end
    # hiceraise
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
