const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('rat')
        .setDescription('stop rat from speaking'),
    async execute(interaction) {
        await interaction.reply(`-mute <@239550454915268608> ${Math.floor(Math.random() * 10)}m`);
    },
};