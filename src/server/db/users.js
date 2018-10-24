/*
    Simulating database as seen in class PG6300 with in-memory map.
*/

const users = new Map();

function createUser(id, password) {
    if(getUser(id) !== undefined ){
        return false;
    }

    const user = {
        id: id,
        password: password
    };

    users.set(id, user);
    return true;
}


function getUser(id){

    return users.get(id);
}


function verifyUser(id, password){

    const user = getUser(id);

    if(user === undefined){
        return false;
    }

    return user.password === password;
}

module.exports = {getUser, verifyUser, createUser};