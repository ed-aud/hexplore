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
    # if @itinerary.ai_answer.present?
    # respond_to do |format|
    #   format.turbo_stream do
    #     render turbo_stream: turbo_stream.append(:itineraries, partial: "itineraries/itinerary",
    #       locals: { itinerary: @itinerary })
    #   end
    # end
    # end
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
      poi << { lat: el.lat, lng: el.lon }
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
