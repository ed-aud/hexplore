class ItineraryJob < ApplicationJob
  queue_as :default


  def perform(itinerary)
    @itinerary = itinerary
    @hexagon = Hexagon.find(itinerary.hexagon_id)

    p @hexagon

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

    system_text = "You are an assistant to plan a day trip based on the coordinates provided. Provide an itinerary for a day trip based on the parks, pubs, museums, and other points of interest in that area."

    results << { role: "system", content: system_text }
    results << { role: "user", content: "Plan an itinerary for a day trip based on #{@hexagon.lon}, #{@hexagon.lat}" }
    # results << { role: "assistant", content: @daytrip || "" }

    return results
  end
end
