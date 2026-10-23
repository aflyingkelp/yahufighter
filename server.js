const {WebSocketServer}=require('ws'),http=require('http'),fs=require('fs');
const srv=http.createServer((q,r)=>{r.writeHead(200,{'content-type':'text/html'});
 r.end(fs.readFileSync(__dirname+'/index.html','utf8').replace("const WS_URL=''","const WS_URL=(location.protocol=='https:'?'wss://':'ws://')+location.host"))});
const wss=new WebSocketServer({server:srv}),rooms={};
wss.on('connection',ws=>ws.on('message',d=>{let m;try{m=JSON.parse(d)}catch{return}
 if(m.j){const r=rooms[m.j]=(rooms[m.j]||[]).filter(x=>x.readyState==1);if(r.length>=2)return ws.send('{"full":1}');
  r.push(ws);ws.room=m.j;ws.send(JSON.stringify({role:r.length==1?'host':'guest'}));if(r.length==2)r[0].send('{"peer":1}');return}
 (rooms[ws.room]||[]).forEach(x=>x!==ws&&x.readyState==1&&x.send(d.toString()))}));
srv.listen(process.env.PORT||3000);
