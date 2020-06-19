import axios from 'axios';

const getProfileInfo = async(id: number): Promise<any> => {
    const testRequest = await axios.get(`https://sd.lsgov.us/forum/memberlist.php?mode=viewprofile&u=${id}`);
    const discordTag = testRequest.data.match(/\w+\#+\d+/g);
    const usernameRegex = testRequest.data.match(/(\w+)_(\w+)<\/span>/gm);
    let usernameArray: Array<string> = [];
    
    if (usernameRegex) {
        usernameArray = usernameRegex[0].split('_');
        usernameArray[1] = usernameArray[1].replace(/<.+/g, '')
    }

    if (discordTag && usernameRegex) {
        return {tag: discordTag[0], data: testRequest.data, username: usernameArray};
    } else {
        return false;
    }
};

const getUsergroups = (data: string): Array<string> | null => {
    const usergroups = data.match(/<option value="\d+">(.+?)</g);
    const activeGroup = data.match(/<option value="\d+" selected="selected">(.+?)</g)
    const groupArray: any = [];

    if (usergroups && activeGroup) {
        usergroups.forEach(usergroup => {
            groupArray.push(usergroup.substr(usergroup.indexOf('>') + 1).slice(0, -1));
        });

        groupArray.push(activeGroup[0].substr(activeGroup[0].indexOf('>') + 1).slice(0, -1))

        if (groupArray) {
            return groupArray;
        }
    }

    return null;
};

export const verifyProfile = async(id: number, discordTag: string): Promise<any> => {
    const profileInfo = await getProfileInfo(id);
    
    if (profileInfo.tag === discordTag) {
        const returnObject = {
            groups: getUsergroups(profileInfo.data),
            username: profileInfo.username
        }
        return returnObject;
    } else {
        return false;
    }
}