const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://localhost:27017/polyglot_ninja";


module.exports = function (app) {
    MongoClient.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((connection) => {
            const db = connection.db('database')
            app.people = db.collection("people");
            console.log("Database connection established")
        })
        .catch((err) => console.error(err))

};