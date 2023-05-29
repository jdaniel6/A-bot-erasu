const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { clientID } = require('../../config.json');
const fs = require('fs');
const path = require('path');

const abilities = ['Ability1', 'Ability2', 'Ability3', 'Ability4', 'Ability5' ];
// "godAbility1_URL"

module.exports = {
    data : new SlashCommandBuilder()
        .setName('godabilitytrivia')
        .setDescription('Guess which god has an ability with the given name'),
    async execute(interaction) {
        const skinJSON = path.join('assets/gods', (Math.floor(Math.random() * (fs.readdirSync('assets/gods').length - 1))).toString() + '.json'); // -1 because of gitignore
        const JSONData = fs.readFileSync(skinJSON);
        const godJSON = JSON.parse(JSONData.toString());
        const godName = godJSON.Name;
        const abilityNumber = Math.floor(Math.random() * abilities.length);
        const get_ability = abilities[abilityNumber];
        const godAbility = godJSON[get_ability];
        console.log(`${godName}`);
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Guess the god from the ability name!')
            .setDescription(`Ability name: **${godAbility}**`)
            .setTimestamp()
            .setFooter({text: 'You get 30 seconds to guess!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        const collectorFilter = async response => {
            if (!(response.author.bot) && (response.mentions.users.size > 0)) {
                const instMessage = await interaction.fetchReply();
                const refMessage = await response.fetchReference();
                if (response.mentions.users.has(clientID) && (refMessage.id == instMessage.id)) { // message is a reply to the bot (takes care of discord intents: if message is not directed to bot, don't even read)
                    const godNameProcessed = godName.replace(/ /g, '').replace(/'/g, '').replace(/’/g, '').trim().toLowerCase();
                    const ansProcessed = response.content.replace(/ /g, '').replace(/'/g, '').replace(/’/g, '').trim().toLowerCase();
                    if (((godNameProcessed === 'ra') && (ansProcessed.length == 3)) || (RegExp(/\b\w{3,}[\d|p]/gi).test(ansProcessed))) {
                        if ((godNameProcessed.includes(ansProcessed.slice(0, -1)) || (godNameProcessed === 'ahmuzencab' && ansProcessed.slice(0, -1) === 'amc') || (godNameProcessed === 'morganlefay' && ansProcessed.slice(0, -1) === 'mlf')) && (ansProcessed.slice(0, 1) === godNameProcessed.slice(0, 1))) {
                            if ((ansProcessed.slice(-1) === (abilityNumber + 1).toString()) || ((ansProcessed.slice(-1) === 'p') && (abilityNumber == 4))) { return true; }
                            else { response.reply('Almost, but not quite!'); return false; }
                        }
                        else { return false; }
                    }
                    else { response.reply('Answer must be at least first 3 letters of the god, in the format of GodName AbilityNumber (example: gilga 1). Use \'p\' to indicate passive (gilga p)'); return false; }
                }
                else { return false; }
            } // message is not a human reply
            else { return false; }
        };
        await interaction.reply({embeds : [embed], fetchReply : true})
            .then(() => {
                interaction.channel.awaitMessages({filter: collectorFilter, max: 1, time: 30000, errors: ['time']})
                    .then(collected => {
                        // console.log();
                        interaction.followUp(`${collected.first().author} got the correct answer, **${godName}**'s **${getOrdinal(abilityNumber)}** ability!`);
                        const abNum = getOrdinal(abilityNumber);
                        const replyEmbed = new EmbedBuilder()
                            .setColor(0xFFFF00)
                            .setTitle(`${collected.first().author.username} got the answer!`)
                            .setDescription(`**${godAbility}** is **${godName}**'s **${abNum}** ability!`)
                            .setTimestamp()
                            .setFooter({text: 'Nicely done!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
                        interaction.editReply({embeds: [replyEmbed]});
                    })
                    .catch(collected => {
                        const abNum = getOrdinal(abilityNumber);
                        const replyEmbed = new EmbedBuilder()
                            .setColor(0xFFFF00)
                            .setTitle('Looks like nobody got the answer in time!')
                            .setDescription(`**${godAbility}** is **${godName}**'s **${abNum}** ability!`)
                            .setTimestamp()
                            .setFooter({text: 'Better luck next time!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
                        interaction.editReply({embeds: [replyEmbed]});
                    });
            });
    },
};

function getOrdinal(abilityNumber) {
    switch (abilityNumber) {
        case 0: return '1st';
        case 1: return '2nd';
        case 2: return '3rd';
        case 3: return '4th';
        case 4: return 'Passive';
        default: return 'invalid';
    }
}