

//Check cassandra connection
let cass = require('./cassandra');
let cassandra_bt = new cass([ process.env.CASSANDRA_BT_IP ], process.env.CASSANDRA_BT_KEYSPACE);

let cassandra_client = cassandra_bt.getClient();

cassandra_client.connect().then(() => {
        console.log('Connected to cluster with %d host(s): %j', cassandra_client.hosts.length, cassandra_client.hosts.keys());
        console.log('Keyspaces: %j', Object.keys(cassandra_client.metadata.keyspaces));
        return cassandra_client.shutdown();

    })
    .catch((err) => {
        console.error('There was an error when connecting', err);
        return cassandra_client.shutdown();

    });


let execute_cqls = (cqls) => {
    console.log(cqls);
};

let find_cqls = (dir) => {
require('../manage-projects/sync_source');

};








