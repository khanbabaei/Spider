const
    Glob = require("glob"),
    Formidable = require('formidable'),
    Chokidar = require('chokidar'),
    URL = require("url");


class APIHandler{

    constructor(options) {

        this._defaultResponseHeaders = options.defaultResponseHeaders;
        this._services = {};
        this._middlewares = [];
        this._uploadDir = options.uploadDir;

        this._defaultRoutClass = null;

        let dir = process.cwd() + options.rootPath +"/**/*.js";

        Chokidar
            .watch(dir, {
                ignoreInitial: true,
            })
            .on('add', (path) => {this._addService(path)})
            .on('change', (path) => {this._addService(path)})
            .on('unlink', (path) => {this._removeService({path:path})})
        ;

        let classes = Glob.sync(dir);

        for (let i = 0; i < classes.length; i++) {
            this._addService(classes[i]);

        }
    }

    _addService(path){

        delete require.cache[path];

        let cls = require(path);

        let spiderKhan = cls.SpiderKhan;

        if(typeof spiderKhan === "object" && spiderKhan !== null) {
            // if(this._services[service.url]) {
            //     throw new Exception(0,"DUPLICATE SERVICE "+ service.url )
            // }
            this._services[spiderKhan.url] = {
                class: cls,
                method : spiderKhan.method,
                path : path
            };

            if (spiderKhan.defaultRout) {
                this._defaultRoutClass = cls;
            }
        }
    }

    _removeService({path,url}){

        for (let srvUrl in this._services) {

            if ((path && this._services[srvUrl].path === path) || url === srvUrl) {
                delete this._services[srvUrl];
            }
        }
    }

    getClass(url){

        let className;
        if(this._services[url]) {
            className = this._services[url].class;
        } else {
            className =  this._defaultRoutClass;
        }

        return className;
    }


    _parseForm(request){
        return new Promise((resolve, reject) => {
            let form = new Formidable.IncomingForm();
            form.uploadDir = this._uploadDir;
            // form.multiples = true;
            let fieldsData ={};
            form.parse(request, async(err, fields, files)=> {
                if (!err) {
                    resolve(fieldsData);
                }
            });

            let func = (name, value) => {

                if (!fieldsData[name]) {
                    fieldsData[name] = value;
                } else {
                    if (!Array.isArray(fieldsData[name])) {
                        fieldsData[name] = [fieldsData[name]];
                    }

                    fieldsData[name].push(value);
                }
            };
            form.on('field', func);
            form.on('file', func);
        });
    }

    _parseBody(req){
        return new Promise((resolve, reject) => {

            let body = "";
            req.on("data", (res) => {
                body += res;
            });
            req.on("end", (res) => {
                try {
                    body = JSON.parse(body);
                } catch (e){
                    body = {};
                }

                resolve(body);
            });
        });
    }

    async _getRequestBodyData(req){
        let contentType = req.headers && req.headers['content-type'];

        if(typeof contentType === "string") {
            if(contentType.indexOf("multipart/form-data") >= 0){
                return await this._parseForm(req);
            } else  if(contentType.indexOf("application/json") >= 0) {
                return await this._parseBody(req);
            } else {
                return {};
            }
        } else {
            return {};

        }
    }

    _response(res,{body,headers,statusCode=200}){

        let resHead;

        if (headers) {
            resHead = headers;
        } else {
            resHead = {};
        }
        res.writeHead(statusCode, resHead);

        res.end(body);

    }

    async onRequest(req,res){
        try {

            if (this._defaultResponseHeaders) {
                for (let key in this._defaultResponseHeaders) {
                    res.setHeader(key, this._defaultResponseHeaders[key]);
                }
            }


            let urlData = URL.parse(req.url,true);

            let className = this.getClass(urlData.pathname);
            let body = await this._getRequestBodyData(req);
            for (let i = 0; i < this._middlewares.length; i++) {
                let middleware = this._middlewares[i];

                let ret = await middleware({
                    request : req,
                    response : res,
                    urlData : urlData,
                    body : body
                });

                if (ret === false) {
                    return;
                }
            }

            let result;

            if (className) {
                let params = {
                    class : className,
                    request : req,
                    response : res,
                    urlData : urlData,
                    body : body
                };
                let cls = new className(params);

                result = await cls._onRequest();


                if (result && typeof result === "object") {

                    if (!result.statusCode) {
                        result.statusCode = 200;
                    }

                    if (!result.headers) {

                        let mtd = className.SpiderKhan.method && className.SpiderKhan.method[req.method];
                        if (mtd.headers) {
                            result.headers = mtd.headers;
                        } else if (className.SpiderKhan.defaultResponseHeaders) {
                            result.headers = className.SpiderKhan.defaultResponseHeaders;
                        }
                    }

                } else {
                    result = {
                        statusCode : 500
                    }
                }
            } else {
                result = {
                    statusCode : 500
                }
            }

            this._response(res,result);




        }catch (e){

            console.log(e);
        }
    }


    addMiddleware(middleware){

        this._middlewares.push(middleware);
    }
}

module.exports = APIHandler;