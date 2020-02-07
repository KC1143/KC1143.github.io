const db = require('./connection');
 
const activitiesratings = db.get('activitiesratings');
 
function getAll() {
    return activitiesratings.find();
}
 
function create(data) {  
    return activitiesratings.insert(data);    
}

function deleteAll() {  
    return activitiesratings.remove(); 
}
 
module.exports = {
    create,
    getAll,
    deleteAll
};