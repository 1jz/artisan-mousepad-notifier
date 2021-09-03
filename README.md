# artisan-mousepad-notifier
Discord bot to PM you when a specified Artisan mousepad is back in stock

# Notes
As of now this bot only tracks the stock of the SOFT XL Wine Red Hien mousepad, to add new mousepads just create a new config object at the top of `app.js` with the POST data for that specific mousepad.

- A SOFT XL Black config is included.
- Bot checks every minute for restock.
- There are two environment variables required - (entered in .env file)
  - DISCORD_ID - The ID of your discord account which the bot will send a PM to
  - DISCORD_TOKEN - The bot's auth token
- The bot can be used with user bots but you will have to modify the discord.js library (google around since this is against Discord TOS)