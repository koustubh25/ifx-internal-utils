var config = {};

config.resources = [{
        "name":"hue-com-ifx",
        "repo_link":"some link",
        "branch":"master",
        "versionup":true,
        "cqldir": "hue-com-ifx-cql",
        "versionupdir": "hue-com-ifx-version-up"
    },{
    "name":"hue-com-outputengine",
    "repo_link":"some link",
    "branch":"develop",
    "versionup":true,
    "cqldir": "hue-com-outputengine-cql",
    "versionupdir": "hue-com-outputengine-version-up"

},{
    "name":"hue-com-inputengine",
    "repo_link":"some link",
    "branch":"master",
    "versionup":true,
    "cqldir": "hue-com-inputengine-cql",
    "versionupdir": "hue-com-inputengine-version-up"
},{
    "name":"hue-com-transformer",
    "repo_link":"some link",
    "branch":"master",
    "versionup":true,
    "cqldir": "hue-com-transformer-cql",
    "versionupdir": "hue-com-transformer-version-up"

},
    {
        "name":"hue-com-ifx-dtos",
        "repo_link":"some link",
        "branch":"master",
        "versionup":true,
        "cqldir": "hue-com-ifx-dtos-cql",
        "versionupdir": "hue-com-transformer-version-up"

    }];

module.exports = config;