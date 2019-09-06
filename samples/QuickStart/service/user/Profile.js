const
    Service = require("../../../../src/prototype/Service");



class Profile extends Service{

    async onPost(req,res){

        return  {
            body : "{TEST : 22222222222}",
            headers : "application/json",
            statusCode : 405
        }
    }

}


Profile.SpiderKhan = {
    url: "/srv/user/profile",
    method : {
        POST : {

        }
    },
    responseHeaders : {

    }
};

module.exports = Profile;