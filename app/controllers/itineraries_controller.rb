class ItinerariesController < ApplicationController
  def index
    hexagon = Hexagon.find(params[:id])
    @itineraries = hexagon.itineraries
    @itinerary = Itinerary.new # for form
  end

  def create
    hexagon = Hexagon.find(hexagon_params[:hexagon_id])
    @itineraries = hexagon.itineraries
    @itinerary = Itinerary.new(hexagon_params)
    if @itinerary.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.append(:itineraries, partial: "itineraries/itinerary",
            locals: { itinerary: @itinerary })
        end
        format.html { redirect_to itineraries_path(id: hexagon) }
      end
    else
      render 'hexgons/show', status: :unprocessable_entity
    end
  end

  private

  def hexagon_params
    params.require(:itinerary).permit(:hexagon_id)
  end

end
