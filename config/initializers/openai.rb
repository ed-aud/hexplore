require "openai"

OpenAI.configure do |config|
  config.access_token = ENV.fetch("OPENAI_ACCESS_TOKEN") { raise "Missing OPENAI_ACCESS_TOKEN" }
end
