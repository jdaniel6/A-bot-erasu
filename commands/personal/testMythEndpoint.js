const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testmyth')
        .setDescription('Test the Myth endpoint'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await fetch('https://www.smitecalculator.pro/about');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            fs.writeFileSync('body.json', $('body').text().trim().split(';(self.__next')[0]);
            const bodyComplete = $('body').text().trim().split('(')[0].split('[{"abilities');
            const bodyText = bodyComplete[0];
            fs.writeFileSync('temp.json', bodyText, 'utf-8');

            let bodyjson = {};
            let itemNameS = '';
            try {
                bodyjson = JSON.parse(bodyText.replace(';', ' '));
                const itemNames = bodyjson.map(item => item.internalName);
                itemNameS = itemNames.join('\n');
                console.log(itemNameS)
            } catch (error) {
                console.log(error);
            }

            const embed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('Myth Endpoint Test')
                .setDescription(itemNameS || bodyText)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.editReply('There was an error fetching data from the endpoint.');
        }
    },
};

