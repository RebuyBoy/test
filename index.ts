import Jimp from 'jimp';
import {httpServer} from './src/http_server';
import robotjs from 'robotjs';
import {WebSocketServer} from 'ws';
import WebSocket from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


const wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        const [command, value] = data.toString().split(" ");
        console.log('received: %s', data);
        if (command.startsWith("mouse_right")) {
            const {x: cursorPositionX, y: cursorPositionY} = robotjs.getMousePos();
            robotjs.moveMouseSmooth(cursorPositionX + parseInt(value), cursorPositionY);
        }
        if (command.startsWith("mouser_left")){
            const {x: cursorPositionX, y: cursorPositionY} = robotjs.getMousePos();
            robotjs.moveMouseSmooth(cursorPositionX + parseInt(value), cursorPositionY);
        }
    });

    ws.send('something');
});
