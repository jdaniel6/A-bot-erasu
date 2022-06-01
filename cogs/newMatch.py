from subprocess import DETACHED_PROCESS
import discord
from discord.ext import commands
from discord import app_commands
from Aboterasu import UpdateToFile, s9s, UpdateFromFile, NewMatchFile
from datetime import datetime
import asyncio

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

class newMatch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name = "newmatch", description = "Creates a new match entry")
    async def help(self, interaction:discord.Interaction, matchid:int):
        details = []
        matchid = str(matchid)
        embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
        embed.add_field(name = 'Enter the details of the WINNING team:', value = 'Enter the details as given below')
        embed.add_field(name = 'PlayerIGN,GodPlayed,Kills,Deaths,Assists', value = 'Use Shift+Enter to separate players, use commas to separate values; avoid spaces', inline = False)
        embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
        await interaction.response.send_message(embed = embed)
        def check(message):
            return message.author == interaction.user and message.channel == interaction.channel
        try:
            msg = await self.bot.wait_for('message', check = check, timeout = 120)
            details2 = msg.content.split('\n')
            for player in details2:
                print(player)
                tempdict = {}
                templist = player.split(',')
                tempdict['IGN'] = templist[0]
                tempdict['GodPlayed'] = templist[1]
                tempdict['Kills'] = templist[2]
                tempdict['Deaths'] = templist[3]
                tempdict['Assists'] = templist[4]
                tempdict['Won'] = 'Won'
                details.append(tempdict)
            print(details)

            embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
            embed.add_field(name = 'Succesfully added details of winning team!', value = 'Entry created with ID '+matchid)
            embed.add_field(name = 'Enter the details of the LOSING team:', value = 'Enter the details as given below', inline = False)
            embed.add_field(name = 'PlayerIGN,GodPlayed,Kills,Deaths,Assists', value = 'Use Shift+Enter to separate players, use commas to separate values; avoid spaces', inline = False)
            embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
            await interaction.channel.send(embed = embed)
            try:
                msg = await self.bot.wait_for('message', check = check, timeout = 120)
                details2 = msg.content.split('\n')
                details3 = []
                print(s9s)
                for player in details2:
                    print(player)
                    tempdict = {}
                    templist = player.split(',')
                    tempdict['IGN'] = templist[0]
                    tempdict['GodPlayed'] = templist[1]
                    tempdict['Kills'] = templist[2]
                    tempdict['Deaths'] = templist[3]
                    tempdict['Assists'] = templist[4]
                    tempdict['Won'] = 'Lost'
                    details3.append(tempdict)                
                addWinnerDetails(details)
                addLoserDetails(details3)
                details.extend(details3)
                NewMatchFile(matchid, details)
                UpdateToFile()
                embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
                embed.add_field(name = 'Succesfully added details!', value = 'Entry created with ID '+matchid)
                embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
                await interaction.channel.send(embed = embed)
            except  asyncio.TimeoutError:
                embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
                embed.add_field(name = 'Operation timeout', value = 'Try running the command again')
                embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
                await interaction.channel.send(embed = embed)
            except Exception as e:
                embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
                embed.add_field(name = 'Input Error', value = 'The values you entered may not be correct. Please try again.')
                embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
                print(e)
                await interaction.channel.send(embed = embed)

        except asyncio.TimeoutError:
            embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
            embed.add_field(name = 'Operation timeout', value = 'Try running the command again')
            embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
            await interaction.channel.send(embed = embed)

def addWinnerDetails(d):
    igns = [i['IGN'] for i in s9s]
    for player in d:
        if(player['IGN'] in igns):
            index = igns.index(player['IGN'])
            s9s[index]['Played'] = str(int(s9s[index]['Played']) + 1)
            s9s[index]['Won']+=1
            s9s[index]['Kills']+=player['Kills']
            s9s[index]['Deaths']+=player['Deaths']
            s9s[index]['Assists']+=player['Assists']
        else:
            s9s.append({'IGN' : player['IGN'], 'Rank' : 'Unknown', 'PrimaryRole' : 'Unknown', 'SecondaryRole' : 'Unknown', 'Region' : 'Unknown' , 'Played' : '1' , 'Won' : '1', 'Kills' : player['Kills'], 'Deaths' : player['Deaths'], 'Assists' : player['Assists']})

def addLoserDetails(d):
    igns = [i['IGN'] for i in s9s]
    for player in d:
        if(player['IGN'] in igns):
            index = igns.index(player['IGN'])
            s9s[index]['Played']+=1
            s9s[index]['Kills']+=player['Kills']
            s9s[index]['Deaths']+=player['Deaths']
            s9s[index]['Assists']+=player['Assists']
        else:
            s9s.append({'IGN' : player['IGN'], 'Rank' : 'Unknown', 'PrimaryRole' : 'Unknown', 'SecondaryRole' : 'Unknown', 'Region' : 'Unknown' , 'Played' : 1 , 'Won' : 0, 'Kills' : player['Kills'], 'Deaths' : player['Deaths'], 'Assists' : player['Assists']})

async def setup(bot):
    await bot.add_cog(newMatch(bot), guilds = guilds)