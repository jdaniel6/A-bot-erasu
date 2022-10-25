import os
import discord
import json
from discord.ext.commands import context
from discord.interactions import Interaction
import gspread
import asyncio
from oauth2client.service_account import ServiceAccountCredentials
from discord.ext import commands
from discord.ui import Button, item
from dotenv import load_dotenv
from datetime import datetime
roles=['ADC','Support','Mid','Jungle','Solo']
#inhouses=[] #organiser, [year, month, day, hour, minute, (second, microsecond)]
duels=[] #(name, win),(name, win)
#ign=""

load_dotenv()
TOKEN = open('DISCORD_TOKEN').read()

bot = commands.Bot(command_prefix='^')
bot.remove_command('help')

scope = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.file']

client_key = json.loads(open('AUTH').read())
creds = ServiceAccountCredentials.from_json_keyfile_dict(client_key,scope)
client = gspread.authorize(creds)

@bot.event
async def on_ready():
  print(f'{bot.user.name} connected to Discord succesfully.')
  await bot.change_presence(activity = discord.Game(name = 'type "^help" for help'))


def uploadupdate(locval, newval, whatval):
    sheet=client.open("SMITE Discord Inhouse Games").sheet1
    if whatval =="ign":
        print("upload ign "+newval)
        sheet.update_cell(locval+1,2,newval)
        



#######GENERAL COMMANDS#######

@bot.command(name='duelchampna')
async def NADuelChamp(ctx):
  f = open('record')
  contents = f.readlines()
  f.close()
  response = contents[2]+"Number of wins: "+ contents[3]
  await ctx.send(response)

@bot.command(name='duelchampeu')
async def EUDuelChamp(ctx):
  f = open('record')
  contents = f.readlines()
  f.close()
  response = contents[0]+"Number of wins: "+ contents[1]
  await ctx.send(response)

@bot.command(name='search')
async def Search(ctx, ign):
  sheet=client.open("SMITE Discord Inhouse Games").sheet1
  col = sheet.col_values(2)
  col = [x.lower() for x in col]
  response = []
  if ign.lower() in col:
    response = sheet.row_values(col.index(ign.lower())+1)
    embed=discord.Embed(title="Stats for "+response[1], color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name="Region:",value=response[2]+'\u200b')
    embed.add_field(name="Main God:",value=response[3]+'\u200b')
    embed.add_field(name="Primary Roles:",value=', '.join([roles[e-4] for e in [4,5,6,7,8] if response[e] == 'TRUE'])+'\u200b')
    embed.add_field(name="Win/Loss Ratio:",value=response[12])
    embed.add_field(name="Kill/Death/Assist Ratio (KDA):",value = response[16])
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    await ctx.send(embed=embed)
  else:
    embed=discord.Embed(title="Could not find stats for "+ign,color=0xFFFF00,timestamp=datetime.now())
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    await ctx.send(embed=embed)

@bot.command(name='rank')
async def Rank(ctx):
  sheet=client.open("SMITE Discord Inhouse Games").sheet1
  col = sheet.col_values(13)[2:]
  col = [int(i[0:-1]) for i in col]
  played=sheet.col_values(12)[2:]
  names=sheet.col_values(2)[2:]
  kda = sheet.col_values(17)[2:]
  sortedcol=sorted(range(len(col)),key=col.__getitem__,reverse=True)
  #sorted(range(len(myList)),key=myList.__getitem__)
  embed=discord.Embed(title="Top 10 Inhouse players ranked by Winrate", color=0xFFFF00,timestamp=datetime.utcnow())
  j=1
  for i in sortedcol[0:10]:
    embed.add_field(name=str(j) +". "+names[i]+"\u200b",value="*Number of games played:* "+played[i]+"  *Winrate:* "+str(col[i])+"%  *KDA:* "+kda[i],inline=False)
    j+=1
  embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
  await ctx.send(embed=embed)

@bot.command(name='next')
async def Next(ctx):
  f = open('inhouse')
  inhouses = list(f.readlines(1)[0].split(";"))
  inhouses = [tuple(i.split(",")) for i in inhouses]
  print(inhouses)
  if len(inhouses)!=0 and inhouses[0]!='':
    embed=discord.Embed(title="Upcoming inhouses", color=0xFFFF00,timestamp=datetime.utcnow())
    inhouses = [(i[0],datetime.strptime(i[1],"%Y %m %d %H %M")) for i in inhouses]
    for i in inhouses:
      embed.add_field(name=i[1].strftime("%x") + " at " + i[1].strftime("%X"),value="Hosted by "+i[0],inline=False)
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    await ctx.send(embed=embed)
  else:
    embed=discord.Embed(title="Upcoming inhouses", color=0xFFFF00,timestamp=datetime.utcnow())
    embed.add_field(name="No inhouses are currently scheduled.",value= "Check back later, or ask an inhouse organiser to hold one!",inline=False)
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    await ctx.send(embed=embed)


