const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('builds')
        .setDescription('get a build from Smite Mentors (provided by SmiteWikiBot, child of DiscoFerry#6038')
        .addStringOption(option =>
			option
				.setName('god')
				.setDescription('The god to get a build for')
				.setRequired(true)),
    async execute(interaction) {
        interaction.reply('All credit to DiscoFerry#6038, invite his bot <here> // hyperlink here');
        interaction.channel.send(`?${interaction.options.getString('god')}`);
    },
};