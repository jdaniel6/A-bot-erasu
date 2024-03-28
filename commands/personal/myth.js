const { SlashCommandBuilder } = require('discord.js');
const possibleFabs = ['oh chea', 'LMAOAOAOA', 'BADB', 'WE are the MORRIGAN', 'wellllll', '🤪', 'WELLLLLL', 'WELL I DO DABBLE', 'bozo', 'bestie', 'kid.', '1v1 me', 'FLABBERGASTED', 'I\'m so quirky', 'so skinnty', 'devoured', 'I ate that', 'he ate that', 'MISS SUSANNO YOU THOUGHT U ATE THAT BEACHIEE', 'choke', 'die', 'not to brag or anything, but when I say I dabble... I\'m not exaggerating.', 'ur done'];
module.exports = {
    data : new SlashCommandBuilder()
        .setName('myth')
        .setDescription('Sprinkle a bit of the rainbow'),
    async execute(interaction) {
        await interaction.reply(possibleFabs[Math.floor(Math.random() * possibleFabs.length)]);
    },
};