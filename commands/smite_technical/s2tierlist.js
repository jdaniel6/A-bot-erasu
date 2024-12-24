const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { assetsAbsPath } = require('../../config.json');

const tierlistJSON = JSON.parse(fs.readFileSync(`${assetsAbsPath}s2tierlist.json`).toString('utf-8'));

function getRole(value) {
    switch (value) {
        case 'adc': return 'ADC';
        case 'support': return 'Support';
        case 'mid': return 'Mid';
        case 'jungle': return 'Jungle';
        case 'solo': return 'Solo';
        default: return 'Mid';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tierlist')
        .setDescription('View the tierlist of gods or items for this patch')
        .addStringOption(option =>
            option.setName('listtype')
                .setDescription('Which tierlist would you like to view?')
                .setRequired(true)
                .setChoices(
                    {
                        name: 'gods',
                        value: 'gods'
                    },
                    {
                        name: 'items',
                        value: 'items'
                    }
                )
        )
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Which role\'s tierlist would you like to view?')
                .setRequired(true)
                .setChoices(
                    {
                        name: 'Support',
                        value: 'support'
                    },
                    {
                        name: 'ADC',
                        value: 'adc'
                    },
                    {
                        name: 'Mid',
                        value: 'mid'
                    },
                    {
                        name: 'Jungle',
                        value: 'jungle'
                    },
                    {
                        name: 'Solo',
                        value: 'solo'
                    }
                )
        ),
    async execute(interaction) {
        const listType = interaction.options.getString('listtype')
        const role = interaction.options.getString('role')
        const embedMessage = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`Tierlist of ${listType} in SMITE2 for the role ${getRole(role)}`)
            .setDescription(`Based on patch ${tierlistJSON.patch}, updated on ${tierlistJSON.updated}`)
            .setThumbnail('https://webcdn.hirezstudios.com/smite2/base/favicon.png')
            .setTimestamp()
            .setFooter({ text: 'Tierlists provided by the mentors from the SMITE2 Discord Server', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' })
        for (const t in tierlistJSON[listType][role]) {
            const tierArray = tierlistJSON[listType][role][t] || []
            embedMessage.addFields({
                name: t,
                value: typeof (tierArray) === 'string' ? tierArray : tierArray.length > 0 ? tierArray.join(', ') : 'None'
            })
        }

        await interaction.reply({ embeds: [embedMessage] });
    },
};