const { devID, authKey } = require('../config.json');
const md5 = require('blueimp-md5');
const fs = require('fs');
const path = require('path');

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


let matches = [];
const assetDataJSON = fs.readFileSync(path.join(__dirname + '/patches', 'assetData.json'));
const assetData = JSON.parse(assetDataJSON.toString());
const patches = assetData.patches;

async function updateStats() {
    const timestamp = currentDate();
    const sessionID = await generateSessionID(timestamp);
    const apiURL = `https://api.smitegame.com/smiteapi.svc/getgodsjson/${devID}/${generateSignature('getmatchidsbyqueue', timestamp)}/${sessionID}/${timestamp}/`;
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