class ItineraryJob < ApplicationJob
  queue_as :default


  def perform(itinerary)
    @itinerary = itinerary
    @hexagon = Hexagon.find(itinerary.hexagon_id)

    chatgpt_response = client.chat(
      parameters: {
        model: "gpt-4o-mini",
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

    system_text = "You are an assistant to help plan a day out around Shoreditch High Street, and you should provide an itinerary for a day full of activities based on the parks, pubs, museums, and other points of interest within 1 kilometre of Shoreditch High Street station. To format the message, remove any reference to latitude/longitude. Remove all ** or ## and any default other default response styling. Start with one introductory paragraph followed by one bullet for the morning, one for lunchtime, one for the afternoon and one for the evening and a final paragraph for tips and a reference that the user can save the hexagon to their hive. One line space between each section"

    # system_text = "You are an assistant to help plan a day out and you should provide an itinerary for a day trip based on the parks, pubs, museums, and other points of interest. The itinerary must only include locations within 1 kilometre of these coordinates - latitude: #{@hexagon.lat}, longitude: #{@hexagon.lon}. To format the message, remove any reference to latitude/longitude. Remove all ** or ##. Start with one introductory paragraph followed by one bullet for the morning, one for lunchtime, one for the afternoon and one for the evening and a final paragraph for tips and a reference that the user can save the hexagon to their hive. One line space between each section"

    results << { role: "system", content: system_text }
    results << { role: "user", content: "Plan an itinerary for a day trip based on #{@hexagon.lon}, #{@hexagon.lat}" }
    # results << { role: "assistant", content: @daytrip || "" }

    return results
  end

end
