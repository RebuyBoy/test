import {WebSocketServer, createWebSocketStream, WebSocket} from 'ws';
import messageHandler from "../services/ClientMessageHandler"

class AppWebsocketServer {
    public run() {
        const port = this.getPort();
        const wss = new WebSocketServer({port: port});
        console.log(`websocket server started on port: ${port}`);
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
        console.log("new websocket connection");
        process.on("SIGINT", () => process.exit());
        process.on("exit", () => this.shutdown(wss));
    }

    private shutdown(wss: WebSocketServer) {
        this.closeWss(wss)
        process.exit()
    }

    private closeWss(wss: WebSocketServer) {
        wss.clients.forEach((ws: WebSocket) => {
            ws.close();
            console.log("websocket connection closed");
        })
        wss.close();
        console.log("websocket server closed");
    }

    private getPort() {
        let port = 8080;
        const wsport = process.env.WS_PORT;
        if (wsport && typeof wsport === "string") {
            port = parseInt(wsport);
        }
        return port;
    }
}

export default new AppWebsocketServer();

