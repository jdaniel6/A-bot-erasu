const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('godabilitytrivia')
        .setDescription('Guess which god has an ability with the given name'),
    async execute(interaction) {
        await interaction.reply('Pong!');
        // const sungod = gods[Math.floor(Math.random() * gods.length)];
        const skinJSON = path.join('assets/gods', (Math.floor(Math.random() * fs.readdirSync('assets/gods').length)).toString() + '.json');
        const JSONData = fs.readFileSync(skinJSON);
        const godJSON = JSON.parse(JSONData.toString());
        const godName = godJSON.god_name;
    },
};