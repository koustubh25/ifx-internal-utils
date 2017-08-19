require('dotenv').config();
var git = require('simple-git')(process.env.PROJECT_DOWNLOAD_DIRECTORY);
var fs = require('fs');
var cmd=require('node-cmd');


// Check if workspace directory exists
console.log(process.env.HUE_WORKSPACE);

if (fs.existsSync(process.env.HUE_WORKSPACE)){
    console.log("directory exists");

}else {
    console.log("workspace directory does not exist.. Create new directory");
    cmd.run('mkdir -p ' + process.env.HUE_WORKSPACE);
}

//Clone and update branches of necessary repos
console.log(process.env.RESOURCES);
console.log(JSON.parse(process.env.RESOURCES));





