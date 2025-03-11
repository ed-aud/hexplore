class HexGridsController < ApplicationController
  def index
    @hex_grid = HexGrid.all
  end
end
