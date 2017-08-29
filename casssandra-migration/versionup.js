//Check cassandra connection

let cass = require('./cassandra');
var config = require('./../config');
let cassandra_bt = new cass([ process.env.CASSANDRA_BT_IP ], process.env.CASSANDRA_BT_KEYSPACE);
var cmd=require('node-cmd');


let cassandra_client = cassandra_bt.getClient();

cassandra_client.connect().then(() => {
        console.log('Connected to cluster with %d host(s): %j', cassandra_client.hosts.length, cassandra_client.hosts.keys());
        console.log('Keyspaces: %j', Object.keys(cassandra_client.metadata.keyspaces));

        execute_cqls((callback) => {
            console.log("=========Finished executing cqls==========");
            // execute_migration(() => {
            //
            // });
        });
        return cassandra_client.shutdown();

    })
    .catch((err) => {
        console.error('There was an error when connecting', err);
        return cassandra_client.shutdown();

    });

let execute_cqls = (callback) => {
    find_versionup_cqls(function(cqls){
        console.log(cqls);
        console.log(cqls.length);
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
                        console.log("cnt is "+ cnt);
                        if(!err) {
                            console.log("Executed " + cql);
                            if(cnt++ == cqls.length) {
                                console.log("cnt is " + cnt);
                                console.log("still works");
                                callback();
                            }
                        }
                        else {
                            // console.log(stderr);
                            console.log(err);
                        }

                        // }

                    });
            });
        }

    });
};


let find_versionup_cqls = (callback) => {

 console.log("inside");
    find_files(".CQL", (data) => {
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
                case ".CQL":return resource.name + "\\" + resource.cqldir;
                    break;

                case ".jar": return "resources";
                    break;

                default:return resource.cqldir
            }
        })();

        let cnt = 0;

        var finder = new FindFiles({
            rootFolder : process.env.HUE_WORKSPACE + "\\" + searchDir,
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


let find_versionup_jars = (callback) => {

    find_files(".jar", (data) => {
        callback(data);
    });
};




let execute_migration = (callback) => {

    // resources.forEach((resource) => {
    //     if(!resource.versionup)
    //         return;
    //    let project_name = resource.name;
    //     cmd.get(
    //         "cd " + process.env.HUE_WORKSPACE + "\\company-config-files  && " +
    //         "java -jar \""+ process.env.MIGRATION_RUNNER_JAR + "\" -migrate -to v2.0.0 -projectName " + resource.name +  "-baseJars "
    //         ,
    //         function(err, data, stderr){
    //             console.log(data);
    //             if(!err) {
    //                 console.log("Executed " + resource.name + " successfully.");
    //             }
    //             else {
    //                 // console.log(stderr);
    //                 console.log(err);
    //             }
    //             // if(++cnt == cqls.length)
    //             //     callback();
    //             // // }
    //
    //         });
    //
    // });


};











