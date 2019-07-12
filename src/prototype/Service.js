
class Service {

    constructor(options){

        this._class = options.class;
        this._urlData = options.urlData;
        this._request = options.request;
        this._response = options.response;
        this._body = options.body;
    }


    async _onRequest() {

        let methods = this._class.SpiderKhan.method;
        let ret;
        let method = this._request.method;



        if(method === "PUT" && typeof this.onPut === "function"){
            ret = await this.onPut();
        } else if (method === "POST" && typeof this.onPost === "function") {
            ret = await this.onPost();
        } else if (method === "GET" && typeof this.onGet === "function") {
            ret = await this.onGet();
        } else {
            ret = await this.onRequest();
        }



        return ret;
    }

    getHeaders(){
        return this._request.getHeaders();
    }

    get request(){
        return this._request;
    }

    get response(){
        return this._response;
    }

    setHeader(key,value){
        this._response.setHeader(key, value);
    }
}

// Service.SpiderKhan = {
//     url: "",
//     method : {
//         onPost : {
//
//         },
//         onPut : {},
//         onGet : {},
//     },
//     defaultResponseHeaders : {},
//     defaultRout : true,
// };

module.exports = Service;