#https://stackoverflow.com/questions/6117318/python-list-lookup-with-partial-match


####### INHOUSE MODERATOR COMMANDS #######
class Buttons(discord.ui.View):
    @discord.ui.button(label = "IGN")
    async def IGN(self, button:discord.ui.Button, interaction: discord.Interaction):
        button.disabled = False
        global item
        item = "ign"
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Alright, type in new IGN (warning: this cannot be undone)",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        await interaction.response.edit_message(embed=embed,view=self)
    @discord.ui.button(label = "Main God")
    async def god(self, button:discord.ui.Button, interaction: discord.Interaction):
        button.disabled = False
        global item
        item = "god"
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Alright, type in new main god (warning: this cannot be undone)",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        await interaction.response.edit_message(embed=embed,view=self)
    @discord.ui.button(label = "Region")
    async def reg(self, button:discord.ui.Button, interaction: discord.Interaction):
        button.disabled = False
        global item
        item = "reg"
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Alright, type in new Region (warning: this cannot be undone)",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        await interaction.response.edit_message(embed=embed,view=self)
    @discord.ui.button(label = "Roles")
    async def rol(self, button:discord.ui.Button, interaction: discord.Interaction):
        button.disabled = False
        global item
        item = "rol"
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Alright, type in new Role (warning: this cannot be undone)",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        await interaction.response.edit_message(embed=embed,view=self)
            

@bot.command(name='update')
async def Update(ctx, ign_given):
  sheet=client.open("SMITE Discord Inhouse Games").sheet1
  col = sheet.col_values(2)
  col2 = [x.lower() for x in col]
  
  try:
    index = col2.index(ign_given.lower())
    view = Buttons()
    print(col)
    print(index)
    global ign
    ign=col[index]
    #buttons = [Button(label="IGN",custom_id="ign"),Button(label="Region",custom_id="reg"),Button(label="Main God", custom_id="god"),Button(label="Roles",custom_id="rol")]
    embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
    embed.add_field(name="Update stats for "+ign,value= "What would you like to change?",inline=False)
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    #view.add_item(view, item=buttons)
    #await ctx.send("hello",view=view)
    
    #item = discord.ui.Button(style=discord.ButtonStyle.blurple, label="Click Me", url="https://google.com")
    #for i in buttons:
    #    view.add_item(item=i)
    global item
    await ctx.send(embed=embed, view=view)
    try:
        msg=await bot.wait_for("message", timeout=30)
        uploadupdate(index, msg.content, item)
        print('entered here')
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Operation success",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        #await interaction.response.send_message(embed=embed, view =self)
        await ctx.send(embed=embed)
    except asyncio.TimeoutError:
        embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
        embed.add_field(name="Update stats for "+ign,value= "Operation timeout",inline=False)
        embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
        await ctx.send(embed=embed)

    

    
    

  except ValueError:
    embed=discord.Embed(title="Update a player's stats", color=0xFFFF00,timestamp=datetime.utcnow())
    embed.add_field(name="Could not find that player.",value= "Check your spelling, or use ^add to add a new player.",inline=False)
    embed.set_footer(text="Inhouses conducted in the SMITE Discord Server",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
    await ctx.send(embed=embed)



####### DEBUGGING #######


@bot.command(name='test')
async def Trial(ctx, number):
  sheet=client.open("SMITE Discord Inhouse Games").sheet1
  #pythonsheet = sheet.get_all_records()
  row = sheet.row_values(number)
  response = row
  await ctx.send(response)
  





####### HELP #######
@bot.command(name='help')
async def Help(ctx):
  embed = discord.Embed(title="Commands for A-bot-erasu",description="Hi! I'm A-bot-erasu, and I help track and maintain scores for inhouses conducted on the Smite Discord server!",color=0xFFFF00,timestamp=datetime.utcnow())
  embed.add_field(name="General commands:",value="`^search <IGN>` looks up a player's performance\n`^rank` gets the current top 10 players \n`^duelchampna` and `^duelchampeu` give the current 1v1 Champions for the NA and EU regions respectively\n`^next` checks if there's an inhouse scheduled soon",inline=False)
  embed.add_field(name="Inhouse Moderator commands:",value="`^update <IGN>` allows you to change a player's stats\n`^add <IGN>` allows you to add a player's KDA. Useful for updating after an inhouse day.\n`^remove <IGN>` removes a player from the database\n`^schedule` allows you to schedule an inhouse",inline=False)
  embed.add_field(name="Moderator & Debugger commands:",value="`^history` displays the last few changes made to the database\n`^report` allows you to report a bug",inline=False)
  embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url='https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023')
  
  await ctx.send(embed=embed)


bot.run(TOKEN)
