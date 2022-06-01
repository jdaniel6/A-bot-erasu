import discord
from discord.ext import commands
from discord import app_commands
from Aboterasu import s9s, UpdateFromFile
from datetime import datetime
import asyncio

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

class Help(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name = "help", description = "Help for using the bot")
    async def help(self, interaction:discord.Interaction):
        embed=discord.Embed(title = 'Commands for Aboterasu', color=0xFFFF00,timestamp=datetime.now())
        embed.add_field(name='General Commands', value='`search` : Looks up a player\'s performance from their IGN\n`getmatch` : Fetches details of an inhouse by Match ID', inline=False)
        embed.add_field(name='Inhouse Moderator Commands', value='These commands require the "Inhouse Organiser" role.\n`update` : Updates a player\'s details based on their current IGN\n`newmatch` : Creates a new match entry', inline=False)
        embed.add_field(name='Bot Management Commands', value='These commands require you to be a bot op.\n`updatestats` : Updates details of inhouses from file', inline=False)
        embed.set_footer(text=footertext,icon_url=iconurl)
        await interaction.response.send_message(embed = embed)

async def setup(bot):
    await bot.add_cog(Help(bot), guilds = guilds)