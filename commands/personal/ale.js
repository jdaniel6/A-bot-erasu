const { SlashCommandBuilder } = require('discord.js');
const possibleAles = ['||<:gottem:1112141905548026016>||', 'How the fffFUCK do you go\nfull 👏 fucking 👏 damage\nand get zeeero 👌 fuckinnng 👌 killlls'];
module.exports = {
    data : new SlashCommandBuilder()
        .setName('ale')
        .setDescription('Provami e scoprilo...'),
    async execute(interaction) {
        await interaction.reply(possibleAles[Math.floor(Math.random() * possibleAles.length)]);
    },
};