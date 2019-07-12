const
    HttpHandler = require("./network/HttpHandler"),
    ApiHandler = require("./service/ApiHandler");

class SpiderKhan{

    constructor({}){

        this._port = options.port;
        this._rootPath = options.rootPath;
        this._defaultResponseHeaders = options.defaultResponseHeaders;


        this._httpHandler = new HttpHandler({
            port: this._port
        });

        this._apiHandler = new ApiHandler({
            rootPath: this._rootPath,
            defaultResponseHeaders: this._defaultResponseHeaders,
        });


        this._httpHandler.on("request", this._apiHandler.onRequest);
    }


    addMiddleware(middleware){
        this._apiHandler.addMiddleware(middleware);
    }


}


module.exports = SpiderKhan;

