# business_analysis: An interactive weather chat bot that provides weather information for a requested location. The MVP uses a CLI interface

Status: draft

## outOfScope

- Integration with live weather APIs (e.g., OpenWeatherMap).
- Natural Language Processing or entity recognition libraries.
- Persistent conversation state across requests.
- Web or mobile graphical interfaces.
- Support for locations other than city names (e.g., zip codes, coordinates).
- Multi-language support or user authentication.
- Unit conversion (Celsius/Fahrenheit) or detailed forecasts.

## assumptions

- The chat bot is implemented as a command-line interface (CLI) application.
- City extraction from user messages uses simple keyword matching (no NLP).
- Weather data is entirely simulated via an internal mock service returning a fixed set of cities and conditions.
- The system is stateless; each user input is processed without conversation history.
- The MVP will be packaged and run using Docker.
- The application handles only single-line text input and outputs plain text.

## userStories

- As a user, I want to ask for weather by city name so that I can get current conditions (temperature, humidity, condition) to plan my day.

## scopeQuestions

- What NLP is required? – None; keyword matching will extract city names from input strings.
- What is the deployment platform? – CLI, deployed as a Docker container.
- How are multiple requests handled? – Stateless; each request is independent, no session state.

## acceptanceCriteria

- Given the user inputs 'weather in London', the bot responds with 'In London, it is 22°C with sunny conditions and 60% humidity.' (using predefined mock data).
- Given the user inputs 'What is the weather in Berlin?', the bot extracts 'Berlin' and returns the corresponding mock data.
- Given the user inputs a city name not in the mock dataset (e.g., 'asdf123'), the bot responds: 'Sorry, I don’t know the weather for asdf123. Please check the city name.'
- Given the user inputs an ambiguous city name that has multiple entries in the data (e.g., 'Springfield'), the bot responds: 'There are multiple cities named Springfield. Please specify the state or country.'
- Given the bot receives any input without a recognisable city, it responds: 'I didn’t catch a city name. Please ask for weather in a specific city, e.g., "weather in Paris".'
- Given multiple consecutive requests in a single session, each is processed independently (stateless). For example: User: 'weather in Paris' -> Bot: '...'; User: 'how about Berlin?' -> Bot: 'In Berlin, ...' (no cross-request memory).
