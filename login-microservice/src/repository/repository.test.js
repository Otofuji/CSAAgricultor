const test = require('tape');
const repository = require('./repository');
function runTests(){
    var id = null;
    test('Repository findAll', (t) => {
        repository.findAll((err, users) => {
            if(users && users.length > 0) id = users[0]._id;
            
            t.assert(!err && users && users.length > 0, "All Movies Returned");
            t.end();
        });
    })

    /*
    
    test('Repository findById', (t) => {
        if(!id) {
            t.assert(false, "Movie by Id Returned");
            t.end();
            return;
        }
        User.findById(id, (err, movie) => {
            t.assert(!err && movie, "Movie by Id Returned");
            t.end();
        });
    })

    */
    
    test('Repository Disconnect', (t) => {
        t.assert(User.disconnect(), "Disconnect Ok");
        t.end();
    })
}
module.exports = { runTests }