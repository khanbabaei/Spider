const
    SpiderKhan = require("../../src/SpiderKhan");

class App {

    constructor(){


        this._spider = new SpiderKhan({
            port: "8089",
            rootPath : "/service",
            defaultResponseHeaders : {
                "my-header" : "33232323"
            }
        });


        this._spider.addMiddleware(
            async ({request,response,body,urlData}) => {

        });

    }

}


new App();