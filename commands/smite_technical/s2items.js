const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

// Cache to store our items data
let itemsCache = null;

async function loadItems(noUpdate) {
    if (itemsCache && noUpdate) return itemsCache;

    const itemsDir = path.join(__dirname, '../../assets/s2items/');
    const files = await fs.readdir(itemsDir);
    const items = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            const itemData = JSON.parse(
                await fs.readFile(path.join(itemsDir, file), 'utf-8')
            );
            items.push(itemData);
        }
    }

    itemsCache = items;
    return items;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('s2item')
        .setDescription('Look up a SMITE2 item')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the item')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(interaction) {
        const items = await loadItems(true);
        const focusedValue = interaction.options.getFocused().toLowerCase();

        const filtered = items
            .filter(item => item.name.toLowerCase().includes(focusedValue))
            .slice(0, 25); // Discord limits to 25 choices

        await interaction.respond(
            filtered.map(item => ({
                name: item.name,
                value: item.name
            }))
        );
    },

    async execute(interaction) {
        const itemName = interaction.options.getString('name');
        const items = await loadItems(false);

        const item = items.find(i =>
            i.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!item) {
            await interaction.reply({
                content: 'Item not found!',
                ephemeral: true
            });
            return;
        }

        let itemStats = []
        if (!('stats' in item)) {
            if ('effects' in item) {
                item.stats = {
                    [`${'Intelligence' in item.internalName ? 'Intelligence' : 'Strength'}`]: item.effects[0]['mods'][0]['floatValue']
                }
            }
        }
        for (const stat in item.stats) {
            itemStats.push(`**${stat}**: ${item.stats[stat]}`)
        }

        let tags = []
        for (const tag of item.tags) {
            if (tag.indexOf('.') < 0) {
                tags.push(tag)
            }
        }
        const thumbnail = new AttachmentBuilder(`D:\\Documents\\GitHub\\A-bot-erasu\\assets\\s2items\\${item.internalName}.webp`);
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(item.name)
            .setThumbnail(`attachment://${item.internalName}.webp`)
            .addFields(
                {
                    name: 'Item stats',
                    value: `${itemStats.join('\n')}`
                },
                {
                    name: 'Passive',
                    value: `${'passive' in item && item.passive !== "" ? item.passive : 'No Passive'}`
                },
                {
                    name: 'Cost',
                    value: `${item.totalCost} gold`
                },
                {
                    name: 'Tier',
                    value: `${item.tier}`
                },
                {
                    name: 'Builds from',
                    value: `This item: ${item.name}`.concat(`${'components' in item ? '\nComponents : '.concat(item.components.join(', ')) : ''}`).concat(`${'buildsFromT1' in item ? '\nTier 1 items: '.concat(item.buildsFromT1.join(', ')) : ''}`)
                },
                {
                    name: 'Builds into',
                    value: `${item.tier === 3 ? 'None, max tier reached' : 'buildsIntoT2' in item ? 'Tier 2: '.concat(item.buildsIntoT2.join(', ')).concat('\nTier 3: ').concat('buildsIntoT3' in item ? item.buildsIntoT3.join(', ') : 'None') : 'buildsIntoT3' in item ? 'Tier 3: '.concat(item.buildsIntoT3.join(', ')) : 'None'}`
                }
            )
            .setDescription(`** Tags:** ${tags.join(', ')}`)
            .setTimestamp()
            .setFooter({ text: `Data from SMITE2 Alpha, provided by Mytharria`, iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' });

        await interaction.reply({ embeds: [embed], files: [thumbnail] });
    },
};
