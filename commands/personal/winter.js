const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const susBuffer = fs.readFileSync('commands\\personal\\winter.txt').toString('utf-8');
const possibleSusses = susBuffer.split('\n');


module.exports = {
    data : new SlashCommandBuilder()
        .setName('winter')
        .setDescription('be a sussy baka'),
    async execute(interaction) {
        await interaction.reply(possibleSusses[Math.floor(Math.random() * possibleSusses.length)]);
    },
};