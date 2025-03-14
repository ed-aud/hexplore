class HivesController < ApplicationController
  before_action :set_hive, only: %i[show destroy edit update]
  before_action :set_hexagon, only: %i[new create show]
  def index
    @hives = Hive.all
  end
  def show
  end

  def new
    @hive = Hive.new
  end

  def create
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

  def edit
  end

  def update
    if @hive.update(hive_params)
      redirect_to hives_path
    else
      render 'new', status: :unprocessable_entity
    end
  end

  private

  def set_hive
    @hive = Hive.find(params[:id])
  end

  def set_hexagon
    @hexagon = Hexagon.find(params[:hexagon_id])
  end

  def hive_params
    params.require(:hive).permit(:name, :notes)
  end
end
