

//Check cassandra connection
let cass = require('./casssandra-migration/cassandra');
let cassandra_bt = new cass([ process.env.CASSANDRA_BT_IP ], process.env.CASSANDRA_BT_KEYSPACE);
cassandra_bt.checkConnection(function(result){
  if(!result)
    console.log('connecion unsccessful');
  else{
    console.log('connection succesful to ' + process.env.CASSANDRA_BT_IP);
    require('./fetch-resources');
  }

});
console.log('ed');
