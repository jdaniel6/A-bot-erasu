const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('jalins')
        .setDescription('mald like Jalins'),
    async execute(interaction) {
        return interaction.reply('Pong!');
    },
};