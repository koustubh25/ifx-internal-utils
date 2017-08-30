//Check cassandra connection

let cass = require('./cassandra');
var config = require('./../config');
let cassandra_bt = new cass([ process.env.CASSANDRA_BT_HOST ], process.env.CASSANDRA_BT_KEYSPACE);
var cmd=require('node-cmd');
var Promise = require("bluebird");
const fs = require('fs-extra');

let cassandra_client = cassandra_bt.getClient();
let resource_versionup_enabled_count = config.resources.filter((resource) => resource.versionup === true).length;

cassandra_client.connect().then(() => {
        console.log('Connected to cluster with %d host(s): %j', cassandra_client.hosts.length, cassandra_client.hosts.keys());
        console.log('Keyspaces: %j', Object.keys(cassandra_client.metadata.keyspaces));

        execute_cqls((callback) => {
            console.log("Now starting migration...");
            execute_migration((callback) => {
                console.log("finished migration");
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

        const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
        let cql_count = 0; //count to make callbacks

        console.log("Collected the following CQLs ");
        console.log(cqls);
        console.log("Executing now...");

        if (cqls && cqls.length){

            //Execute cqls
            cqls.map((cql) => {
                getAsync("cd " + process.env.HUE_WORKSPACE + "/company-config-files  && " +
                    "cp -fr " + cql + " . && " +
                    "java -jar ../resources/migrator-java-runner-" + process.env.MIGRATOR_JAVA_RUNNER_VERSION +  "-bin.jar -cqlexecutor -timeOut 1000 -cqlSources " + cql.split('/').pop().trim() + " -skipError -nT 20")
                    .then(data => {
                    console.log(data);

                    if(++cql_count == cqls.length) {
                        console.log("\n ==========Finished execution of CQL statements. Please check the above logs and verify that the new columns/column families are created in " + process.env.CASSANDRA_BT_HOST + "==========");
                        callback();
                    }
                }).catch(err => {
                    console.log('Error occurred during executing of CQL queries \n', err);
                });
            });
        }

    });
};


let find_versionup_cqls = (callback) => {

    let resource_cnt = 0;
    find_files(".CQL", (data) => {
     if(++resource_cnt === resource_versionup_enabled_count)
     callback(data);
    });
};

let find_files = (type, callback) => {
    let resources = config.resources;
    let FindFiles = require("node-find-files");
    let files = [];

    resources.forEach((resource) => {
        if(!resource.versionup)
            return;

        let searchDir = (() => {
            switch(type){
                case ".CQL":return resource.name + "/" + resource.cqldir;
                    break;

                case ".jar": return "resources";
                    break;

                default:return resource.cqldir
            }
        })();

        var finder = new FindFiles({
            rootFolder : process.env.HUE_WORKSPACE + "/" + searchDir,
            filterFunction : function (path, stat) {
                return path.indexOf(type) > -1;
            }
        });
        finder.on("match", function(strPath, stat) {
            files.push(strPath);
        })
            .on("complete", function() {
                console.log("Finished Searching for" + type + " files inside " + searchDir + " folder");
                    callback(files);
            }).on("patherror", function(err, strPath) {
            console.log("Error for Path " + strPath + " " + err);
        }).on("error", function(err) {
            console.log("Global Error " + err);
        });
        finder.startSearch();
    });

};


let execute_migration = (callback) => {

        const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })
        let resources = config.resources;
        let resource_count = 0;
        resources.forEach((resource) => {
            if(!resource.versionup)
                return;

            getAsync("cd " + process.env.HUE_WORKSPACE + "/company-config-files  && " +
                "java -jar ../resources/migrator-java-runner-" + process.env.MIGRATOR_JAVA_RUNNER_VERSION +  "-bin.jar -migrate -to " + process.env.CASSANDRA_MIGRATE_VERSION + " -projectName " + resource.name + " -baseJars ../resources/*.jar &&" +
                "echo[ && echo \" Now performing json import \" && echo[ && " +
                "java -jar ../resources/migrator-java-runner-" + process.env.MIGRATOR_JAVA_RUNNER_VERSION +  "-bin.jar -import -projectName " + resource.name + " -baseJars + ../resources/*.jar"
            )
                .then(data => {
                    console.log(data);

                    if (++resource_count == resource_versionup_enabled_count) {
                        console.log("\n ========== Finished migration. Please check and confirm that the db is migrated to the correct version ==========");
                        callback();
                    }
                }).catch(err => {
                console.log('Error occurred during migration \n', err);
            });
        });

};











