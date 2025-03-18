class ItinerariesController < ApplicationController
  def index
    # @itineraries = current_user.itineraries
    @itinerary = Itinerary.new # for form
  end

  def create
    @itinerary = Itinerary.new(hexagon_params)

    if @itinerary.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.append(:itineraries, partial: "itineraries/itinerary",
            locals: { itinerary: @itinerary })
        end
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
