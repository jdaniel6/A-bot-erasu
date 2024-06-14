const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('curtis')
        .setDescription('i\'m really very busy'),
    async execute(interaction) {
        let quote = {};
        try {
            quote = await (await fetch('https://animechan.xyz/api/random')).json()
        } catch {
            quote = {
                'character' : 'Error occurred',
                'anime' : 'Anime API down/limit on requests expired',
                'quote' : 'Why not play some ESO instead?'
            }
        }
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`${quote['character']} - ${quote['anime']}`)
            .setDescription(`${quote['quote']}`)
            .setTimestamp()
            .setFooter({text: 'Limited to 60 requests an hour'})
        await interaction.reply({embeds : [embed]});
    },
};