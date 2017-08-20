
require('dotenv').config();
var git = require('simple-git')(process.env.PROJECT_DOWNLOAD_DIRECTORY);
var fs = require('fs');
var cmd=require('node-cmd');

let read_and_sync_projects = () => {
    let resources = JSON.parse(process.env.RESOURCES);
    console.log(resources);
};


 //Check if workspace directory exists
if (fs.existsSync(process.env.HUE_WORKSPACE)){
    console.log("Workspace directory exists - [process.env.HUE_WORKSPACE]");
}else {
    console.log("workspace directory does not exist. Creating new directory.. [process.env.HUE_WORKSPACE]");
    cmd.run('mkdir -p ' + process.env.HUE_WORKSPACE);
}

var git = require('simple-git')( process.env.HUE_WORKSPACE );

read_and_sync_projects();







//
////Clone and update branches of necessary repos
//console.log(process.env.RESOURCES);
//console.log(JSON.parse(process.env.RESOURCES));






