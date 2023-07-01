/* eslint-disable no-inline-comments, no-var */
const { match } = require('assert');
const { devID, authKey } = require('../config.json');
const md5 = require('blueimp-md5');
const fs = require('fs');
const path = require('path');
const { start } = require('repl');
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


var godsList = {};

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


async function generateHiRezAPIURL(methodHandle) {
    const timestamp = currentDate();
    const sessionID = await generateSessionID(timestamp);
    const url = `https://api.smitegame.com/smiteapi.svc/${methodHandle}json/${devID}/${generateSignature(methodHandle, timestamp)}/${sessionID}/${timestamp}/1`;
    return (url);
}

async function updateGodAssets() {
    const fetchResponse = await fetch(await generateHiRezAPIURL('getgods'));
    try {
        const JSONresponse = await fetchResponse.json();
        for (const godJSON in JSONresponse) {
            fs.writeFileSync (`assets/gods/${godJSON}.json`, JSON.stringify (JSONresponse[godJSON], null, 4), 'utf8');
        }
    }
    catch (error) {
        console.log('Error generating session ID', error);
    }
}

function updateGodsList() {
    const JSONS = fs.readdirSync(__dirname + '/gods').filter(file => path.extname(file) === '.json');
    JSONS.forEach (file => {
        const JSONData = fs.readFileSync(path.join(__dirname + '/gods', file));
        const godJSON = JSON.parse(JSONData.toString());
        const godName = godJSON.Name;
        const godID = godJSON.id;
        godsList[`${godName}`] = godID;
    });
}

async function updateGodSkins() {
    var adjustedURL = await generateHiRezAPIURL('getgodskins');
    adjustedURL = adjustedURL.slice(0, -1);
    for (const god in godsList) {
        const fetchResponse = await fetch(adjustedURL + `${godsList[god]}/1`);
        try {
            const JSONresponse = await fetchResponse.json();
            for (const godJSON in JSONresponse) {
                const filePath = `assets/skins/${god}`;
                fs.mkdirSync (filePath, {recursive: true});
                fs.writeFileSync (filePath + `/${godJSON}.json`, JSON.stringify (JSONresponse[godJSON], null, 4), 'utf8');
            }
        }
        catch (error) {
            console.log('Error generating session ID', error);
        }
    }
}

async function updateItemAssets() {
    const fetchResponse = await fetch(await generateHiRezAPIURL('getitems'));
    try {
        const JSONresponse = await fetchResponse.json();
        for (const itemJSON in JSONresponse) {
            fs.writeFileSync (`assets/items/${itemJSON}.json`, JSON.stringify (JSONresponse[itemJSON], null, 4), 'utf8');
        }
    }
    catch (error) {
        console.log('Error generating session ID', error);
    }
}

var hunterItems = [];
var mageItems = [];
var guardianItems = [];
var warriorItems = [];
var assassinItems = [];
var ratItems = [];

let matches = [];

// redo this in a future patch
const patches = {
    '10.6' : {
        'patch' : '10.6',
        'start' : '20230613',
        'end' : '20230627', // 10,00
    },
    '10.6bb' : {
        'patch' : '10.6bb',
        'start' : '20230627',
        'end' : '0',
    },
};

async function updateStats() {
    const apiURL = (await generateHiRezAPIURL('getmatchidsbyqueue')).slice(0, -1);
    for (const patch in patches) {
        const startDate = patches[patch]['start'];
        const endDate = patches[patch]['end'];
        console.log(startDate.substr(0, 4));
        console.log(startDate.substr(4, 2));
        console.log(startDate.substr(6));
        matches = [];
        let counter = 0;
        for (let loopDate = new Date(parseInt(startDate.substr(0, 4)), parseInt(startDate.substr(4, 2)) - 1, parseInt(startDate.substr(6))); loopDate <= (endDate === '0' ? new Date() : new Date(parseInt(endDate.substr(0, 4)), parseInt(endDate.substr(4, 2)) - 1, parseInt(endDate.substr(6)))); loopDate.setDate(loopDate.getDate() + 1)) {
            // console.log(loopDate.toISOString());
            const dateString = loopDate.toISOString();
            const dateParameter = dateString.substr(0, 4) + dateString.substr(5, 2) + dateString.substr(8, 2);
            console.log(`Retrieving details for matches on ${dateParameter}...`);
            for (let hourParameter = 0; hourParameter < 24; hourParameter++) {
                for (let minuteParameter = 0; minuteParameter < 60; minuteParameter += 10) {
                    // Ranked Conquest
                    const fetchResponse = await fetch(`${apiURL}451/${dateParameter}/${String(hourParameter).padStart(2, '0')},${String(minuteParameter).padStart(2, '0')}`);
                    try {
                        const JSONresponse = await fetchResponse.json();
                        for (const itemJSON in JSONresponse) {
                            const matchID = (JSONresponse[itemJSON])['Match'];
                            matches.push(matchID);
                            counter++;
                        }
                    }
                    catch (error) {
                        console.log('Error in getting matchIDs', error);
                    }

                }
            }
        }
        fs.writeFileSync(`assets/matches/rankedConq/${patches[patch]['patch']}.json`, JSON.stringify({'matchIDs' : `${matches}`}, null, 4), 'utf8');
        console.log(`${counter} Ranked Conquest matches saved`);
    }
}


module.exports.updateItemLists = function updateItemLists(classInput) {
    const JSONS = fs.readdirSync(__dirname + '/items').filter(file => path.extname(file) === '.json');
    JSONS.forEach (file => {
        const JSONData = fs.readFileSync(path.join(__dirname + '/items', file));
        const itemJSON = JSON.parse(JSONData.toString());
        if ((itemJSON.ActiveFlag == 'y') && ((itemJSON.ItemTier > 2) || (itemJSON.StartingItem == true))) {
            const restrictions = itemJSON.RestrictedRoles.split(',');
            const menuArray = itemJSON.ItemDescription.Menuitems;
            for (const menuJSON of menuArray) {
                if (menuJSON.Description.toLowerCase() == 'physical power') { // need to check for rat and griff tree
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
        // const godName = godJSON.Name;
        // const godID = godJSON.id;
        // godsList[`${godName}`] = godID;
    });
    // console.log(hunterItems);
    // console.log(mageItems);
    // console.log(guardianItems);
    // console.log(warriorItems);
    // console.log(assassinItems);
    switch (classInput) {
        case 'h' : return hunterItems;
        case 'm' : return mageItems;
        case 'g' : return guardianItems;
        case 'w' : return warriorItems;
        case 'a' : return assassinItems;
        case 'r' : return ratItems;
        default: return Error('unexpected class input');
    }
};

async function updatesplmatches() {
    var adjustedURL = await generateHiRezAPIURL('getesportsproleaguedetails');
    adjustedURL = adjustedURL.slice(0, -2);
    const fetchResponse = await fetch(adjustedURL);
    try {
        const JSONresponse = await fetchResponse.json();
        for (const match in JSONresponse) {
            const filePath = 'assets/spl/matches';
            fs.writeFileSync (filePath + `/${match}.json`, JSON.stringify (JSONresponse[match], null, 4), 'utf8');
        }
    }
    catch (error) {
        console.log('Error generating session ID', error);
    }
}

// updatesplmatches();
// function updateGodsLists
// updateGodAssets();

// updateGodsList();
// console.log(JSON.stringify(godsList, null, 4));

// updateGodSkins();
// updateItemLists();

updateStats();