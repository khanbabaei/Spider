const
    Glob = require("glob"),
    Formidable = require('formidable');


class ApiHandler{

    constructor(options) {

        this._defaultResponseHeaders = options.defaultResponseHeaders;
        this._services = {};
        this._middlewares = [];

        this._defaultRoutClass = null;


        let classes = Glob.sync( process.cwd() + options.rootPath + "/**/*.js");

        for (let i = 0; i < classes.length; i++) {
            let cls = require(classes[i]);

            let spiderKhan = cls.SpiderKhan;

            if(typeof spiderKhan === "object" && spiderKhan !== null) {
                // if(this._services[service.url]) {
                //     throw new Exception(0,"DUPLICATE SERVICE "+ service.url )
                // }

                this._services[spiderKhan.url] = {
                    class: cls,
                    method : spiderKhan.method
                };

                if (spiderKhan.defaultRout) {
                    this._defaultRoutClass = cls;
                }
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
            form.uploadDir = "./tmp";
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

    _response({body,headers,statusCode=200}){

        let resHead;

        if (headers) {
            resHead = headers;
        } else if (this._class.SpiderKhan.responseHeaders) {
            resHead = this._class.SpiderKhan.responseHeaders;
        } else {
            resHead = {};
        }
        this._response.writeHead(statusCode, resHead);

        this._response.end(body);

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


            if (className) {
                let params = {
                    class : className,
                    request : req,
                    response : res,
                    urlData : urlData,
                    body : body
                };
                let cls = new className(params);

                let res = await cls.onRequest();


                if (res && typeof res === "object") {

                }
            }




        }catch (e){

        }
    }


    addMiddleware(middleware){

        this._middlewares.push(middleware);
    }
}

module.exports = ApiHandler;