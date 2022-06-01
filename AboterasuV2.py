# imports
import os
import discord
from discord.ext import commands
from discord.ui import Button, item
import json
import csv
from datetime import datetime
import asyncio


# variables
prefix = '^'
s9s = [] #['IGN', 'Rank', 'Preferred Roles', 'Played', 'Won']
gign = ""
gindex = 0
iconurl = 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'
inhouses = [] #[[]]

# init
TOKEN = open('DISCORD_TOKEN').read()

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix=prefix, intents = intents)

@bot.event
async def on_ready():
  UpdateFromFile()
  print(f'{bot.user.name} connected to Discord succesfully.')
  await bot.change_presence(activity = discord.Game(name = 'type "^help" for help'))

# classes for buttons

class UpdateButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Rank', style = discord.ButtonStyle.primary)
  async def rankButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Select the new rank below: ', value = 'Select an option:')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARankButtons())
  @discord.ui.button(label = 'IGN', style = discord.ButtonStyle.primary)
  async def ignButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Type the new IGN below: ', value = '\u200b')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed)
  @discord.ui.button(label = 'Roles', style = discord.ButtonStyle.primary)
  async def rolesButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Select the new Primary Role below: ', value = 'Select an option:')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectAPrimaryRoleButtons())  
  @discord.ui.button(label = 'Region', style = discord.ButtonStyle.primary)
  async def regionButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Select the new Region below: ', value = 'Select an option:')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtons())
  
  
#add disabled button everywhere
class selectARankButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Unranked', style = discord.ButtonStyle.primary)
  async def unrankedButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Unranked"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Unranked')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Bronze', style = discord.ButtonStyle.primary)
  async def bronzeButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Bronze"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Bronze')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Silver', style = discord.ButtonStyle.primary)
  async def silverButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Silver"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Silver')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Gold', style = discord.ButtonStyle.primary)
  async def goldButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Gold"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Gold')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Platinum', style = discord.ButtonStyle.primary)
  async def platButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Platinum"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Platinum')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Diamond', style = discord.ButtonStyle.primary)
  async def diamondButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Diamond"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Diamond')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Masters', style = discord.ButtonStyle.primary)
  async def mastersButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Masters"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Masters')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Grand Master', style = discord.ButtonStyle.primary)
  async def gmButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Grand Master"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Grand Master')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)

class selectAPrimaryRoleButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Support', style = discord.ButtonStyle.primary)
  async def SuppPrimaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "Support"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: Support')
    embed.add_field(name = "Select the new Secondary Role below: ", value = 'Select an option:', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectASecondaryRoleButtons())
  @discord.ui.button(label = 'ADC', style = discord.ButtonStyle.primary)
  async def ADCPrimaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "ADC"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: ADC')
    embed.add_field(name = "Select the new Secondary Role below: ", value = 'Select an option:', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectASecondaryRoleButtons())
  @discord.ui.button(label = 'Mid', style = discord.ButtonStyle.primary)
  async def MidPrimaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "Mid"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: Mid')
    embed.add_field(name = "Select the new Secondary Role below: ", value = 'Select an option:', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectASecondaryRoleButtons())
  @discord.ui.button(label = 'Solo', style = discord.ButtonStyle.primary)
  async def SoloPrimaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "Solo"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: Solo')
    embed.add_field(name = "Select the new Secondary Role below: ", value = 'Select an option:', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectASecondaryRoleButtons())
  @discord.ui.button(label = 'Jungle', style = discord.ButtonStyle.primary)
  async def JgPrimaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "Jungle"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: Jungle')
    embed.add_field(name = "Select the new Secondary Role below: ", value = 'Select an option:', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectASecondaryRoleButtons())
  @discord.ui.button(label = 'Fill', style = discord.ButtonStyle.primary)
  async def FillButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['PrimaryRole'] = "Fill"
    s9s[gindex]['SecondaryRole'] = "Fill"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New roles: Fill')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)

class selectASecondaryRoleButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Support', style = discord.ButtonStyle.primary)
  async def SuppSecondaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['SecondaryRole'] = "Support"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: ' + s9s[gindex]['PrimaryRole'])
    embed.add_field(name = 'Update was successful', value = 'New secondary role: Support')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'ADC', style = discord.ButtonStyle.primary)
  async def ADCSecondaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['SecondaryRole'] = "ADC"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: '+ s9s[gindex]['PrimaryRole'])
    embed.add_field(name = 'Update was successful', value = 'New secondary role: ADC')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Mid', style = discord.ButtonStyle.primary)
  async def MidSecondaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['SecondaryRole'] = "Mid"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: '+ s9s[gindex]['PrimaryRole'])
    embed.add_field(name = 'Update was successful', value = 'New secondary role: Mid')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Solo', style = discord.ButtonStyle.primary)
  async def SoloSecondaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['SecondaryRole'] = "Solo"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: '+ s9s[gindex]['PrimaryRole'])
    embed.add_field(name = 'Update was successful', value = 'New secondary role: Solo')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Jungle', style = discord.ButtonStyle.primary)
  async def JgSecondaryButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['SecondaryRole'] = "Jungle"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New primary role: '+ s9s[gindex]['PrimaryRole'])
    embed.add_field(name = 'Update was successful', value = 'New secondary role: Jungle')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
 
class selectARegionButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'NA', style = discord.ButtonStyle.primary)
  async def NAButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "NA"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'EU', style = discord.ButtonStyle.primary)
  async def EUButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "EU"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'OCE', style = discord.ButtonStyle.primary)
  async def OCEButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "OCE"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)
  @discord.ui.button(label = 'Asia', style = discord.ButtonStyle.primary)
  async def AsiaButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "Asia"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = None)

class NewUserYNButtons(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Yes, create a new entry', style = discord.ButtonStyle.primary)
  async def NewUserButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    entry = {'IGN': gign, 'Rank' : 'Unranked', 'PrimaryRole' : 'Fill', 'SecondaryRole' : 'Fill', 'Region' : 'NA', 'Played' : 0, 'Won' : 0, 'Kills' : 0, 'Deaths' : 0, 'Assists':0}
    s9s.append(entry)
    global gindex
    gindex = s9s.index(entry)
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'What is their current rank?', value = 'Choose an option')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARankButtonsWithRegion())


class selectARankButtonsWithRegion(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'Unranked', style = discord.ButtonStyle.primary)
  async def unrankedButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Unranked"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Unranked')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Bronze', style = discord.ButtonStyle.primary)
  async def bronzeButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Bronze"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Bronze')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Silver', style = discord.ButtonStyle.primary)
  async def silverButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Silver"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Silver')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Gold', style = discord.ButtonStyle.primary)
  async def goldButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Gold"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Gold')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Platinum', style = discord.ButtonStyle.primary)
  async def platButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Platinum"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Platinum')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Diamond', style = discord.ButtonStyle.primary)
  async def diamondButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Diamond"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Diamond')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Masters', style = discord.ButtonStyle.primary)
  async def mastersButton(self,  button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Masters"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for ' +gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Masters')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())
  @discord.ui.button(label = 'Grand Master', style = discord.ButtonStyle.primary)
  async def gmButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Rank'] = "Grand Master"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New rank: Grand Master')
    embed.add_field(name = 'Select their region: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectARegionButtonsWithRoles())

class selectARegionButtonsWithRoles(discord.ui.View):
  def __init__(self, *, timeout = 30):
    super().__init__(timeout = timeout)
  @discord.ui.button(label = 'NA', style = discord.ButtonStyle.primary)
  async def NAButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "NA"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.add_field(name = 'Select their preferred Primary Role: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectAPrimaryRoleButtons())
  @discord.ui.button(label = 'EU', style = discord.ButtonStyle.primary)
  async def EUButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "EU"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.add_field(name = 'Select their preferred Primary Role: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectAPrimaryRoleButtons())
  @discord.ui.button(label = 'OCE', style = discord.ButtonStyle.primary)
  async def OCEButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "OCE"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.add_field(name = 'Select their preferred Primary Role: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectAPrimaryRoleButtons())
  @discord.ui.button(label = 'Asia', style = discord.ButtonStyle.primary)
  async def AsiaButton(self, button:discord.ui.Button, interaction:discord.Interaction):
    s9s[gindex]['Region'] = "Asia"
    UpdateToFile()
    embed=discord.Embed(title = 'Updating details for '+gign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Update was successful', value = 'New region: ' + s9s[gindex]['Region'])
    embed.add_field(name = 'Select their preferred Primary Role: ', value = 'Select an option', inline = False)
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await interaction.response.edit_message(embed = embed, view = selectAPrimaryRoleButtons())


# COMMON commands
@bot.command(name = 'search')
async def Search(ctx, ign):
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
    print(s9s[gindex])
    embed.add_field(name = 'Win Percentage', value = (int(s9s[gindex]['Won'])/int(s9s[gindex]['Played']))*100)
    embed.add_field(name = 'K/D/A', value = str((s9s[gindex]['Kills']) + '/' + str(s9s[gindex]['Deaths']) + '/' + str(s9s[gindex]['Assists'])))
    embed.add_field(name = 'KDA Ratio', value = (int(s9s[gindex]['Kills']) + (0.5*int(s9s[gindex]['Assists'])))/int(s9s[gindex]['Deaths']))
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
  else:
    embed = discord.Embed(title = 'Stats for '+ign, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Error', value = message+'\u200b')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
  
  await ctx.send(embed = embed)

 # add a top stats command
 # add a random god, random builds command


#INHOUSE MODERATOR/MENTOR COMMANDS
@bot.command(name = 'update')
async def Update(ctx, ign):
  global gign, gindex 
  message = "Updating details for " + ign
  igns = [i['IGN'] for i in s9s]
  if(ign in igns):
    gindex = igns.index(ign)
    embed=discord.Embed(title = message, color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'What would you like to update? Select the button below:', value = 'Select an option')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    gign= ign
    await ctx.send(embed = embed, view = UpdateButtons())


  else:
    embed = discord.Embed(title = 'Player ' + ign + ' does not exist, would you like to create an entry for them?', color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Error', value = message+'\u200b')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    gign = ign
    await ctx.send(embed = embed, view = NewUserYNButtons())
  

@bot.command(name = 'newmatch')
async def newMatch(ctx, matchid):
  details = []
  embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
  embed.add_field(name = 'Enter the details of the WINNING team:', value = 'Enter the details as given below')
  embed.add_field(name = 'PlayerIGN,GodPlayed,Kills,Deaths,Assists', value = 'Use Shift+Enter to separate players, use commas to separate values; avoid spaces', inline = False)
  embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
  await ctx.send(embed = embed)
  def check(message):
    return message.author == ctx.author and message.channel == ctx.channel
  try:
    msg = await bot.wait_for('message', check = check, timeout = 120)
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
    await ctx.send(embed = embed)
    try:
      msg = await bot.wait_for('message', check = check, timeout = 120)
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
        tempdict['Won'] = 'Lost'
        details.append(tempdict)
      NewMatchFile(matchid, details)
      embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
      embed.add_field(name = 'Succesfully added details!', value = 'Entry created with ID '+matchid)
      embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
      await ctx.send(embed = embed)
    except asyncio.TimeoutError:
      embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
      embed.add_field(name = 'Operation timeout', value = 'Try running the command again')
      embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
      await ctx.send(embed = embed)
    except Exception as e:
      embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
      embed.add_field(name = 'Input Error', value = 'The values you entered may not be correct. Please try again.')
      embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
      await ctx.send(embed = embed)

  except asyncio.TimeoutError:
    embed = discord.Embed(title = 'New inhouse with Match ID ' + matchid, color = 0xFFFF00, timestamp = datetime.now())
    embed.add_field(name = 'Operation timeout', value = 'Try running the command again')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await ctx.send(embed = embed)


@bot.command(name = 'sinhouse')
async def scheduleInhouse(ctx):
   #replace role with Mentor or Inhouse Organiser
  if not any(role.name == 'new role' for role in ctx.message.author.roles):
      embed = discord.Embed(title = 'Schedule an inhouse', color = 0xFFFF00, timestamp = datetime.now())
      embed.add_field(name = 'Role Error', value = 'You must must be an Inhouse Organiser or a Mentor to use this command.')
      embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
      await ctx.send(embed = embed)
  else:  
    embed=discord.Embed(title = 'Schedule an inhouse', color=0xFFFF00,timestamp=datetime.now())
    embed.add_field(name = 'Enter the date and time of the inhouse in EST:', value = 'Enter as DD/MM/YY/HH/MM')
    embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
    await ctx.send(embed = embed)
    def check(message):
      return message.author == ctx.author and message.channel == ctx.channel
    try:
      msg = await bot.wait_for('message', check = check, timeout = 120)
      time = datetime.strptime(msg.content, '%d/%m/%y/%H/%M')
      # replace channel ID, Role ID and verify Ama ID
      await bot.get_channel(975589649659617290).send('<@&695655805520707605> Inhouse at ' + datetime.strftime(time.astimezone(), '%I:%M %p , %d %b (%A)') + ' hosted by ' + ctx.message.author.mention + '! React with <:Ama:969360259447652352> to sign up!' )
    except Exception as e:
      embed = discord.Embed(title = 'Schedule an inhouse', color = 0xFFFF00, timestamp = datetime.now())
      embed.add_field(name = 'Input Error', value = 'The date you entered may not be correct. Please try again.')
      embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
      await ctx.send(embed = embed)



# bot maintenance

@bot.command(name = 'updatestats')
async def UpdateStats(ctx):
  UpdateFromFile()
  embed = discord.Embed(title = 'Update Inhouse stats', color = 0xFFFF00, timestamp = datetime.now())
  embed.add_field(name = 'Success', value = 'Stats updated from file successfully.')
  embed.set_footer(text = 'Created and maintained by Kayaya#3081, a fan of Amaterasu.', icon_url= iconurl)
  await ctx.send(embed = embed)

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

async def SendMessage(ctx, title, message):
  embed=discord.Embed(title = title, color=0xFFFF00,timestamp=datetime.now())
  for key in message:
    embed.add_field(name = key, value = message[key]+'\u200b')
  embed.set_footer(text="Created and maintained by Kayaya#3081, a fan of Amaterasu.",icon_url=iconurl)
  await ctx.send(embed = embed)


# run the bot
bot.run(TOKEN)
