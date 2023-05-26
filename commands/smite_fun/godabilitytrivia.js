const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const abilities = ['Ability1', 'Ability2', 'Ability3', 'Ability4', 'Ability5' ];
// "godAbility1_URL"

module.exports = {
    data : new SlashCommandBuilder()
        .setName('godabilitytrivia')
        .setDescription('Guess which god has an ability with the given name'),
    async execute(interaction) {
        const skinJSON = path.join('assets/gods', (Math.floor(Math.random() * fs.readdirSync('assets/gods').length - 1)).toString() + '.json'); // -1 because of gitignore
        const JSONData = fs.readFileSync(skinJSON);
        const godJSON = JSON.parse(JSONData.toString());
        const godName = godJSON.Name;
        const get_ability = abilities[Math.floor(Math.random() * abilities.length)];
        const godAbility = godJSON[get_ability];
        console.log(`${godName}`);
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Guess the god from the ability name!')
            .setDescription(`Ability name: **${godAbility}**`)
            .setTimestamp()
            .setFooter({text: 'You get 3 guesses in 60 seconds!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        const collectorFilter = response => {
            return (godName.toLowerCase() === response.content.toLowerCase());
        };
        await interaction.reply({embeds : [embed], fetchReply : true})
            .then(() => {
                interaction.channel.awaitMessages({filter: collectorFilter, max: 1, time: 60000, errors: ['time']})
                    .then(collected => {
                        console.log(collected);
                        interaction.followUp(`${collected.first().author} got the correct answer, **${godName}**!`);
                        const replyEmbed = new EmbedBuilder()
                            .setColor(0xFFFF00)
                            .setTitle(`${collected.first().author.username} got the answer!`)
                            .setDescription(`**${godAbility}** is an ability on **${godName}**!`)
                            .setTimestamp()
                            .setFooter({text: 'Nicely done!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
                        interaction.editReply({embeds: [replyEmbed]});
                    })
                    .catch(collected => {
                        console.log(collected);
                        const replyEmbed = new EmbedBuilder()
                            .setColor(0xFFFF00)
                            .setTitle('Looks like nobody got the answer!')
                            .setDescription(`**${godAbility}** is an ability on **${godName}**!`)
                            .setTimestamp()
                            .setFooter({text: 'Better luck next time!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
                        interaction.editReply({embeds: [replyEmbed]});
                    });
            });
    },
};
