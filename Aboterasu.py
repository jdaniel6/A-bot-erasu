from multiprocessing.sharedctypes import Value
import os
import discord
from discord import Intents, app_commands
from discord.ext import commands
import csv
from datetime import datetime

prefix = '^'
TOKEN = open('DISCORD_TOKEN').read()
guilds = [discord.Object(id = 975643195016892416), discord.Object(id = 692741393424318554)]

iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
footertext = 'Data from inhouses conducted in the SMITE Discord'

s9s = [] #['IGN', 'Rank', 'Preferred Roles', 'Played', 'Won']


intents = discord.Intents.all()
intents.message_content = True

###############################################

class Bot(commands.Bot):

  def __init__(self):
    super().__init__(command_prefix = prefix, intents = intents, application_id = 906773394689761290)

  async def setup_hook(self):
    for filename in os.listdir('./cogs'):
      if filename.endswith('.py'):
        try:
          await self.load_extension(f"cogs.{filename[:-3]}")
          print(f'Loaded {filename}')
        except Exception as e:
          print(e)
    for guild in guilds:
      await bot.tree.sync(guild = guild)
    

  async def on_ready(self):
    UpdateFromFile()
    print(f'{bot.user} has connected to Discord!')
    await bot.change_presence(activity = discord.Game(name = 'type /help for help'))



################################################

bot = Bot()
bot.remove_command('help')

@bot.command(name='help')
async def help(ctx):
  embed = discord.Embed(title='Help',color=0xFFFF00,timestamp=datetime.now())
  embed.add_field(name ='A=bot-erasu is using slash commands!', value= 'All commands can now be accessed using the slash (/) interaction. Type /help under A-bot-erasu\'s slash commands to get started!')
  embed.set_footer(text=footertext,icon_url=iconurl)
  await ctx.send(embed= embed)

@bot.command(name='about')
async def about(ctx):
  embed = discord.Embed(title='About A-bot-erasu', color = 0xFFFF00, timestamp=datetime.now())
  embed.add_field(name= 'I track stats of inhouses conducted in the SMITE Discord server!', value= 'Type /help to get started.')
  embed.add_field(name='Current Version: Version 3.0', value='Created and maintained by Kayaya#3081, a fan of Amaterasu.', inline=False)
  embed.set_footer(text='I\'m brighter than you-u!',icon_url=iconurl)
  await ctx.send(embed=embed)


################################################

def UpdateFromFile():
  with open('record', mode = 'r') as csvfile:
    csvreader = csv.DictReader(csvfile, delimiter = '\t')
    for row in csvreader:
      s9s.append(row)
  print('Inhouse stats updated')

def UpdateToFile():
  with open('record', mode = 'w', newline = '') as csvfile:
    fieldnames = ['IGN',	'Rank',	'PrimaryRole',	'SecondaryRole',	'Region' , 'Played',	'Won',	'Kills',	'Deaths',	'Assists']
    csvwriter = csv.DictWriter(csvfile, delimiter = '\t',fieldnames = fieldnames) 
    csvwriter.writeheader()   
    csvwriter.writerows(s9s)
  print('Inhouse stats written to file')

def NewMatchFile(matchid, details):
  with open('matches/'+matchid, mode = 'w', newline = '') as csvfile:
    fieldnames = ['IGN',	'GodPlayed',	'Kills',	'Deaths',	'Assists',	'Won']
    csvwriter = csv.DictWriter(csvfile, delimiter = '\t',fieldnames = fieldnames) 
    csvwriter.writeheader()   
    csvwriter.writerows(details)
  print('Inhouse stats written to file')

################################################

if __name__ == '__main__':
  bot.run(TOKEN)