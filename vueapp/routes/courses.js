const db = require('./connection');
 
const courses = db.get('courses');
 
function getAll() {
    return courses.find();
}
 
function create(data) {  
    return courses.insert(data);    
}

function deleteAll() {  
    return courses.remove(); 
}
 
module.exports = {
    create,
    getAll,
    deleteAll
};