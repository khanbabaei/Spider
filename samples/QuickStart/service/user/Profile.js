const
    Service = require("../../../../src/prototype/Service");


class Profile extends Service{

    async onPost(req,res){

    }

}


Profile.SpiderKhan = {
    url: "/srv/user/profile",
    method : {
        POST : {

        },
        GET : {

        }
    },
    responseHeaders : {

    }
};

module.exports = Profile;