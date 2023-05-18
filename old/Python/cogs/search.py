import discord
from discord.ext import commands
from discord import app_commands
from Aboterasu import s9s, UpdateFromFile
from datetime import datetime
import asyncio

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

class Search(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name = "search", description = "Search for a player's details")
    async def search(self, interaction:discord.Interaction, ign:str):
        UpdateFromFile()
        message = "That player was not found. Check that the spelling is correct (including uppercase characters)!"
        igns = [i['IGN'] for i in s9s]
        #global gindex
        if(ign in igns):
            gindex = igns.index(ign)
            embed=discord.Embed(title = 'Stats for '+ign, color=0xFFFF00,timestamp=datetime.now())
            embed.add_field(name = 'IGN', value = ign+'\u200b')
            embed.add_field(name = 'Rank', value = s9s[gindex]['Rank'])
            embed.add_field(name = 'Preferred Roles', value = s9s[gindex]['PrimaryRole'] + ', ' + s9s[gindex]['SecondaryRole'])
            embed.add_field(name = 'Games Played', value = s9s[gindex]['Played'])
            embed.add_field(name = 'Games Won', value = s9s[gindex]['Won'])
            embed.add_field(name = 'Win Percentage', value = (int(s9s[gindex]['Won'])/(1 if int(s9s[gindex]['Played']) == 0 else int(s9s[gindex]['Played']))*100))
            embed.add_field(name = 'K/D/A', value = str((s9s[gindex]['Kills']) + '/' + str(s9s[gindex]['Deaths']) + '/' + str(s9s[gindex]['Assists'])))
            embed.add_field(name = 'KDA Ratio', value = (int(s9s[gindex]['Kills']) + (0.5*int(s9s[gindex]['Assists'])))/(1 if int(s9s[gindex]['Deaths']) == 0 else int(s9s[gindex]['Deaths'])))
            embed.set_footer(text=footertext,icon_url=iconurl)
        else:
            embed = discord.Embed(title = 'Stats for '+ign, color=0xFFFF00,timestamp=datetime.now())
            embed.add_field(name = 'Error', value = message+'\u200b')
            embed.set_footer(text=footertext,icon_url=iconurl)
  
        await interaction.response.send_message(embed = embed)

async def setup(bot):
    await bot.add_cog(Search(bot), guilds = guilds)