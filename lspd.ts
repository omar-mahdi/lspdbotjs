import puppeteer from 'puppeteer';

const getProfileInfo = async(id: number): Promise<any> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://lssd.gta.world/memberlist.php?mode=viewprofile&u=${id}`, {"waitUntil" : "networkidle0"});
    const profileRequest = await page.evaluate(() => document.querySelector('*')!.outerHTML);
    
    await browser.close();
    const discordTagRegex = profileRequest.match(/<dt>Discord ID:<\/dt> <dd>(.+)<\/dd>/g)![0].match(/d>.+\#\d+/);
    const discordTag = discordTagRegex![0].substr(discordTagRegex![0].indexOf('d>') + 2);
    if (discordTag) {
        return {tag: discordTag, data: profileRequest};
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