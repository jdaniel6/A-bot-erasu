/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');

const updateAssets = require('../../assets/updateAssets.js');
const { StringSelectMenuBuilder, SlashCommandBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const godList = [];
updateGodsList();

const hunterItems = updateAssets.updateItemLists('h');
const mageItems = updateAssets.updateItemLists('m');
const guardianItems = updateAssets.updateItemLists('g');
const warriorItems = updateAssets.updateItemLists('w');
const assassinItems = updateAssets.updateItemLists('a');
const ratItems = updateAssets.updateItemLists('r');

function updateGodsList() {
    const JSONS = fs.readdirSync('assets/gods').filter(file => path.extname(file) === '.json');
    JSONS.forEach (file => {
        const JSONData = fs.readFileSync(path.join('assets/gods', file));
        godList.push(JSON.parse(JSONData.toString()));
    });
}
let i = 0;
module.exports = {
    data : new SlashCommandBuilder()
        .setName('generatebuild')
        .setDescription('Generate a custom build for a god'),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('god')
            .setPlaceholder('Select a god');
        for (const godJSON of godList) {
            if (i == 24) break;
            select.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${godJSON.Name}`)
                    .setDescription('idk')
                    .setValue(`${godJSON.Name}`),
            );
            i++;
        }
        i = 0;
        const options = new ActionRowBuilder()
            .addComponents(select);

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Custom build generator')
            .setDescription('Select a god to generate the build for:')
            .setTimestamp()
            .setFooter({text: 'This command is non-functional at the moment due to Discord API limits', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});

        await interaction.reply({
            embed : [embed],
            // components : [options],
        });
    },
};