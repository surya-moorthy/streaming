import express from "express";
import dotenv from "dotenv";
import http from "http";
import { setupWebSocket } from "./ws/ws";
import { WebSocketServer } from "ws";
// dotenv.config();

// const app = express();
// const httpserver = http.createServer(app);

// setupWebSocket(httpserver);
const wss = new WebSocketServer({port : 8080});

wss.on('connection',function connection(ws){
    ws.on('message', function message(data : any){
        const message = JSON.parse(data);
        console.log(message);
    } )
})


// app.get('/', (req, res) => {
//   res.send('Express HTTP server is running');
// });


// const port = process.env.PORT;

// app.listen(port,()=>{
//     console.log("app is running on port:",port);
// })