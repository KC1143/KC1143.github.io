const db = require('./connection');
 
const users = db.get('users');
 
function getAll() {
    return users.find();
}
 
function create(userdata) {  
    return users.insert(userdata);    
}

function deleteAll() {  
    return users.remove(); 
}
 
module.exports = {
    create,
    getAll,
    deleteAll
};