class HivesController < ApplicationController
  before_action :set_hive, only: %i[show edit update destroy]
  before_action :set_hexagon, only: %i[new create]

  def index
    @hives = Hive.all
  end

  def show
    @poi = []
    @markers = []

    centre_point = { lat: @hive.hexagon.lat, lon: @hive.hexagon.lon }
    @markers << centre_point

    @hive.hive_pois.each do |hive_poi|
      @markers << create_markers(hive_poi)
      @poi << Poi.find(hive_poi.poi_id)
    end

    @category_icons = {
      pub: 'beer-mug-empty',
      station: 'train',
      church: 'church',
      spa: 'spa',
      restaurant: 'utensils',
      park: 'tree-city',
      gym: 'dumbbell',
      cafe: 'mug-saucer',
      supermarket: 'store',
      cinema: 'film',
      hospital: 'hospital',
      mosque: 'mosque',
      winebar: 'wine-glass',
      yogastudio: 'hands-praying',
      synagogue: 'synagogue',
      museum: 'landmark',
      university: 'landmark-flag',
      theatre: 'masks-theater'
    }
  end

  def new
    @hive = Hive.new
    @poi = params[:poi_params]
  end

  def create
    if hive_params.include?(:poi)
      @hive = Hive.new(name: hive_params[:name], notes: hive_params[:notes])
    else
      @hive = Hive.new(hive_params)
    end
    @hive.user = current_user
    @hive.hexagon = @hexagon

    if @hive.save
      hive_params[:poi].split(" ").each do |poi|
        HivePoi.create!(poi_id: poi.to_i, hive_id: @hive.id)
      end
      redirect_to hive_path(@hive)
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
      render 'edit', status: :unprocessable_entity
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
    params.require(:hive).permit(:name, :notes, :poi)
  end

  def create_markers(poi)
    poi_instance = Poi.find(poi.poi_id)
    poi_coordinates = { lat: poi_instance.lat,
                        lon: poi_instance.lon,
                        info_window_html: render_to_string(partial: "shared/info_window", locals: { poi: poi_instance }) }
    return poi_coordinates
  end
end
