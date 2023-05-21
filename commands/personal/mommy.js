const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const mommies = ['Amaterasu', 'Awilix', 'Bastet', 'Bellona', 'Da Ji', 'Discordia', 'Eset', 'Freya', 'Hel', 'Ishtar', 'Kali', 'Medusa', 'Morgan Le Fay', 'Mulan', 'Neith', 'Nemesis', 'Nike', 'Nox', 'Nu Wa', 'Pele', 'Persephone', 'Serqet', 'Sol', 'Terra', 'The Morrigan', 'Yemoja'];

module.exports = {
    data : new SlashCommandBuilder()
        .setName('mommy')
        .setDescription('Get a mommy image'),
    async execute(interaction) {
        const mommyGod = mommies[Math.floor(Math.random() * mommies.length)];
        const skinJSON = path.join(`assets/skins/${mommyGod}`, (Math.floor(Math.random() * fs.readdirSync(`assets/skins/${mommyGod}`).length)).toString() + '.json');
        const JSONData = fs.readFileSync(skinJSON);
        const godJSON = JSON.parse(JSONData.toString());
        const godName = godJSON.god_name;
        const godThumbnail = godJSON.godIcon_URL;
        const skinObt = godJSON.obtainability;
        const skinName = godJSON.skin_name;
        let skinURL = godJSON.godSkin_URL;
        if (skinURL == '') {
            skinURL = godThumbnail.slice(0, -4).concat(`_standard-${godName}.jpg`).replace(' ', '-').replace('god-icons', 'god-skins').toLowerCase();
        }
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle(`Mommy ${godName} in her ${skinName} skin:`)
            .setDescription(`This is a ${skinObt} skin.`)
            .setThumbnail(`${godThumbnail}`)
            .setImage(`${skinURL}`)
            .setTimestamp()
            .setFooter({text: `All hail mommy ${godName}!`, iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        await interaction.reply({embeds : [embed]});
    },
};