import express from "express";
import dotenv from "dotenv";
import http from "http";
import { setupWebSocket } from "./ws/ws";
import { WebSocketServer } from "ws";
dotenv.config();

const app = express();
const httpserver = http.createServer(app);

setupWebSocket(httpserver);

app.get('/', (req, res) => {
  res.send('Express HTTP server is running');
});


const port = process.env.PORT;

httpserver.listen(port,()=>{
    console.log("app is running on port:",port);
})