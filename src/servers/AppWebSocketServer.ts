import {WebSocketServer, createWebSocketStream, WebSocket} from 'ws';
import messageHandler from "../services/ClientMessageHandler"

class AppWebsocketServer {
    public run() {
        const port = this.getPort();
        const wss = new WebSocketServer({port: port});
        this.setupWss(wss, port);
        process.on("SIGINT", () => process.exit());
        process.on("exit", () => this.shutdown(wss));
    }

    private setupWss(wss: WebSocketServer, port: number) {
        wss.on('listening', () => console.log(`websocket server started on port: ${port}`));
        wss.on('headers', (data) => {
            console.log("websocket started\n", data);
        });
        wss.on('connection', function connection(ws) {
            const duplex = createWebSocketStream(ws, {
                encoding: 'utf8',
            });
            duplex.on('readable', function message() {
                let data = '', chunk = '';
                while (chunk !== null) {
                    data += chunk;
                    chunk = duplex.read();
                }
                messageHandler.handle(data, duplex);
            });
            ws.on('close', () => {
                console.log("websocket closed");
                duplex.destroy();
            });

        });
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

