const { EmbedBuilder, SlashCommandBuilder, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const godThumbnail = 'https://webcdn.hirezstudios.com/smite/god-skins/amaterasu_sunny-chibi.jpg';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List supported commands and how to use them'),
    async execute(interaction) {
        const wikiBotButton = new ButtonBuilder()
            .setURL('https://discord.com/api/oauth2/authorize?client_id=839866838305210368&permissions=274878286912&scope=bot')
            .setLabel('Invite SmiteWikiBot')
            .setStyle(ButtonStyle.Link);
        const amaBotButton = new ButtonBuilder()
            .setURL('https://discord.com/api/oauth2/authorize?client_id=906773394689761290&permissions=27362498964577&scope=bot')
            .setLabel('Invite A-bot-erasu')
            .setStyle(ButtonStyle.Link);
        const discordServerButton = new ButtonBuilder()
            .setURL('https://discord.gg/6FpzxyWAU8')
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link);
        const smiteCalcButton = new ButtonBuilder()
            .setURL('https://www.smitecalculator.pro')
            .setLabel('Mytharria\'s Smite 1 and 2 Calculator')
            .setStyle(ButtonStyle.Link);
        const buttons = new ActionRowBuilder()
            .addComponents(amaBotButton, discordServerButton, wikiBotButton, smiteCalcButton);

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Hi! I\'m A-bot-erasu!')
            .setDescription('I\'m a fun SMITE bot, packed with fun games and features! Here\'s some helpful information:')
            .setThumbnail(`${godThumbnail}`)
            .addFields(
                { name: 'Basic Commands', value: '**help** : List supported commands and how to use them \n**latency** : Gets the bot\'s latency \n**ping** : Ping the bot' },
                { name: 'SMITE: Fun', value: '**godabilitytrivia** : Play SMITE Trivia!\n**leaderboard** : View the leaderboard for this server\n**sunshine** : Spread some sunlight onto chat!' },
                { name: 'SMITE: SPL', value: '**vegastourney** : Get information about the Vegas Tourney teams and standings\nPlanned features: leaderboard, schedule, teams' },
                { name: 'SMITE: Technical', value: '**resources** : View helpful resources for SMITE 1 and 2\n**s2item** : Get information about an item in SMITE 2 Alpha\n**s2god** : Get information about a god from SMITE 2 Alpha\n**s2tierlist** : View tierlists for gods and items per role for the current SMITE2 patch\nPlanned features: Damage calculator, customisable build generator, view latest patch information, track item and god changes' },
                { name: 'Sister bot', value: 'Get the best builds for SMITE1 gods: use SmiteWikiBot by DiscoFerry#6038!' },
                { name: 'Server count', value: `Currently serving ${interaction.client.guilds.cache.size} servers!` },
                { name: 'Bot version: 0.8.3', value: `Data from the HiRez API, builds provided by SMITE mentors` },
            )
            .setTimestamp()
            .setFooter({ text: 'Developed by thekayaya (formerly Kayaya#3081), inspired by discoferry (formerly DiscoFerry#6038), feedback and promotion by yungsonix, with data and helpful information for the SMITE 2 Alpha provided by mytharria, other data from the HiRez API', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' });
        await interaction.reply({ embeds: [embed], components: [buttons] });
    },
};