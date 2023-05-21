const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const gods = ['Amaterasu', 'Apollo', 'Horus', 'Hou Yi', 'Ix Chel', 'Khepri', 'Olorun', 'Ra', 'Sol', 'Xbalanque'];

module.exports = {
    data : new SlashCommandBuilder()
        .setName('sunshine')
        .setDescription('Spread some sunlight onto chat!'),
    async execute(interaction) {
        const sungod = gods[Math.floor(Math.random() * gods.length)];
        const skinJSON = path.join(`assets/skins/${sungod}`, (Math.floor(Math.random() * fs.readdirSync(`assets/skins/${sungod}`).length)).toString() + '.json');
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
            .setTitle(`${godName} in their ${skinName} skin:`)
            .setDescription(`This is a ${skinObt} skin.`)
            .setThumbnail(`${godThumbnail}`)
            .setImage(`${skinURL}`)
            .setTimestamp()
            .setFooter({text: `All hail ${godName}!`, iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        await interaction.reply({embeds : [embed]});
    },
};