const fs = require('fs');
const path = require('path');

const updateAssets = require('../../assets/updateAssets.js');

const hunterItems = updateAssets.updateItemLists('h');
for (const item of hunterItems) {
    console.log(item.DeviceName);
}
