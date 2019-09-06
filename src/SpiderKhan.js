const
    HttpHandler = require("./network/HttpHandler"),
    ApiHandler = require("./service/APIHandler"),
    FS = require("fs");

class SpiderKhan{

    constructor(options){

        this._port = options.port;
        this._rootPath = options.rootPath;
        this._defaultResponseHeaders = options.defaultResponseHeaders;
        this._uploadDir = options.uploadDir;


        if (!this._uploadDir) {
            this._uploadDir = process.cwd() + "/tmp";
        }

        if (!FS.existsSync(this._uploadDir)){
            FS.mkdirSync(this._uploadDir);
        }

        this._httpHandler = new HttpHandler({
            port: this._port
        });

        this._apiHandler = new ApiHandler({
            rootPath: this._rootPath,
            defaultResponseHeaders: this._defaultResponseHeaders,
        });


        this._httpHandler.on("request", (req,res)=>{
            this._apiHandler.onRequest(req, res);
        });
    }


    addMiddleware(middleware){
        this._apiHandler.addMiddleware(middleware);
    }


}


module.exports = SpiderKhan;

