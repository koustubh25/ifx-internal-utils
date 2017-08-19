require('dotenv').config();
const cassandra_driver = require('cassandra-driver');

class cassandra  {

    constructor (end_points, keyspace){
        console.log(end_points);
        this.end_points = end_points;
        this.keyspace = keyspace;
    }

    checkConnection(callback) {

        const client = new cassandra_driver.Client({
            contactPoints:  this.end_points ,
            keyspace: this.keyspace
        });

        return client._connectCb(function(err){
            callback(typeof err == 'undefined');
        });

    }
};

module.exports =  cassandra;