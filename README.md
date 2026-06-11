# Weather Chatbot CLI

An interactive command-line weather chatbot built with **zero external dependencies**.  
It uses mock weather data stored in a static JSON file and runs entirely on Node.js built-in modules.

## Quick Start

```bash
# Make sure you have Node.js installed (v12 or later)
node weather-bot.js
```

You can also make the script executable:

```bash
chmod +x weather-bot.js
./weather-bot.js
```

## Usage

Once launched, type a city name and press **Enter**.

### Examples

| Input                          | Behaviour                                         |
|--------------------------------|---------------------------------------------------|
| `Miami`                        | Returns weather for Miami, Florida (unique match) |
| `Springfield`                  | Lists all Springfields; waits for qualification   |
| `Illinois` *(during prompt)*   | Returns weather for Springfield, Illinois         |
| `Portland, Oregon`            | Directly resolves to Portland, Oregon             |
| `Tokyo`                        | Returns weather for Tokyo, Japan                  |
| `Atlantis`                     | Shows "not found" error                           |
| `quit` / `exit`                | Exits the program                                 |

### Disambiguation

When you provide a city name that matches multiple entries (e.g. `Springfield` or `Portland`), the bot lists the possible options and waits for you to type a **state** or **country** qualifier.

```
Which did you mean?
  1. Springfield, Illinois (USA)
  2. Springfield, Missouri (USA)
  3. Springfield, Oregon (USA)
> Illinois
📍 Springfield, Illinois (USA)
🌤  Partly cloudy, 72°F
```

You may also type a comma-qualified input at the disambiguation prompt:

```
> Springfield, IL
```

Or select by number:

```
> 1
```

## Data

All weather data is stored in **`weather-data.json`**.  
You can add, remove, or edit entries to suit your needs.

### Entry format

```json
{
  "city": "CityName",
  "state": "State or null",
  "country": "CountryName",
  "weather": "Description of current weather"
}
```

## Files

| File              | Purpose                         |
|-------------------|---------------------------------|
| `weather-bot.js`  | Main CLI application            |
| `weather-data.json` | Mock weather dataset          |
| `README.md`       | This file                       |

## Requirements

- **Node.js** v12+ (uses built-in `fs` and `readline` modules)
- No third-party packages required.
