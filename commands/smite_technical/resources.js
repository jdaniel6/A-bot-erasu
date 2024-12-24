const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const fs = require('fs');

// move this section to updateAssets.js
const resources = [];
const resourceFile = fs.readFileSync('assets/smiteResources.json');
const resourceFileJSON = JSON.parse(resourceFile.toString());
for (const resource in resourceFileJSON) {
    resources.push(resourceFileJSON[resource]);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resources')
        .setDescription('View some helpful links and resources for Smite'),
    async execute(interaction) {
        await interaction.deferReply();
        let _page = 0;
        const totalPages = resources.length - 1;
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('backwards')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('forward')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Success),
            );
        const row2 = new ActionRowBuilder();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Jump to a resource');
        for (const resource in resources) {
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(resources[resource]['Label'])
                    .setDescription(resources[resource]['Title'])
                    .setValue(resource),
            );
        }
        row2.addComponents(selectMenu);

        const embedMessage = async (page) => {
            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle(`${resources[page]['Title']}`)
                .setDescription(`${resources[page]['Description']}`)
                .setTimestamp()
                .setFooter({ text: 'use /help for links to further resources and help', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' });
            for (const field in resources[page]['Fields']) {
                embed.addFields(
                    { name: `${field}`, value: `${resources[page]['Fields'][field]}` },
                );
            }
            return embed;
        };

        row.components[0].setDisabled(true);
        if (_page === totalPages) {
            row.components[1].setDisabled(true);
        }

        await interaction.editReply({ embeds: [await embedMessage(_page)], components: [row2, row] });

        const filter = i => (i.customId === 'forward' || i.customId === 'backwards' || i.customId === 'select') && i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            try {
                if (i.customId === 'forward') {
                    _page++;
                    if (_page === 0) {
                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(false);
                    }
                    else if (_page === totalPages) {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(true);
                    }
                    else {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(false);
                    }
                    await i.deferUpdate();
                    await interaction.editReply({ embeds: [await embedMessage(_page)], components: [row2, row] });
                }
                if (i.customId === 'backwards') {
                    _page--;
                    if (_page === 0) {
                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(false);
                    }
                    else if (_page === totalPages) {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(true);
                    }
                    else {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(false);
                    }
                    await i.deferUpdate();
                    await interaction.editReply({ embeds: [await embedMessage(_page)], components: [row2, row] });
                }
                if (i.customId === 'select') {
                    _page = parseInt(i.values[0]);
                    if (_page === 0) {
                        row.components[0].setDisabled(true);
                        row.components[1].setDisabled(false);
                    }
                    else if (_page === totalPages) {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(true);
                    }
                    else {
                        row.components[0].setDisabled(false);
                        row.components[1].setDisabled(false);
                    }
                    await i.deferUpdate();
                    await interaction.editReply({ embeds: [await embedMessage(_page)], components: [row2, row] });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        collector.on('end', async () => {
            await interaction.editReply({ embeds: [await embedMessage(_page)], components: [] });
        });
    },
};