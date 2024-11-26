const { EmbedBuilder, SlashCommandBuilder, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const godThumbnail = 'https://webcdn.hirezstudios.com/smite/god-skins/amaterasu_sunny-chibi.jpg';

module.exports = {
    data : new SlashCommandBuilder()
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
        const buttons = new ActionRowBuilder()
            .addComponents(amaBotButton, discordServerButton, wikiBotButton);

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Hi! I\'m A-bot-erasu!')
            .setDescription('I\'m a fun SMITE bot, packed with fun games and features! Here\'s some helpful information:')
            .setThumbnail(`${godThumbnail}`)
            .addFields(
                { name: 'Basic Commands', value: '**help** : List supported commands and how to use them \n**latency** : Gets the bot\'s latency \n**ping** : Ping the bot' },
                { name: 'SMITE: Fun', value: '**godabilitytrivia** : Play SMITE Trivia!\n**leaderboard** : View the leaderboard for this server\n**sunshine** : Spread some sunlight onto chat!' },
                { name: 'SMITE: SPL', value: 'Not yet supported\n Planned features: leaderboard, schedule, teams'},
                { name: 'SMITE: Technical', value: '**resources** : View helpful resources for SMITE 1 and 2\nPlanned features: Damage calculator, customisable build generator, view latest patch information, track item and god changes'},
                { name: 'Sister bot', value: 'Get the best builds for any god: use SmiteWikiBot by DiscoFerry#6038!'},
                { name: 'Server count', value: `Currently serving ${interaction.client.guilds.cache.size} servers!`},
                { name: 'Bot version: 0.8.1', value: `Data from the HiRez API, builds provided by SMITE mentors using SmiteWikiBot`},
            )
            .setTimestamp()
            .setFooter({text: 'Developed by thekayaya (formerly Kayaya#3081), inspired and assisted by discoferry (formerly DiscoFerry#6038)', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        await interaction.reply({embeds : [embed], components: [buttons]});
    },
};