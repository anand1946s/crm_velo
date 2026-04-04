import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()

bot = commands.Bot(
    command_prefix="!",
    intents=intents
)


@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

    try:
        synced = await bot.tree.sync()
        print(f"Synced {len(synced)} commands")
    except Exception as e:
        print(e)


async def load_cogs():
    await bot.load_extension("bot.cogs.persons")
    await bot.load_extension("bot.cogs.projects")
    await bot.load_extension("bot.cogs.assignment")


async def main():
    async with bot:
        await load_cogs()
        await bot.start(TOKEN)


import asyncio
asyncio.run(main())