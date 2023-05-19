const { devID, authKey } = require('./config.json');
const md5 = require('blueimp-md5');
// eslint-disable-next-line no-inline-comments, no-var
var resp; // couldn't get around using this for whatever reason (Promises annoyed me to the point where this was my fix)

function currentDate() {
    const timestamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    return (timestamp);
}

function generateSignature(methodHandle, timestamp) {
    const signatureString = devID + methodHandle + authKey + timestamp;
    const signature = md5(signatureString);
    return (signature.toString());
}

function generateSessionID(timestamp) {
    const url = 'https://api.smitegame.com/smiteapi.svc/createsessionjson/' + devID + '/' + generateSignature('createsession', timestamp) + '/' + timestamp;
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw Error('HTTPS error');
        }
        return response.json();
    })
    .then(responseAsJson => {
        resp = responseAsJson.session_id;
        return resp; // why is this returning undefined????
    })
    .catch(error => {
        console.log('Error generating session ID', error);
    });
}


function generateHiRezAPIURL(methodHandle) {
    const timestamp = currentDate();
    const sessionID = generateSessionID(timestamp);
    console.log(resp);
    const url = 'https://api.smitegame.com/smiteapi.svc/' + methodHandle + 'json/' + devID + '/' + generateSignature(methodHandle, timestamp) + '/' + sessionID + '/' + timestamp + '/1';
    return (url);
}

console.log(generateHiRezAPIURL('getgods'));