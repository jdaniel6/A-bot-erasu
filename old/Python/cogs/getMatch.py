import discord
from discord.ext import commands
from discord import app_commands
from Aboterasu import s9s, UpdateFromFile, NewMatchFile
from datetime import datetime
import asyncio
import os

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

class getMatch(commands.Cog):
    def __init__(self, bot): 
        self.bot = bot

    @app_commands.command(name = "getmatch", description = "Searches for a match based on match ID")
    async def help(self, interaction:discord.Interaction, matchid:int):
        matchid = str(matchid)
        matches = os.listdir('./matches')
        if matchid in matches:
            embed = discord.Embed(title = 'Found inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
            embed.add_field(name = 'Succesfully added details!', value = 'Entry created with ID '+matchid)
            embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
        else:
            embed = discord.Embed(title = 'No inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
            embed.add_field(name = 'Succesfully added details!', value = 'Entry created with ID '+matchid)
            embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
        await interaction.response.send_message(embed = embed)

async def setup(bot):
    await bot.add_cog(getMatch(bot), guilds = guilds)