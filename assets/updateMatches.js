const { devID, authKey } = require('../config.json');
const md5 = require('blueimp-md5');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const modes = {
    'arena' : 435,
    'assault' : 445,
    'casualConq' : 426,
    'casualJoust' : 448,
    'duel' : 440,
    'rankedConq' : 451,
    'rankedJoust' :450,
    'slash' : 10189,
};

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

function getRank(tier) {
    switch (tier) {
        case 0 : return 'Unranked';
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 : return 'Bronze';
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 : return 'Silver';
        case 11 :
        case 12 :
        case 13 :
        case 14 :
        case 15 : return 'Gold';
        case 16 :
        case 17 :
        case 18 :
        case 19 :
        case 20 : return 'Platinum';
        case 21 :
        case 22 :
        case 23 :
        case 24 :
        case 25 : return 'Diamond';
        case 26 : return 'Master';
        case 27 : return 'Grandmaster';
        default : return 'Unranked';
    }
}


let matches = [];
const assetDataJSON = fs.readFileSync(path.join(__dirname, 'assetData.json'));
const assetData = JSON.parse(assetDataJSON.toString());
const { lastupdate } = assetData;


async function updateMatches() {
    const timestamp = currentDate();
    const sessionID = await generateSessionID(timestamp);
    const patchURL = `https://api.smitegame.com/smiteapi.svc/getpatchinfojson/${devID}/${generateSignature('getpatchinfo', timestamp)}/${sessionID}/${timestamp}`;
    const patchResponse = await fetch(patchURL);
    const patchJSON = await patchResponse.json();
    console.log(patchJSON['version_string']);
    const db = new sqlite3.Database(path.join(__dirname, `matches/${patchJSON['version_string']}.db`), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected');
    });
    db.toString();

    const apiURL = `https://api.smitegame.com/smiteapi.svc/getmatchidsbyqueuejson/${devID}/${generateSignature('getmatchidsbyqueue', timestamp)}/${sessionID}/${timestamp}/`;
    const matchesURL = `https://api.smitegame.com/smiteapi.svc/getmatchdetailsbatchjson/${devID}/${generateSignature('getmatchdetailsbatch', timestamp)}/${sessionID}/${timestamp}/`;

    const lastDate = lastupdate['date'];
    let counter = 0;
    for (let loopDate = new Date(lastDate); loopDate <= new Date(); loopDate.setMinutes(loopDate.getMinutes() + 10)) {
        const dateString = loopDate.toISOString();
        console.log(dateString);
        const dateParameter = dateString.substr(0, 4) + dateString.substr(5, 2) + dateString.substr(8, 2);
        const hourParameter = dateString.substr(11, 2);
        const minuteParameter = dateString.substr(14, 2);
        console.log(`Retrieving details for matches on ${dateString}...`);
        // Ranked Conquest
        for (const mode in modes) {
            const fetchResponse = await fetch(`${apiURL}${modes[mode]}/${dateParameter}/${String(hourParameter).padStart(2, '0')},${String(minuteParameter).padStart(2, '0')}`);
            matches = [];
            try {
                const JSONresponse = await fetchResponse.json();
                for (const matchesJSON in JSONresponse) {
                    const matchID = (JSONresponse[matchesJSON])['Match'];
                    matches.push(matchID);
                    counter++;
                }
            }
            catch (error) {
                console.log('Error in getting matchIDs', error);
            }

            try {
                let adjustedMatchesURL = matchesURL;
                for (let i = 0; i < matches.length(); i += 10) {
                    for (let j = 0; j < 10; j++) {
                        if (i + j < matches.length()) {
                            adjustedMatchesURL += `${matches[i + j]},`;
                        }
                        else {
                            break;
                        }
                    }
                    adjustedMatchesURL = matchesURL.slice(0, -1);
                    const matchDetailsResponse = await fetch(adjustedMatchesURL);
                    const matchJSONResponse = await matchDetailsResponse.json();
                    const completedMatches = [];
                    for (const matchJSON in matchJSONResponse) {
                        const damageDone = matchJSON['Damage_Done_Magical'] ? matchJSON['Damage_Done_Magical'] : matchJSON['Damage_Done_Physical'];
                        const damageMiti = matchJSON['Damage_Mitigated'];
                        const damageStruct = matchJSON['Structure_Damage'];
                        const deaths = matchJSON['Deaths'];
                        const healing = matchJSON['Healing'];
                        const kills = matchJSON['Kills_Player'];
                        const assists = matchJSON['Assists'];
                        const god = matchJSON['Reference_Name'];
                        const region = matchJSON['Region'];
                        const winner = matchJSON['Win_Status'] === 'Winner' ? 1 : 0;
                        const conqrank = getRank(matchJSON['Conquest_Tier']);
                        const duelrank = getRank(matchJSON['Duel_Tier']);
                        const joustrank = getRank(matchJSON['Joust_Tier']);
                        if (completedMatches.includes(matchJSON['Match'])) {
                            continue;
                        }
                        else {
                            const bans = [matchJSON['Ban1'], matchJSON['Ban2'], matchJSON['Ban3'], matchJSON['Ban4'], matchJSON['Ban5'], matchJSON['Ban6'], matchJSON['Ban7'], matchJSON['Ban8'], matchJSON['Ban9'], matchJSON['Ban10']];
                            completedMatches.push(matchJSON['Match']);
                        }

                        // push stuff into db here
                    }
                }
            }
            catch (error) {
                console.log('Error in getting batch match details', error);
            }
            console.log(`${counter} ${mode} matches saved`);
        }
    }
}


updateMatches();