const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('latency')
        .setDescription('Gets the bot\'s latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    },
};