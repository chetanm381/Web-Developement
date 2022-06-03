const http = require("http")
const fs = require("fs")
const requests = require("requests")

const readfile = fs.readFileSync("weatherapi.html","utf-8")
let city ="Bangalore";

const replaceVal = (tempval,orgdata)=>{
    let temperature = tempval.replace("{%temp%}",parseFloat(orgdata.main.temp-273).toFixed(2))
    temperature = temperature.replace("{%tempmin%}",parseFloat(orgdata.main.temp_min-273).toFixed(2))
    temperature = temperature.replace("{%tempmax%}",parseFloat(orgdata.main.temp_max-273).toFixed(2))
    temperature = temperature.replace("{%city%}",orgdata.name)
    temperature = temperature.replace("{%country%}",orgdata.sys.country)
    return temperature
}

http.createServer((req,res)=>{
    if(req.url=="/"){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c1d65aa169c634b7cb7ef3d113a2fcc8`)
.on('data', function (chunk) {
  const dataj = JSON.parse(chunk)
  const arraydata = [dataj]
  const realtimedata = arraydata.map((val)=>{ 
    return replaceVal(readfile,val)}).join("")
 res.write(realtimedata)
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
 
  console.log('end');
  res.end()
})
    }
}).listen(60000)