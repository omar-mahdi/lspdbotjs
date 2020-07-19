import * as Discord from 'discord.js';
import { verifyProfile } from './lspd';
import { createUser, retrieveRoles, resetPw } from './salets';

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
                    msg.reply('SALETS issue, please contact a Staff Officer.')
                    return false;
                }

                let roles: Array<any> = saletsData;
                let admin = 0;
                let saletsRoles: Array<String> = [];
                // Remove all roles

                verification.groups.forEach((group: string) => {
                    // Get the role's discord name from the master roles list
                    const discordName = roles.find(role => role.forumName == group)?.discordName;
                    // Finds the role object based on the previously fetched name
                    const role = msg.guild?.roles.cache.find(role => role.name == discordName);
                    if (role?.name == 'Supervisors') {
                        admin = 1;
                    } else if (role?.name == 'Detectives') {
                        admin = 2;
                        saletsRoles.push('detective');
                    } else if (role?.name == 'Command Officers') {
                        admin = 4;
                        saletsRoles.push('admin');
                        saletsRoles.push('judge');
                        saletsRoles.push('detective');
                    } else if (role?.name == 'GSS') {
                        saletsRoles.push('gangs');
                    } else if (role?.name == 'MES') {
                        saletsRoles.push('gangs');
                    } else if (role?.name == 'GSS CMD') {
                        saletsRoles.push('gangs-admin');
                    } else if (role?.name == 'MES CMD') {
                        saletsRoles.push('gangs-admin');
                    } else if (role?.name == 'A-PLTN') {
                        saletsRoles.push('gangs');
                    } else if (role?.name == 'D-PLTN') {
                        saletsRoles.push('gangs');
                    }
                    // Adds the role
                    if (role) msg.member?.roles.add(role);
                });

                const salets = createUser(args[0], verification.username[0], verification.username[1], 1, admin, saletsRoles.join(','), 1);

                if (salets) {
                    msg.reply(`verification successful. SALETS account created under ID ${args[0]}. Please change your password.`)
                } else {
                    msg.reply(`verification successful. SALETS account updated.`);
                }

                return true;
            });
        } else {
            msg.reply('verification unsuccessful!');
        }
    }

    if (command == 'reset') {
        const verification = await verifyProfile(Number(args[0]), msg.author.tag);
        if (verification != false) {
            retrieveRoles(saletsData => {

                if (saletsData == false) {
                    msg.reply('SALETS issue, please contact a Staff Officer.')
                    return false;
                }

                resetPw(args[0]);      
                msg.reply('verification successful. SALETS password reset.');

                return true;
            });
        } else {
            msg.reply('verification unsuccessful!');
        }
    }
});

client.login('NTAyMTA3MTk3NDU5OTIyOTQ0.XuexbA.IdsnOzNSoclUMfa13RB_Y4dZJig');
