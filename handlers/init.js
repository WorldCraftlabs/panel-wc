const { db } = require('../handlers/db.js');
const config = require('../config.json');
const { v4: uuidv4 } = require('uuid');
const log = new (require('cat-loggr'))();

async function init() {
    const WorldCraft = await db.get('WorldCraft_instance');
    if (!WorldCraft) {
        log.init('This is probably your first time starting WorldCraft, welcome!');
        log.init('You can find documentation for the panel at WorldCraft.dev');

        const errorMessages = [];

        let imageCheck = await db.get('images');
        let userCheck = await db.get('users');

        if (!imageCheck) {
            errorMessages.push("Before starting WorldCraft for the first time, you didn't run the seed command!");
            errorMessages.push("Please run: npm run seed");
        }
        
        if (!userCheck) {
            errorMessages.push("If you didn't do it already, make a user for yourself: npm run createUser");
        }

        if (errorMessages.length > 0) {
            errorMessages.forEach(errorMsg => log.error(errorMsg));
            process.exit(); 
        }


        const WorldCraftId = uuidv4();
        const setupTime = Date.now();
        
        const info = {
            WorldCraftId: WorldCraftId,
            setupTime: setupTime,
            originalVersion: config.version
        };

        await db.set('WorldCraft_instance', info);
        log.info('Initialized WorldCraft panel with ID: ' + WorldCraftId);
    }
    log.info('Init complete!');
}

module.exports = { init };