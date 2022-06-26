import {WebSocketServer, createWebSocketStream, WebSocket} from 'ws';
import messageHandler from "../ClientMessageHandler"

class AppWebsocketServer {
    public run() {
        const port = this.getPort();
        const wss = new WebSocketServer({port: port});
        wss.on('connection', function connection(ws) {
            const duplex = createWebSocketStream(ws, {
                encoding: 'utf8',
                decodeStrings: false,
            });
            duplex.on('readable', function message() {
                let data = '', chunk = '';
                while (chunk !== null) {
                    data += chunk;
                    chunk = duplex.read();
                }
                messageHandler.handle(data, duplex);
            });
        });
        process.on("SIGINT", () => this.shutdown(wss));
    }

    private shutdown(wss: WebSocketServer) {
        this.closeWss(wss)
        process.exit()
    }

    private closeWss(wss: WebSocketServer) {
        wss.clients.forEach((ws: WebSocket) => {
            ws.close();
        })
        wss.close();
    }

    private getPort() {
        return parseInt(process.env.WS_PORT) || 8080
    }
}

export default new AppWebsocketServer();

