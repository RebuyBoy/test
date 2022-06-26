import fs from 'fs';
import path from 'path';
import http from 'http';

class AppHttpServer {
    run() {
        const port = this.getPort();
        const server = http.createServer(function (req, res) {
            const __dirname = path.resolve(path.dirname(''));
            const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
            fs.readFile(file_path, function (err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        });
        server.listen(port)
        console.log(`server started on port: ${port}`)
    }

    private getPort() {
        return process.env.HTTP_PORT || 3000
    }
}

export default new AppHttpServer();
