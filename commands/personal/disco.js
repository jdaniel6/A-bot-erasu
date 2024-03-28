const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('disco')
        .setDescription('diff lasbra'),
    async execute(interaction) {
        await interaction.reply('oi mate im busy with my sheep innit bruv');
    },
};