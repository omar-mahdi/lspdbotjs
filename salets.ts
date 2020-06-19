import request from 'request';

const requestLogin = {
    method: 'POST',
    url: 'https://salets.lsgov.us/users/auth',
    jar: true,
    form: {
        username: 'SDSteve',
        password: 'Dakodakos1'
    },
    followAllRedirects: true
}

export function createUser(username: string, first: string, last:string, department: number,
    admin: number, roles: string, active: number): boolean {
        request(requestLogin, (err, res, body) => {
            const requestCreateUser = {
                method: 'POST',
                url: 'https://salets.lsgov.us/users/store',
                jar: true,
                form: {
                    username: username,
                    first_name: first,
                    last_name: last,
                    department: 2,
                    admin: admin,
                    roles: roles,
                    active: active
                },
                followAllRedirects: true
            }
            request(requestCreateUser, (err, res, body) => {
                if(res.statusCode == 400) {
                    const findUser = {
                        url: `https://salets.lsgov.us/users/find?username=${username}`,
                        jar: true
                    }
                    request(findUser, (err, res, body) => {
                        const requestEditUser = {
                            method: 'PATCH',
                            url: `https://salets.lsgov.us/users/${body}`,
                            jar: true,
                            form: {
                                username: username,
                                first_name: first,
                                last_name: last,
                                department: 2,
                                admin: admin,
                                roles: roles,
                                active: active
                            },
                            followAllRedirects: true
                        }
                        request(requestEditUser);
                    })
                    return false;
                } else {
                    console.log('SALETS user created');
                    return true;
                }
            })
        });
    return false;
}

export function retrieveRoles(callback: (body: any) => void) {
    request(requestLogin, (err, res, body) => {
        const requestGetRoles = {
            method: 'GET',
            url: 'https://salets.lsgov.us/steve/roles',
            jar: true,
        }

        request(requestGetRoles, (err, res, body) => {
            try {
                JSON.parse(body);
            } catch {
                return callback(false);
            }

            return callback(JSON.parse(body));
        })
    });
}