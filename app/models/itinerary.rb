class Itinerary < ApplicationRecord
  belongs_to :hexagon
  after_create :fetch_ai_answer

  def fetch_ai_answer
    ItineraryJob.perform_later(self)
  end
end
