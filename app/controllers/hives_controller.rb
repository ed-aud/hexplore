class HivesController < ApplicationController
  before_action :set_hive, only: %i[show destroy]
  def index
    @hives = Hive.all
  end
  def show
  end

  def new
    @hexagon = Hexagon.find(params[:hexagon_id])
    @hive = Hive.new
  end

  def create
    @hexagon = Hexagon.find(params[:hexagon_id])
    @hive = Hive.new(hive_params)
    @hive.user = current_user
    @hive.hexagon = @hexagon
    if @hive.save
      redirect_to hexagon_path(@hexagon)
    else
      render 'new', status: :unprocessable_entity
    end
  end

  def destroy
    @hive.destroy
    redirect_to hives_path, status: :see_other
  end

  private

  def set_hive
    @hive = Hive.find(params[:id])
  end

  def hive_params
    params.require(:hive).permit(:name, :notes)
  end
end
