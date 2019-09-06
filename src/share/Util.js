const
    FS = require('fs'),
    Crypto = require('crypto');

class Util{


    static getRequestIp(req){
        let spl = req.connection.remoteAddress.split(":");
        return spl[spl.length - 1];
    }

    static generateUUID(sectionCount) {
        let d = new Date().getTime();
        let textData = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        if (sectionCount === 1) {
            textData = 'xxxxxxxx';
        }

        if (sectionCount === 2) {
            textData = 'xxxxxxxx-xxxx';
        }

        if (sectionCount === 3) {
            textData = 'xxxxxxxx-xxxx-4xxx';
        }

        if (sectionCount === 4) {
            textData = 'xxxxxxxx-xxxx-4xxx-yxxx';
        }

        return textData.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);

            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
    };

    static generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    static generateRandomFloat (min, max) {
        return Math.random() * (max - min) + min;
    };

    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    static hashPassword(pass){
        return Crypto.createHash('sha256').update(pass).digest('hex');
    }

    static isCellphoneNumber(cellphoneNumber) {
        return (cellphoneNumber.length === 11 && /^09[\d]{9}$/.test(cellphoneNumber));
    };

    static createSmsText(verifyCode){

        let content = [
            "خوش آمدید",
            "\n",
            "کد فعالسازی : ",
            verifyCode
        ];

        return content.join("");
    }

    static getHashTagFromText(text){
        let allText = text.match(/(^|\s)#([^ ]*)/g);
        let retData = [];
        for (let i = 0; i < allText.length; i++) {
            retData.push(allText[i].trim().substring(1));
        }
        return retData;
    }

    static sleep(timeout){
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        });
    }

    static readFile(path){
        return new Promise((resolve, reject) => {
            FS.readFile(path,(err,res)=>{
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

    }

    static traverseDir(dir) {
        FS.readdirSync(dir).forEach(file => {
            let fullPath = path.join(dir, file);
            if (FS.lstatSync(fullPath).isDirectory()) {
                console.log(fullPath);
                traverseDir(fullPath);
            } else {
                console.log(fullPath);
            }
        });
    }
}


module.exports = Util;