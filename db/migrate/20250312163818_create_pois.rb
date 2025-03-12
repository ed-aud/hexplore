class CreatePois < ActiveRecord::Migration[7.2]
  def change
    create_table :pois do |t|
      t.string :category
      t.string :name
      t.float :lat
      t.float :lon

      t.timestamps
    end
  end
end
