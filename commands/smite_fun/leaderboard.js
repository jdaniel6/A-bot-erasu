const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the leaderboard for this server'),
    async execute(interaction) {
        let message = '';
        const scoresPath = path.join('assets', 'triviascores.json');
        let scores = new Map();
        // Modify the score loading function to include server validation
        try {         
            const scoreData = JSON.parse(fs.readFileSync(scoresPath));
            // Only load scores for users still in the server
            for (const [userId, score] of Object.entries(scoreData)) {
                try {
                    const member = await interaction.guild.members.fetch(userId);
                    if (member) {
                        scores.set(userId, score);
                    }
                } catch (error) {
                    // User not in server, skip them
                    continue;
                }
            }
            const sortedScores = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
            const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Leaderboard')
            .setDescription(`Current top players in **${interaction.guild.name}**:`)
            .addFields(
                ...(sortedScores.length >= 1 ? [{ name: `1. ${(await interaction.guild.members.fetch(sortedScores[0][0])).displayName}`, value: `Score: ${sortedScores[0][1]} :star:` }] : []),
                ...(sortedScores.length >= 2 ? [{ name: `2. ${(await interaction.guild.members.fetch(sortedScores[1][0])).displayName}`, value: `Score: ${sortedScores[1][1]} :star:` }] : []),
                ...(sortedScores.length >= 3 ? [{ name: `3. ${(await interaction.guild.members.fetch(sortedScores[2][0])).displayName}`, value: `Score: ${sortedScores[2][1]} :star:` }] : []),
                ...(sortedScores.length >= 4 ? [{ name: `4. ${(await interaction.guild.members.fetch(sortedScores[3][0])).displayName}`, value: `Score: ${sortedScores[3][1]} :star:` }] : []),
                ...(sortedScores.length >= 5 ? [{ name: `5. ${(await interaction.guild.members.fetch(sortedScores[4][0])).displayName}`, value: `Score: ${sortedScores[4][1]} :star:` }] : []),
            )
            .setTimestamp()
            .setFooter({text: 'Good job!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
            await interaction.reply({embeds : [embed]});
        } 
        catch (error) {
            message = 'Error loading scores';
            const embed = new EmbedBuilder()    
                .setColor(0xFFFF00)
                .setTitle('Leaderboard')
                .setDescription(message)
                .setTimestamp()
                .setFooter({text: 'Oops!', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
            await interaction.reply({embeds : [embed]});
        }
        
        
    }
};