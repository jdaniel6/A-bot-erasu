/* eslint-disable no-inline-comments, no-var */
const { devID, authKey, myID, mythID } = require('../../config.json');
const md5 = require('blueimp-md5');
const cheerio = require('cheerio');
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
    data: new SlashCommandBuilder()
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
        if (interaction.user.id === myID || interaction.user.id === mythID) {
            try {
                const godAssetsResponse = await fetch(updateGodAssetsURL);
                const itemAssetsResponse = await fetch(updateItemAssetsURL);
                const SPLResponse = await fetch(updateSPLURL);
                const mythS2IGResponse = await fetch('https://smitecalculator.pro/about')

                const godsList = {};

                // Downloading god details from API
                const godAssetsJSON = await godAssetsResponse.json();
                for (const godJSON in godAssetsJSON) {
                    const godName = godAssetsJSON[godJSON].Name;
                    const godID = godAssetsJSON[godJSON].id;
                    godsList[`${godName}`] = godID;
                    fs.writeFileSync(`assets/gods/${godName}.json`, JSON.stringify(godAssetsJSON[godJSON], null, 4), 'utf8');
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
                            fs.mkdirSync(filePath, { recursive: true });
                            fs.writeFileSync(`${filePath}/${godJSON}.json`, JSON.stringify(JSONresponse[godJSON], null, 4), 'utf8');
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
                    fs.writeFileSync(`assets/items/${itemJSON}.json`, JSON.stringify(itemAssetsJSON[itemJSON], null, 4), 'utf8');
                }
                console.log('Updated item details');

                // Downloading SPL Matches from API
                const SPLJSONresponse = await SPLResponse.json();
                for (const match in SPLJSONresponse) {
                    fs.writeFileSync(`assets/spl/matches/${match}.json`, JSON.stringify(SPLJSONresponse[match], null, 4), 'utf8');
                }
                console.log('Updated SPL matches');

                //Downloading S2 items and gods using Myth's S2 Calculator endpoint
                //Will be replaced in the future with Hirez's official endpoint
                const mythHTML = await mythS2IGResponse.text();
                const $ = cheerio.load(mythHTML);
                const bodyComplete = $('body').text().trim().split(';(self.__next')[0]
                const itemsngods = bodyComplete.split('[{"abilities');
                const s2items = itemsngods[0];
                const s2gods = `[{"abilities${itemsngods[1]}`;

                const s2itemsArray = JSON.parse(s2items.replace(';', ' '));
                for (const s2item of s2itemsArray) {
                    const filePath = `assets/s2items`;
                    fs.mkdirSync(filePath, { recursive: true });
                    fs.writeFileSync(`${filePath}/${s2item['internalName'].replace(' ', '')}.json`, JSON.stringify(s2item, null, 4), 'utf8');
                    if (!('icon' in s2item)) continue;
                    const itemIconURL = `https://www.smitecalculator.pro${s2item['icon']}`;
                    const itemIcon = await fetch(itemIconURL);
                    const itemIconBlob = await itemIcon.blob();
                    const itemArrayBuffer = await itemIconBlob.arrayBuffer();
                    const itemBuffer = Buffer.from(itemArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2item['internalName'].replace(' ', '')}.webp`, itemBuffer);
                }

                const s2godsArray = JSON.parse(s2gods.replace(';', ' '));
                for (const s2god of s2godsArray) {
                    const filePath = `assets/s2gods`;
                    fs.mkdirSync(filePath, { recursive: true });
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}.json`, JSON.stringify(s2god, null, 4), 'utf8');
                    //god Icon
                    const godIconURL = `https://www.smitecalculator.pro${s2god['icon']}`;
                    const godIcon = await fetch(godIconURL);
                    const godIconBlob = await godIcon.blob();
                    const godArrayBuffer = await godIconBlob.arrayBuffer();
                    const godBuffer = Buffer.from(godArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}.webp`, godBuffer);
                    //god basic icon
                    const godBasicURL = `https://www.smitecalculator.pro${s2god['basic']['icon']}`;
                    const godBasic = await fetch(godBasicURL);
                    const godBasicBlob = await godBasic.blob();
                    const godBasicArrayBuffer = await godBasicBlob.arrayBuffer();
                    const godBasicBuffer = Buffer.from(godBasicArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}Basic.webp`, godBasicBuffer);
                    //god passive icon
                    const godPassiveURL = `https://www.smitecalculator.pro${s2god['passive']['icon']}`;
                    const godPassive = await fetch(godPassiveURL);
                    const godPassiveBlob = await godPassive.blob();
                    const godPassiveArrayBuffer = await godPassiveBlob.arrayBuffer();
                    const godPassiveBuffer = Buffer.from(godPassiveArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}Passive.webp`, godPassiveBuffer);
                    //god a01 icon
                    const godA1URL = `https://www.smitecalculator.pro${s2god['abilities']['A01']['icon']}`;
                    const godA1 = await fetch(godA1URL);
                    const godA1Blob = await godA1.blob();
                    const godA1ArrayBuffer = await godA1Blob.arrayBuffer();
                    const godA1Buffer = Buffer.from(godA1ArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}A1.webp`, godA1Buffer);
                    //god a02 icon
                    const godA2URL = `https://www.smitecalculator.pro${s2god['abilities']['A02']['icon']}`;
                    const godA2 = await fetch(godA2URL);
                    const godA2Blob = await godA2.blob();
                    const godA2ArrayBuffer = await godA2Blob.arrayBuffer();
                    const godA2Buffer = Buffer.from(godA2ArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}A2.webp`, godA2Buffer);
                    //god a03 icon
                    const godA3URL = `https://www.smitecalculator.pro${s2god['abilities']['A03']['icon']}`;
                    const godA3 = await fetch(godA3URL);
                    const godA3Blob = await godA3.blob();
                    const godA3ArrayBuffer = await godA3Blob.arrayBuffer();
                    const godA3Buffer = Buffer.from(godA3ArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}A3.webp`, godA3Buffer);
                    //god a04 icon
                    const godA4URL = `https://www.smitecalculator.pro${s2god['abilities']['A04']['icon']}`;
                    const godA4 = await fetch(godA4URL);
                    const godA4Blob = await godA4.blob();
                    const godA4ArrayBuffer = await godA4Blob.arrayBuffer();
                    const godA4Buffer = Buffer.from(godA4ArrayBuffer);
                    fs.writeFileSync(`${filePath}/${s2god['name'].replace(' ', '')}A4.webp`, godA4Buffer);
                }
                console.log('Downloaded S2 assets from Myth\'s Website');

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
            .setFooter({ text: `Welcome, ${interaction.user.username}`, iconURL: 'https://static.wikia.nocookie.net/smite_gamepedia/images/1/13/Icons_Amaterasu_A01.png/revision/latest?cb=20160107232023' });
        await interaction.editReply({ embeds: [replyEmbed] });
    },
};