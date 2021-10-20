import * as Discord from 'discord.js';
import { verifyProfile, findRole } from './lspd';
import { retrieveRoles } from './salets';

const client = new Discord.Client();
const prefix = '$';

client.on('ready', async () => {
    client.user?.setActivity('End my suffering'); 
});

client.on('message', async (msg: Discord.Message): Promise<void> => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command == 'verify') {
        const verification = await verifyProfile(Number(args[0]), msg.author.tag);
        if (verification != false) {
            await msg.member?.roles.set([]);
            retrieveRoles(saletsData => {

                if (saletsData == false) {
                    msg.reply('Roles issue, please contact an ES member.')
                    return false;
                }

                // If user has no groups
                if (verification.groups == null) return null;

                let roles: Array<any> = saletsData.roles;

                verification.groups.forEach((group: string) => {
                    // Get the role's discord name from the master roles list
                    const discordNames = findRole(roles, group);
                    console.log(discordNames);
                    // const discordName = roles.find(role => role.forumName == group)?.discordName;

                    // Finds the role object based on the previously fetched name
                    discordNames.forEach(discordName => {
                        const role = msg.guild?.roles.cache.find(role => role.name == discordName.discordName);
                        if (role) {
                            msg.member?.roles.add(role);
                            console.log(`Added role ${role.name} to Discord user: ${msg.member?.user.tag} Forum ID: ${Number(args[0])}`);
                            }
                    });
                    
                    // Adds the role

                });

                msg.reply(`verification successful.`);

                return true;
            });
        } else {
            console.log(`Verification failed for Discord user: ${msg.member?.user.tag} Forum ID: ${Number(args[0])}`);
            msg.reply('verification unsuccessful. Ensure your Discord ID is set on your forum profile.');
        }
    }
});

client.login('ODk2NDM4NTczMzE2ODMzMzcz.YWHHeg.6N0-QWPQ3jQKx72PrR4u66Dtt2M');
