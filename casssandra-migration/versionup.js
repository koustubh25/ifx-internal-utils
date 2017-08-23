//Check cassandra connection

let cass = require('./cassandra');
var config = require('./../config');
let cassandra_bt = new cass([ process.env.CASSANDRA_BT_IP ], process.env.CASSANDRA_BT_KEYSPACE);
var cmd=require('node-cmd');


let cassandra_client = cassandra_bt.getClient();

cassandra_client.connect().then(() => {
        console.log('Connected to cluster with %d host(s): %j', cassandra_client.hosts.length, cassandra_client.hosts.keys());
        console.log('Keyspaces: %j', Object.keys(cassandra_client.metadata.keyspaces));

        execute_cqls(() => {
            console.log("=========Finished executing cqls==========");
            execute_migration(() => {

            });
        });
        return cassandra_client.shutdown();

    })
    .catch((err) => {
        console.error('There was an error when connecting', err);
        return cassandra_client.shutdown();

    });

let execute_cqls = (callback) => {
    find_versionup_cqls(function(cqls){
        if (cqls && cqls.length){
            let cnt = 0;
            //Execute cqls
            cqls.map((cql) => {

                cmd.get(
                    "cd " + process.env.HUE_WORKSPACE + "\\company-config-files  && " +
                    "cp -fr " + cql + " . && " +
                    "java -jar \""+ process.env.MIGRATION_RUNNER_JAR + "\" -cqlexecutor -timeOut 1000 -cqlSources " + cql.split('\\').pop().trim() + " -skipError -nT 20"
                    ,
                    function(err, data, stderr){
                        console.log(data);
                        if(!err) {
                            console.log("Executed " + cql + " successfully.");
                        }
                        else {
                            // console.log(stderr);
                            console.log(err);
                        }
                        if(++cnt == cqls.length)
                            callback();
                        // }

                    });
            });
        }

    });
};


let find_versionup_cqls = (callback) => {

 require('../manage-projects/sync_source');
 let resources = config.resources;
 let FindFiles = require("node-find-files");
 let cqls = [];
 resources.forEach((resource) => {
     if(!resource.versionup)
         return;
     var finder = new FindFiles({
         rootFolder : process.env.HUE_WORKSPACE + "/" + resource.name + "/" + resource.cqldir,
         filterFunction : function (path, stat) {
             return path.indexOf("CQL") > -1;
         }
     });
     finder.on("match", function(strPath, stat) {
         cqls.push(strPath);
     })
       .on("complete", function() {
         console.log("Finished Searching for Json files inside " + resource.cqldir);
         callback(cqls);
     }).on("patherror", function(err, strPath) {
         console.log("Error for Path " + strPath + " " + err);
     }).on("error", function(err) {
         console.log("Global Error " + err);
     });
     finder.startSearch();
 });

};

let execute_migration = (callback) => {

    let resources = config.resources;
    resources.forEach((resource) => {
       let project_name = resource.name;

    });
    callback();

};


//TODO

let cleanup = () => {

};








