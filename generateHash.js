const UrlMaps = require('./Schemas/UrlMaps');
const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const generateHash = async()=>{
    while(true){
        var code = "";
        for(var i = 0; i < 6; i++){
            code += alphanumeric.charAt(Math.floor(Math.random()*63)%62);
        }
        const url_map = await UrlMaps.findOne({shortUrl:code});
        if(url_map == null){
            console.log(code);
            return code;
        }
    }
}
module.exports=generateHash;
