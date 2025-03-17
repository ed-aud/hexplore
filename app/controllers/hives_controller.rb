class HivesController < ApplicationController
  before_action :set_hive, only: %i[show edit update destroy]
  before_action :set_hexagon, only: %i[new create]

  def index
    @hives = Hive.all
  end

  def show
    @marker = create_makers_object(@poi)
  end

  def new
    @hive = Hive.new
  end

  def create
    raise
    @hive = Hive.new(hive_params)
    @hive.user = current_user
    @hive.hexagon = @hexagon

    if @hive.save
      redirect_to hexagon_path(@hexagon)
    else
      render 'new', status: :unprocessable_entity
    end
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

  def destroy
    @hive.destroy
    redirect_to hives_path, status: :see_other
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

  def create_makers_object(arr)
    poi = []
    poi[0] = { lat: @hive.hexagon.lat,
               lng: @hive.hexagon.lon }
    arr.each do |el|
      poi << { lat: el.lat,
               lng: el.lon,
               info_window_html: render_to_string(partial: "shared/info_window",
               locals: { poi: el })
             }
    end
    return poi
  end
end
