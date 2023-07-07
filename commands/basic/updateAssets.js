/* eslint-disable no-inline-comments, no-var */
const { devID, authKey, myID } = require('../../config.json');
const md5 = require('blueimp-md5');
const fs = require('fs');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
/**
426 Casual Conq
435 Arena
440 Ranked Duel
445 Assault
448 Casual Joust
450 Ranked Joust
451 Ranked Conquest
10189 Slash
*/

const hunterItems = [];
const mageItems = [];
const guardianItems = [];
const warriorItems = [];
const assassinItems = [];
const ratItems = [];

var updateStatus = 'Failed with errors; check logs';
function currentDate() {
    const timestamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3); // stolen from Disco who got it from StackOverflow (i tried implementing my own but it got too OOP and I gave up)
    return (timestamp);
}

function generateSignature(methodHandle, timestamp) {
    const signatureString = devID + methodHandle + authKey + timestamp;
    const signature = md5(signatureString);
    return (signature.toString());
}

async function generateSessionID(timestamp) {
    const url = `https://api.smitegame.com/smiteapi.svc/createsessionjson/${devID}/${generateSignature('createsession', timestamp)}/${timestamp}`;
    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) {
        throw Error('HTTPS Error');
    }
    try {
        const JSONresponse = await fetchResponse.json();
        const sessionID = JSONresponse.session_id;
        return sessionID;
    }
    catch (error) {
        console.log('Error generating session ID', error);
    }
}

module.exports = {
    data : new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update bot with data from the API'),
    async execute(interaction) {
        await interaction.deferReply();
        updateStatus = 'Failed with errors; check logs';
        const timestamp = currentDate();
        const sessionID = await generateSessionID(timestamp);
        const updateGodAssetsURL = `https://api.smitegame.com/smiteapi.svc/getgodsjson/${devID}/${generateSignature('getgods', timestamp)}/${sessionID}/${timestamp}/1`;
        const updateItemAssetsURL = `https://api.smitegame.com/smiteapi.svc/getitemsjson/${devID}/${generateSignature('getitems', timestamp)}/${sessionID}/${timestamp}/1`;
        const updateSPLURL = `https://api.smitegame.com/smiteapi.svc/getesportsproleaguedetailsjson/${devID}/${generateSignature('getesportsproleaguedetails', timestamp)}/${sessionID}/${timestamp}`;
        if (interaction.user.id === myID) {
            try {
                const godAssetsResponse = await fetch(updateGodAssetsURL);
                const itemAssetsResponse = await fetch(updateItemAssetsURL);
                const SPLResponse = await fetch(updateSPLURL);

                const godsList = {};

                // Downloading god details from API
                const godAssetsJSON = await godAssetsResponse.json();
                for (const godJSON in godAssetsJSON) {
                    const godName = godAssetsJSON[godJSON].Name;
                    const godID = godAssetsJSON[godJSON].id;
                    godsList[`${godName}`] = godID;
                    fs.writeFileSync (`assets/gods/${godName}.json`, JSON.stringify (godAssetsJSON[godJSON], null, 4), 'utf8');
                }
                console.log('Updated God details');
                console.log(godsList);

                // Downloading skins for gods from API
                for (const god in godsList) {
                    const fetchResponse = await fetch(`https://api.smitegame.com/smiteapi.svc/getgodskinsjson/${devID}/${generateSignature('getgodskins', timestamp)}/${sessionID}/${timestamp}/${godsList[god]}/1`);
                    try {
                        const JSONresponse = await fetchResponse.json();
                        for (const godJSON in JSONresponse) {
                            const filePath = `assets/skins/${god}`;
                            fs.mkdirSync (filePath, {recursive: true});
                            fs.writeFileSync (`${filePath}/${godJSON}.json`, JSON.stringify (JSONresponse[godJSON], null, 4), 'utf8');
                        }
                    }
                    catch (error) {
                        console.log('Error updating skins', error);
                    }
                }
                console.log('Updated God skins');

                // Downloading item details from API
                const itemAssetsJSON = await itemAssetsResponse.json();
                for (const itemJSON in itemAssetsJSON) {
                    if ((itemJSON.ActiveFlag == 'y') && ((itemJSON.ItemTier > 2) || (itemJSON.StartingItem == true))) {
                        const restrictions = itemJSON.RestrictedRoles.split(',');
                        const menuArray = itemJSON.ItemDescription.Menuitems;
                        for (const menuJSON of menuArray) {
                            if (menuJSON.Description.toLowerCase() == 'physical power') {
                                if (itemJSON.DeviceName.toLowerCase().split(' ').includes('acorn')) {
                                    ratItems.push(itemJSON); break;
                                }
                                if (!(restrictions.includes('hunter'))) hunterItems.push(itemJSON);
                                if (!(restrictions.includes('warrior'))) warriorItems.push(itemJSON);
                                if (!(restrictions.includes('assassin'))) {
                                    assassinItems.push(itemJSON);
                                    ratItems.push(itemJSON);
                                }
                                break;
                            }
                            else if (menuJSON.Description.toLowerCase() == 'magical power') {
                                if (!(restrictions.includes('mage'))) mageItems.push(itemJSON);
                                if (!(restrictions.includes('guardian'))) guardianItems.push(itemJSON);
                                    break;
                                }
                                else {
                                    hunterItems.push(itemJSON);
                                    warriorItems.push(itemJSON);
                                    assassinItems.push(itemJSON);
                                    mageItems.push(itemJSON);
                                    guardianItems.push(itemJSON);
                                    break;
                                }
                        }
                    }
                    fs.writeFileSync (`assets/items/${itemJSON}.json`, JSON.stringify (itemAssetsJSON[itemJSON], null, 4), 'utf8');
                }
                console.log('Updated item details');

                // Downloading SPL Matches from API
                const SPLJSONresponse = await SPLResponse.json();
                for (const match in SPLJSONresponse) {
                    fs.writeFileSync (`assets/spl/matches/${match}.json`, JSON.stringify (SPLJSONresponse[match], null, 4), 'utf8');
                }
                console.log('Updated SPL matches');

                updateStatus = 'All assets have been updated successfully and written to disk.';
            }
            catch (error) {
                console.log('Error in updating gods, items or SPL');
            }
        }
        else {
            updateStatus = 'You are not authorized to run this command!';
        }

        const replyEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('Update Assets')
                .setDescription(`Status: ${updateStatus}`)
                .setTimestamp()
                .setFooter({text: `Welcome, ${interaction.user.username}`, iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023'});
        await interaction.editReply({embeds: [replyEmbed]});
    },
};