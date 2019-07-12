const
    HTTP = require('http'),
    Util = require("../share/Util");

module.exports = class Http {

    constructor(options) {
        this._eventCallbacks = {
            "request": {}
        };
        this._initServer(options);
    }

    _fireEvent(eventName, req, res) {
        for (let id in this._eventCallbacks[eventName]) this._eventCallbacks[eventName][id](req, res);
    }

    _initServer(params,callback) {

        let server = HTTP.createServer((req, res) => {
            // res.setHeader("Access-Control-Allow-Origin", "*");
            // res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
            // res.setHeader("Access-Control-Allow-Headers", "content-type");
            // res.setHeader("Access-Control-Allow-Methods", "POST,GET");

            this._fireEvent("request", req, res);
        });

        server.listen(params.port,"0.0.0.0", callback);
    }


    on(eventName, callback) {
        if (this._eventCallbacks[eventName]) {
            let id = Util.generateUUID();
            this._eventCallbacks[eventName][id] = callback;
            return id;
        }
    }
};