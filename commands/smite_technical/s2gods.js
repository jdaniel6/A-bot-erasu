const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const { assetsAbsPath } = require('../../config.json');

// ... existing code ...

let godsCache = null;

async function loadGods(noUpdate) {
    if (godsCache && noUpdate) return godsCache;

    const godsDir = path.join(__dirname, '../../assets/s2gods/');
    const files = await fs.readdir(godsDir);
    const gods = [];

    for (const file of files) {
        if (file.endsWith('.json')) {
            const godData = JSON.parse(
                await fs.readFile(path.join(godsDir, file), 'utf-8')
            );
            gods.push(godData);
        }
    }

    godsCache = gods;
    return gods;
}

function getDesc(godInfo, opt) {
    if (opt === 'passive') return (`**${godInfo.passive.name}:**\n${godInfo.passive.shortDesc}`);
    if (opt === 'ability1') return (`**${godInfo.abilities.A01.name}:**\n${godInfo.abilities.A01.shortDesc}`);
    if (opt === 'ability2') return (`**${godInfo.abilities.A02.name}:**\n${godInfo.abilities.A02.shortDesc}`);
    if (opt === 'ability3') return (`**${godInfo.abilities.A03.name}:**\n${godInfo.abilities.A03.shortDesc}`);
    if (opt === 'ability4') return (`**${godInfo.abilities.A04.name}:**\n${godInfo.abilities.A04.shortDesc}`);
    if (opt === 'basic') return (`**${godInfo.subText || 'Title unavailable from API'}:** ${godInfo.shortRole || 'Description unavailable from API'}`);
    if (opt === 'build') return (`Builds provided by Mytharria using [Smite Calculator](https://www.smitecalculator.pro), with input from Skepso, Mendar and other mentors from the [SMITE Server](https://discord.gg/smitegame)`);
    if (opt === 'tips') return ('Tips and tricks provided by the mentors from the SMITE Discord Server');
    if (opt === 'lore') return (`**${godInfo.loreShort || 'Lore unavailable from API'}**\n\n${godInfo.loreLong || 'Lore unavailable from API'}`)
}

function getFields(godInfo, opt) {
    if (opt.includes('ability') || opt.includes('passive')) {
        if (opt.includes('passive')) {
            const passes = [];
            const names = [];
            for (const pass in Object.keys(godInfo)) {
                if (pass.includes('passive')) {
                    if (godInfo[pass][valueKeys]) for (const vkey in godInfo[pass][valueKeys]) {
                        const name = vkey.replace('INT', 'Intelligence ').replace('STR', 'Strength ').replace('Cheat', '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim().replace(/Dur\b/g, 'Duration');
                        if (!names.includes(name)) {
                            passes.push({
                                name: name,
                                value: `${godInfo[pass][valueKeys][vkey].length > 0 ? godInfo[pass][valueKeys][vkey].join('/') : 'Data missing from API'}`
                            });
                            names.push(name);
                        }
                        else {
                            passes.push({
                                name: 'API Error',
                                value: 'Part of this passive is missing from the API'
                            })
                        }
                    }
                }
            }
            if (passes.length > 0) return passes;
            else return null;
        }
        else {
            const vals = [];
            const names = [];
            const abNumber = `A0${opt.slice(-1)}`;
            if (godInfo['abilities'][abNumber]['valueKeys']) for (const vkey in godInfo['abilities'][abNumber]['valueKeys']) {
                const name = vkey.replace('INT', 'Intelligence ').replace('STR', 'Strength ').replace('Cheat', '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim().replace(/Dur\b/g, 'Duration');
                if (!names.includes(name)) {
                    vals.push({
                        name: name,
                        value: `${godInfo['abilities'][abNumber]['valueKeys'][vkey].length > 0 ? godInfo['abilities'][abNumber]['valueKeys'][vkey].join('/') : 'Data missing from API'}`
                    });
                    names.push(name);
                }
            }
            else {
                vals.push({
                    name: 'API Error',
                    value: 'Part of this ability\'s numbers are missing from the API'
                })
            }
            if (vals.length > 0) return vals;
            else return null;
        }
    }
    else {
        if (opt.includes('basic')) {
            const vals = [];
            const names = [];
            if (godInfo['baseStats']) for (const vkey in godInfo['baseStats']) {
                const name = vkey.replace('INT', 'Intelligence ').replace('STR', 'Strength ').replace('Cheat', '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim().replace(/Dur\b/g, 'Duration');
                if (!names.includes(name)) {
                    vals.push({
                        name: name,
                        value: `${godInfo['baseStats'][vkey] ? '**Level 1:** '.concat(godInfo['baseStats'][vkey]['1'], '; **Level 20:** ', godInfo['baseStats'][vkey]['20'], '; **Change per level:** ', godInfo['baseStats'][vkey]['rate']) : 'Data missing from API'}`
                    });
                    names.push(name);
                }
            }
            else {
                vals.push({
                    name: 'API Error',
                    value: 'Part of the basic information about this god is missing from the API'
                })
            }
            if (vals.length > 0) return vals;
            else return null;
        }
        else {
            if (opt.includes('build') && godInfo.builds) {
                const f = [];
                for (const build of godInfo.builds) {
                    f.push({
                        name: `**Optimal build:** __${build.full_build.join(', ')}__`,
                        value: `**Start with: **${build.starting.join(', ')}\n**Usage: **${build.notes}\nCreated by ${build.author} on ${build.last_edit} based on SMITE2 patch ${build.based_on_patch}`
                    })
                }
                if (f.length > 0) return f;
                else return null;
            }
            else {
                const t = [];
                if (opt.includes('tips') && godInfo.tips) {
                    for (const tip of godInfo.tips) {
                        t.push({
                            name: tip.title,
                            value: tip.value
                        })
                    }
                    if (t.length > 0) return t;
                    else return null;
                }
                else return null;
            }
        }
    }

}

function getThumb(godInfo, opt) {
    let thumbName = '';
    let thumb = null;
    switch (opt) {
        case 'build': case 'lore': case 'basic': case 'tips':
            thumbName = `${godInfo.name.replace(' ', '')}.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}.webp`)
            break;
        case 'passive':
            thumbName = `${godInfo.name.replace(' ', '')}Passive.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}Passive.webp`)
            break;
        case 'ability1':
            thumbName = `${godInfo.name.replace(' ', '')}A1.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}A1.webp`)
            break;
        case 'ability2':
            thumbName = `${godInfo.name.replace(' ', '')}A2.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}A2.webp`)
            break;
        case 'ability3':
            thumbName = `${godInfo.name.replace(' ', '')}A3.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}A3.webp`)
            break;
        case 'ability4':
            thumbName = `${godInfo.name.replace(' ', '')}A4.webp`;
            thumb = new AttachmentBuilder(`${assetsAbsPath}s2gods\\${godInfo.name.replace(' ', '')}A4.webp`)
            break;

    }
    return { 'name': thumbName, 'obj': thumb }
}

