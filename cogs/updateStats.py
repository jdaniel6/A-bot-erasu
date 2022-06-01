import discord
from discord.ext import commands
from discord import app_commands
from Aboterasu import s9s, UpdateFromFile
from datetime import datetime
import asyncio

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

class updateStats(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name = "updatestats", description = "Updates stats from file")
    async def updateStats(self, interaction:discord.Interaction):
        UpdateFromFile()
        embed=discord.Embed(title = 'Update stats from file', color=0xFFFF00,timestamp=datetime.now())
        embed.add_field(name='Success', value='Inhouse stats successfully updated from file', inline=False)
        embed.set_footer(text=footertext,icon_url=iconurl)
        await interaction.response.send_message(embed = embed)

async def setup(bot):
    await bot.add_cog(updateStats(bot), guilds = guilds)