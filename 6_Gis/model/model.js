var db = require("seraph")({
    server: "http://localhost:7474",
    user: "neo4j",
    pass: "root"
});

exports.newGeoData = function(data, callback){
	db.save(data, callback);	
}

exports.query = function(query, callback){
	db.find(query, callback);
}