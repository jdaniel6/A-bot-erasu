const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const godThumbnail = 'https://webcdn.hirezstudios.com/smite/god-skins/amaterasu_sunny-chibi.jpg';

module.exports = {
    data : new SlashCommandBuilder()
        .setName('help')
        .setDescription('List supported commands and how to use them'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Hi! I\'m A-bot-erasu!')
            .setDescription('I\'m a fun SMITE bot, packed with fun games and features! Here\'s some helpful information:')
            .setThumbnail(`${godThumbnail}`)
            .addFields(
                { name: 'Basic Commands', value: '**help** : List supported commands and how to use them \n**latency** : Gets the bot\'s latency \n**ping** : Ping the bot' },
                { name: 'SMITE: Fun', value: '**trivia** : Play SMITE Trivia! \n**sunshine** : Spread some sunlight onto chat!' },
                { name: 'SMITE: SPL', value: 'Not yet supported\n Planned features: leaderboard, schedule, teams'},
                { name: 'SMITE: Technical', value: 'Not yet supported\nPlanned features: Damage calculator, customisable build generator, view latest patch information, track item and god changes'},
                { name: 'Sister bot', value: 'Get the best builds for any god: use SmiteWikiBot by DiscoFerry#6038\nInvite to your server: https://discord.com/api/oauth2/authorize?client_id=839866838305210368&permissions=274878286912&scope=bot'},
                { name: 'Invite A-bot-erasu to your server!', value: 'Tap on my avatar, and click on the \'Add to Server\' button!'},
                { name: 'Discord Server', value: 'My support server! Join at https://discord.gg/6FpzxyWAU8'},
                { name: 'Bot version: 0.8.1', value: 'Data from the HiRez API, builds provided by SMITE mentors using SmiteWikiBot'},
            )
            .setTimestamp()
            .setFooter({text: 'Developed by Kayaya#3081, inspired and assisted by DiscoFerry#6038', iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        await interaction.reply({embeds : [embed]});
    },
};