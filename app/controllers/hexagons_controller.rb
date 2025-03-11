class HexagonsController < ApplicationController
  def show
    @hexagon = Hexagon.find(params[:id])
  end
end
