const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data : new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Play SMITE Trivia!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};