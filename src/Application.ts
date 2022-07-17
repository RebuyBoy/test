import httpServer from "./servers/AppHttpServer";
import webSocketServer from "./servers/AppWebSocketServer";
import {config} from "dotenv";

config();
httpServer.run()
webSocketServer.run();

