const fs = require('fs');
const path = require('path');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const rawUpcomingMatches = fs.readdirSync('assets/spl/matches').filter(file => path.extname(file) === '.json');
const upcomingMatches = [];
const matches = [];
for (const match of rawUpcomingMatches) {
    upcomingMatches.push(parseInt(match.slice(0, -5)));
}
upcomingMatches.sort(function(a, b) {return (a - b);});
let numOfMatches = upcomingMatches.length - 1;
while (numOfMatches > 0) {
    const matchJSON = path.join('assets/spl/matches', (numOfMatches).toString() + '.json'); // -1 because of gitignore
    const JSONData = fs.readFileSync(matchJSON);
    const parsedJSON = JSON.parse(JSONData.toString());
    const rawMatchDate = new Date(parsedJSON.match_date);
    if (rawMatchDate >= Date.now()) {
        matches.push(parsedJSON);
        numOfMatches--;
    }
    else { break; }
}

module.exports = {
    data : new SlashCommandBuilder()
        .setName('splschedule')
        .setDescription('Get SPL Schedule for this week'),
    async execute(interaction) {
        if (matches.length > 0) {
            const replyEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('Current SPL Schedule')
                .setDescription('Upcoming matches in your local timezone:')
                .setTimestamp()
                    .setFooter({text: 'Official SPL Website: https://www.smiteproleague.com/', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
            for (const parsedJSON of matches) {
                const rawMatchDate = (new Date(parsedJSON.match_date).getTime() / 1000).toFixed(0);
                replyEmbed.addFields(
                    { name: `**${parsedJSON.home_team_name}** vs **${parsedJSON.away_team_name}**`, value: `<t:${rawMatchDate}:F>`},
                );
            }
            await interaction.reply({embeds: [replyEmbed]});
        }
        else {
            const matchJSON = path.join('assets/spl/matches', (upcomingMatches[upcomingMatches.length - 1]) + '.json'); // -1 because of gitignore
            const JSONData = fs.readFileSync(matchJSON);
            const parsedJSON = JSON.parse(JSONData.toString());
            const rawMatchDate = (new Date(parsedJSON.match_date).getTime() / 1000).toFixed(0);
            const replyEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('Current SPL Schedule')
                .setDescription('No matches scheduled, last match:')
                .addFields(
                    { name: `**${parsedJSON.home_team_name}** vs **${parsedJSON.away_team_name}** on <t:${rawMatchDate}:F>`, value: `Winner: **${parsedJSON.winning_team_clan_id == parsedJSON.home_team_clan_id ? parsedJSON.home_team_name : parsedJSON.away_team_name}**`},
                )
                .setTimestamp()
                .setFooter({text: 'Official SPL Website: https://www.smiteproleague.com/', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
            await interaction.reply({embeds: [replyEmbed]});
        }
    },
};