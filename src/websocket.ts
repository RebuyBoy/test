// import Jimp from 'jimp';
import {httpServer} from './http_server';
import {WebSocketServer} from 'ws';
import messageHandler from "./ClientMessageHandler"


//TODO ENV
export function run() {
    const SCREENSHOT_SIZE = 200;
    const HTTP_PORT = 3000;
    httpServer.listen(HTTP_PORT);
    const wss = new WebSocketServer({port: 8080});
//TODO  env HTTP/SOCKET SERVER PORTS
// After program work finished the program should end websocket work correctly
// After each received command program should display the command and result  RESULT??
//TODO
    wss.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            messageHandler.handle(data, SCREENSHOT_SIZE, ws);
        });
    });
//TODO  wss.on()
    process.on("exit", () => wss.close());
}

