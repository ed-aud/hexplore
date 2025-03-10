class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagons.find(params[:id])
  end
end
