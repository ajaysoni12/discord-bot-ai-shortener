# Discord AI Bot

A simple Discord bot that uses AI (Groq Llama 3.1) to chat and create short URLs.

## Features

- **AI Chat** - Ask questions and get responses powered by Groq's Llama 3.1
- **URL Shortener** - Create short URLs for long links
- **Simple Setup** - Just add your token and API keys, then run

## Quick Start

### Prerequisites

- Node.js 16+
- Discord bot token
- Groq API key

### Setup (2 minutes)

1. Clone the repository:

```bash
git clone https://github.com/ajaysoni12/discord-bot-ai-shortener.git
cd discord-bot
npm install
```

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Edit `.env` and add your credentials:

```
DISCORD_TOKEN=your_discord_token_here
DISCORD_CLIENT_ID=your_client_id_here
GROQ_API_KEY=your_groq_api_key_here
SHORTENER_API_URL=http://localhost:8001/api/shortenurl
```

4. Register commands:

```bash
node commands.js
```

5. Start the bot:

```bash
npm start
```

## Commands

- `/ask` - Ask the AI anything
- `/shorten` - Create a short URL
- `/ping` - Check bot status
- `/help` - Show all commands

## How to Get Tokens

### Discord Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create New Application
3. Go to Bot tab → Add Bot
4. Copy the token

### Groq API Key

1. Sign up at [Groq Console](https://console.groq.com)
2. Create API key
3. Copy it

## Docker Setup

Want to run it in Docker? Super easy:

```bash
docker-compose up -d
```

That's it! The bot will start automatically.

## Development

Run with auto-reload:

```bash
npm run dev
```

## Project Structure

```
.
├── index.js              # Main bot file
├── commands.js           # Register commands
├── commands/             # Command files
│   ├── ask.js
│   ├── shorten.js
│   ├── ping.js
│   └── help.js
├── utils/                # Helper functions
│   ├── logger.js
│   ├── rateLimiter.js
│   └── validators.js
├── package.json
└── .env.example
```

## Troubleshooting

**Bot not responding?**

- Check if `.env` has correct token
- Make sure you ran `node commands.js` to register commands
- Wait a few seconds - Discord takes time to sync commands

**Getting "Groq API Error"?**

- Verify your `GROQ_API_KEY` is correct
- Check Groq API status

**Still stuck?**

- Check the logs: `npm run dev` shows more details
- Make sure bot has permissions in your Discord server

## License

MIT

## Contributing

Feel free to fork and submit pull requests!
