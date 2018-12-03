var mongoClient = require("mongodb").MongoClient;
mongoclient.connect("mongodb://localhost/workshoptdc")
	.then(conn => global.conn = conn.db("workshoptdc"))
	.catch(err => console.log(err))


function findAll(callback){
	global.conn.collection("customers").find({}).toArray(callback);
}

function insert(customer,callback){
	global.conn.collection("customers").insert(customer,callback);
}

var ObjectId = require("mongodb").ObjectId;
function findOne(id,callback){
	global.conn.collection("customer").find(new ObjectId(id)).toArray(callback);

}

function update(id,customer,callback){
	global.conn.collection("customers").updateOne({_id:new ObjectId(id)},customer,callback);
}

module.exports={findAll, insert, findOne, update}
