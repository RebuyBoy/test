import httpServer from "./src/servers/AppHttpServer";
import webSocketServer from "./src/servers/AppWebSocketServer";
import {config} from "dotenv";

config();
httpServer.run()
webSocketServer.run();

