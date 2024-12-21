/* eslint-disable comma-dangle */
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const fPath = path.join(commandsPath, file);
        const command = require(fPath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] ${fPath} is missing a "data" or "execute" property`);
        }
    }
}

client.once(Events.ClientReady, c => {
    console.log(`${c.user.tag} has logged into Discord`);
    client.user.setPresence({
        activities: [{ name: 'Amaterasu in SMITE 2', type: ActivityType.Playing }],
        status: 'online'
    });
});

client.on(Events.InteractionCreate, async interaction => {
    //if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`${interaction.commandName} is not a valid command.`);
        return;
    }
    if (interaction.isAutocomplete()) {
        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    } else if (interaction.isChatInputCommand()) {
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'Error while attempting to execute this command...',
                    ephemeral: true
                });
            }
            else {
                await interaction.reply({
                    content: 'Error while executing this command...',
                    ephemeral: true
                });
            }
        }
    }
});

client.login(token);