class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])
    @markers = [{
      lat: @hexagon.lat,
      lng: @hexagon.lon
    }]
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

  def set_hexagon
    @hexagon = Hexagon.find(params[:id])
  end

  def hexagon_params
    params.require(:hexagon).permit(:lat, :lon)
  end
end
