import request from 'request';

export function retrieveRoles(callback: (body: any) => void) {
    const requestGetRoles = {
        method: 'GET',
        url: 'https://api.npoint.io/7761132271bc3f3edf2d',
    }

    request(requestGetRoles, (err, res, body) => {
        try {
            JSON.parse(body);
        } catch {
            return callback(false);
        }

        return callback(JSON.parse(body));
    });
}