function convertToLabel(custID) {
    switch (custID) {
        case 'passive': return 'Passive ability';
        case 'ability1': return '1st Ability';
        case 'ability2': return '2nd Ability';
        case 'ability3': return '3rd Ability';
        case 'ability4': return '4th (Ultimate) Ability';
        case 'basic': return 'Basic Details';
        case 'build': return 'Recommended SMITE2 Builds';
        case 'lore': return 'SMITE2 Lore';
        case 'tips': return 'Tips and tricks';

    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('s2god')
        .setDescription('Look up a SMITE2 god')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the god')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('build')
                .setDescription('Jump directly to the build for this god')
                .setRequired(false)
                .setChoices(
                    {
                        name: 'true',
                        value: 'true'
                    }
                )
        ),



    async autocomplete(interaction) {
        const gods = await loadGods(true);
        const focusedValue = interaction.options.getFocused().toLowerCase();

        const filtered = gods
            .filter(god => god.name.toLowerCase().includes(focusedValue))
            .slice(0, 25); // Discord limits to 25 choices

        await interaction.respond(
            filtered.map(god => ({
                name: god.name,
                value: god.name
            }))
        );
    },

    async execute(interaction) {
        const godName = interaction.options.getString('name');
        const gods = await loadGods(false);

        const god = gods.find(i =>
            i.name.toLowerCase().includes(godName.toLowerCase())
        );

        if (!god) {
            await interaction.reply({
                content: 'God not found!',
                ephemeral: true
            });
            return;
        }

        const jumpToBuild = interaction.options.getString('build') ? true : false;

        const embedMessage = async (option) => {
            const thumbInfo = getThumb(god, option)
            const fields = getFields(god, option)
            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle(`${convertToLabel(option)} of ${god.name}`)
                .setDescription(getDesc(god, option))
                .setThumbnail(`attachment://${thumbInfo.name}`)
                .setTimestamp()
                .setFooter({ text: 'Data from SMITE2 Alpha, provided by Mytharria', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' });


            if (fields) {
                embed.setFields(fields)
            }
            return [embed, thumbInfo.obj];
        }

        const buttons1 = [
            { label: 'Passive', action: 'passive' },
            { label: 'Ability 1', action: 'ability1' },
            { label: 'Ability 2', action: 'ability2' },
            { label: 'Ability 3', action: 'ability3' },
            { label: 'Ability 4', action: 'ability4' },
        ];

        const buttons2 = [
            { label: 'Basic Details', action: 'basic' },
            { label: 'Build', action: 'build' },
            { label: 'Tips and Tricks', action: 'tips' },
            { label: 'Lore', action: 'lore' }
        ];

        const row1 = new ActionRowBuilder()
            .addComponents(buttons1.map(button =>
                new ButtonBuilder()
                    .setCustomId(button.action)
                    .setLabel(button.label)
                    .setStyle(ButtonStyle.Primary)
            ));
        const row2 = new ActionRowBuilder()
            .addComponents(buttons2.map(button =>
                new ButtonBuilder()
                    .setCustomId(button.action)
                    .setLabel(button.label)
                    .setStyle(ButtonStyle.Primary)
            ));

        const oldEmbed = await embedMessage(jumpToBuild ? 'build' : 'basic');
        const message = await interaction.reply({ embeds: [oldEmbed[0]], components: [row1, row2], fetchReply: true, files: [oldEmbed[1]] });

        const filter = i => i.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async i => {
            const newEmbed = await embedMessage(i.customId)
            await i.update({ embeds: [newEmbed[0]], components: [row1, row2], files: [newEmbed[1]] });
        });

        collector.on('end', () => {
            //row1.components.forEach(button => button.setDisabled(true));
            //row2.components.forEach(button => button.setDisabled(true));
            message.edit({ components: [] });
        });
    }
}