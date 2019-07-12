const
    Service = require("../../../src/prototype/Service");


class Profile extends Service{

    async onRequest(req,res){

        return  {
            body : "<h1>request not found</h1>",
            headers : "text/html",
            statusCode : 404
        }

    }

}


Profile.SpiderKhan = {
    url: "*",
    method : {},
    responseHeaders : {

    },
    defaultRout : true
};

module.exports = Profile;