const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('curtis')
        .setDescription('i\'m really very busy'),
    async execute(interaction) {
        const quote = await (await fetch('https://animechan.xyz/api/random')).json()
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`${quote['character']} - ${quote['anime']}`)
            .setDescription(`${quote['quote']}`)
            .setTimestamp()
            .setFooter({text: 'Limited to 60 requests an hour, if the command fails that\'s why'})
        await interaction.reply({embeds : [embed]});
    },
};