class HexagonsController < ApplicationController
  before_action :set_hex_grid, only: %i[new create]

  def show
    @hexagon = Hexagon.find(params[:id])
    @markers = [{
      lat: @hexagon.lat,
      lng: @hexagon.lon}]
    @hives = Hive.all
  end

  def new
    @hexagon = Hexagon.new
  end

  def create
    @hexagon = Hexagon.new(hexagon_params)
    @hexagon.hex_grid = @hex_grid
    # raise
    if @hexagon.save
      redirect_to hexagon_path(@hexagon)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def set_hex_grid
    @hex_grid = HexGrid.find(params[:hex_grid_id])
  end

  def hexagon_params
    params.require(:hexagon).permit(:lat, :lon)
  end
end
