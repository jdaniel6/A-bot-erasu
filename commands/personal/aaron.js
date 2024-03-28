const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const gods = fs.readdirSync('assets/gods');
const index = gods.indexOf('.gitignore');
if (index > -1) { // only splice array when item is found
    gods.splice(index, 1); // 2nd parameter means remove one item only
}
const abilities = ['passive', '1', '2', '3', '4'];
const copes = ['his 1 doesn\'t even full clear wave level 2', 'he doesn\'t have any CC immunity', 'his blind is the worst blind', 'I have to go magi\'s JUST for them and I lose SOOOO much damage', 'he doesn\'t have any CC', 'I can\'t even go in on them without beads', 'they can just beads me and run away', 'I can\'t even kill tanks', 'they keep nerfing him']

module.exports = {
    data : new SlashCommandBuilder()
        .setName('aaron')
        .setDescription('cope a bit'),
    async execute(interaction) {
        const god = gods[Math.floor(Math.random() * gods.length)].slice(0,-5);
        const ability = abilities[Math.floor(Math.random() * 5)];
        const cope = copes[Math.floor(Math.random() * copes.length)];
        await interaction.reply(`Look at ${god}; they're so strong... like look at their ${ability}... it's so good... now look at Set. He's so bad and weak and ${cope}. He really needs a buff. Please, HiRez.`);
    },
};