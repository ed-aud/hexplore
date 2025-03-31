class ItineraryJob < ApplicationJob
  queue_as :default


  def perform(itinerary)
    @itinerary = itinerary
    @hexagon = Hexagon.find(itinerary.hexagon_id)

    chatgpt_response = client.chat(
      parameters: {
        model: "gpt-4o",
        messages: itinerary_formatted_for_openai
      }
    )
    daytrip = chatgpt_response["choices"][0]["message"]["content"]

    itinerary.update(ai_answer: daytrip)

    Turbo::StreamsChannel.broadcast_update_to(
      "itinerary_#{@itinerary.id}",
      target: "itinerary_#{@itinerary.id}",
      partial: "itineraries/itinerary", locals: { itinerary: itinerary })
  end

  private

  def client
    @client ||= OpenAI::Client.new
  end

  def itinerary_formatted_for_openai
    results = []

    system_text = "You are a travel assistant that helps users plan a day out in a selected area. 
                  The center point for this area has coordinates of #{@hexagon.lat}, #{@hexagon.lon}. 
                  You MUST start by converting these coordinates into an address to identify which city and which area within the city you are going to plan a day out in.
                  DO NOT do anything else until you have done this and DO NOT share this information with a user at this stage. 
                  You can now plan the day out, and should provide an itinerary based on popular activities and points of interest in the area (e.g., museums, parks, pubs, landmarks, activities, etc.). These MUST all be within a 20minute work of the center point coordinates provided. 
                  To format the message:
                    Remove any reference to latitude/longitude. 
                    Remove all ** or ##. 
                    Start with one introductory paragraph followed by one bullet for the morning, one for lunchtime, one for the afternoon, one for the evening and a final paragraph for tips and a reference that the user can save the hexagon to their hive. 
                    Each paragraph should be at least 50 words in length.
                    Add one line space between each section."

    results << { role: "system", content: system_text }
    results << { role: "user", content: "Plan an itinerary for a day trip based on #{@hexagon.lon}, #{@hexagon.lat}" }

    return results
  end

end
