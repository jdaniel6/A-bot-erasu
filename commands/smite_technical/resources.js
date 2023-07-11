const { devID, authKey, myID } = require('../../config.json');
const fs = require('fs');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('resources')
        .setDescription('View some helpful links and resources for Smite'),
    async execute(interaction) {
        await interaction.deferReply();
    },
};