const { REST, Routes } = require('discord.js');
const { clientID, token, camelotGuildID, rbbGuildID } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const personal_commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			if (folder == 'personal') {
				personal_commands.push(command.data.toJSON());
				continue;
			}
			commands.push(command.data.toJSON());
		}
        else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientID),
			{ body: commands },
		);

		const personal_data = await rest.put(
			Routes.applicationGuildCommands(clientID, camelotGuildID),
			{ body: personal_commands },
		);
		const personal_data2 = await rest.put(
			Routes.applicationGuildCommands(clientID, rbbGuildID),
			{ body: personal_commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		console.log(`Added ${personal_data.length} application (/) commands in Camelot.`);
		console.log(`Added ${personal_data2.length} application (/) commands in RBB.`);
	}
    catch (error) {
		console.error(error);
	}
})();
