const { SlashCommandBuilder } = require('discord.js');
const possibleAles = ['meow :3', 'mew mew', 'nya~', 'im just a silly lil cat', 'will slur for headpats :3', 'mrow purr purr', 'you leave my fucked up lookin dog alone', 'can i has milk'];
module.exports = {
    data : new SlashCommandBuilder()
        .setName('heretic')
        .setDescription('play with a catgirl'),
    async execute(interaction) {
        await interaction.reply(possibleAles[Math.floor(Math.random() * possibleAles.length)]);
    },
};