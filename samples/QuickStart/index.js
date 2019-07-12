const
    SpiderKhan = require("../../src/SpiderKhan"),
    Path = require("path");

class App {

    constructor(){


        this._spider = new SpiderKhan({
            port: "8089",
            rootPath : "/service",
            defaultResponseHeaders : {

            }
        });


        this._spider.addMiddleware(
            async ({request,response,body,urlData}) => {

        });

    }

}


new App();