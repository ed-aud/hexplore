class HexGridsController < ApplicationController
  def show
    @hex_grid = HexGrid.find(params[:id])
  end
end
