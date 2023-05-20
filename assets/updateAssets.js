/* eslint-disable no-inline-comments, no-var */
const { devID, authKey } = require('../config.json');
const md5 = require('blueimp-md5');
const fs = require('fs');
const path = require('path');

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
    console.log(url);
    return (url);
}

async function updateGodAssets() {
    const fetchResponse = await fetch(await generateHiRezAPIURL('getgods'));
    try {
        const JSONresponse = await fetchResponse.json();
        for (const godJSON in JSONresponse) {
            fs.writeFileSync (`commands/smite_technical/assets/gods/${godJSON}.json`, JSON.stringify (JSONresponse[godJSON], null, 4), 'utf8');
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

// function updateGodsLists
// updateGodAssets();

updateGodsList();
// console.log(JSON.stringify(godsList, null, 4));

updateGodSkins();