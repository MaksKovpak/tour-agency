export const USERS_API_KEY = '644acca08e4aa6225e923409';
export const API_KEY = '$2b$10$csdnNhNW0vZdkARx96SvSezMEHI6EbnLcD0aJsOZYN4LVsmb46Goa';


export async function isAdmin(user, criteria = ['email', 'username']) {
    let response = await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let adminData = (await response.json()).record.admin;

    return criteria.every((crt) => user[crt] == adminData[crt]);
}

export async function findUser(record, findBy = ['username', 'email']) {
    let response = await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let usersArray = data.record.users;
    usersArray.push(data.record.admin);

    let isUsersSame = (firstUser, secondUser) => {
        return findBy.every((key) => firstUser[key] == secondUser[key]);
    };

    return usersArray.some((element) => isUsersSame(element, record));
}

export async function getFullInfo(initUser, criteria = ['email', 'password']) {
    let response = await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    let usersData = data.record.users;

    usersData.push(data.record.admin);

    for (const user of usersData) {
        if (criteria.every((crt) => user[crt] == initUser[crt])) 
            return user;
    }

    return null;
}

export async function addNewUser(record) {
    let isRegistered = await findUser(record, ['username', 'email', 'password']);
    if (isRegistered) return;

    let response = await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
    });

    let data = await response.json();
    data.record.users.push(record);

    await fetch(`https://api.jsonbin.io/v3/b/${USERS_API_KEY}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        },
        body: JSON.stringify(data.record)
    });
}

