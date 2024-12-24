// commands/smite_spl/vegastourney.js

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fs = require('fs');

const { assetsAbsPath } = require('../../config.json');
const thumb = new AttachmentBuilder(`${assetsAbsPath}spl\\vegastourney.png`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vegastourney')
        .setDescription('Get details of the Vegas Tournament'),
    async execute(interaction) {
        const data = JSON.parse(fs.readFileSync('assets/vegasTourney.json', 'utf8'));
        const embedMessage = async (option) => {
            const embed = new EmbedBuilder()
                .setTitle('Vegas Tournament Details')
                .setDescription(`**${option.split('_')[1]}:**`)
                .setColor('#FFFF00')
                .setTimestamp()
                .setFooter({ text: 'Data from https://www.smiteesports.com', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' })
                .setThumbnail('attachment://vegastourney.png')
            if (option === 'view_Teams') {
                for (team in data.teams) {
                    embed.addFields(
                        {
                            name: team,
                            value: `**Region: **${data.teams[team]['region']}\n**Members: **${data.teams[team]['members'].join(', ')}`
                        }
                    )
                }
            }
            else {
                for (match of data.matches) {
                    embed.addFields(
                        {
                            name: match.Winner === 0 ? `${match.teamA} vs ${match.teamB}` : match.Winner > 0 ? `**${match.teamA}** vs ${match.teamB}` : `${match.teamA} vs **${match.teamB}**`,
                            value: `**Stage: **${match.type}\n**Date: **${match.Date}\n**Score: **${match.Score}\n**Winner: **${match.Winner === 0 ? 'TBD' : match.Winner > 0 ? match.teamA : match.teamB}`
                        }
                    )
                }
            }
            return embed;
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('view_Teams')
                    .setLabel('View Teams')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('view_Standings')
                    .setLabel('View Schedule and Standings')
                    .setStyle(ButtonStyle.Secondary),
            );


        // Send the embed with buttons
        const message = await interaction.reply({ embeds: [await embedMessage('view_Teams')], components: [row], files: [thumb] });

        // Set a timeout to disable buttons after 30 seconds
        const filter = i => i.user.id === interaction.user.id;

        // Create a collector for button interactions
        const collector = message.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            // Update the message with the new embed content
            const newEmbed = await embedMessage(i.customId)
            await i.update({ embeds: [newEmbed], components: [row], files: [thumb] });
        });

        collector.on('end', () => {
            // Disable buttons after timeout
            //row1.components.forEach(button => button.setDisabled(true));
            //row2.components.forEach(button => button.setDisabled(true));
            message.edit({ components: [] });
        });
    },
};