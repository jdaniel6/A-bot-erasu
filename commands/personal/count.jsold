const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { myID, countChannelID } = require('../../config.json');
module.exports = {
    data : new SlashCommandBuilder()
        .setName('count')
        .setDescription('Let the bot participate in counting!'),
    async execute(interaction) {
        let desc = 'Thank you for letting bots participate too!'
        if (interaction.user.id === myID ){
            interaction.guild.channels.fetch(countChannelID)
            .then(async channel => {
                let lastNum = await channel.messages.fetch(channel.lastMessageId)
                channel.send(`${parseInt(lastNum.content.split(' ')[0]) + 1}`)
            })
            .catch(console.error)
        }
        else {
            desc = 'Sorry, but I can only do this if Kaya wants me to!'
        }        

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`I like counting!`)
            .setDescription(`${desc}`)
            .setTimestamp()
            .setFooter({text: 'Don\'t try funky stuff, Disco'})
        await interaction.reply({embeds : [embed]});
    },
};

