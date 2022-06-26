import robot from "robotjs";
import mouseController from "./MouseСontroller"
import printScreener from "./PrintScreener";
import {Duplex} from "stream"

class ClientMessageHandler {
    private SCREENSHOT_SIZE = 200;

    public handle(data: string, duplex: Duplex) {
        const {command, width, length} = this.parseArgs(data);

        try {
            const {x: cursorPositionX, y: cursorPositionY} = robot.getMousePos();

            if (command.startsWith("mouse_right")) {
                robot.moveMouseSmooth(cursorPositionX + width, cursorPositionY);
            }
            if (command === "mouse_left") {
                if (cursorPositionX > 0) {
                    const newPositionX = cursorPositionX - width > 0 ? cursorPositionX - width : 0
                    robot.moveMouseSmooth(newPositionX, cursorPositionY);
                }
            }
            if (command === "mouse_up") {
                robot.moveMouseSmooth(cursorPositionX, cursorPositionY - width);
            }
            if (command === "mouse_down") {
                robot.moveMouseSmooth(cursorPositionX, cursorPositionY + width);
            }
            if (command === "mouse_position") {
                duplex.write(`mouse_position ${cursorPositionX},${cursorPositionY}\0`);
            }
            if (command === "draw_square") {
                mouseController.drawRectangle(width, length);
            }
            if (command === "draw_rectangle") {
                mouseController.drawRectangle(width, length);
            }
            if (command === "draw_circle") {
                mouseController.drawCircle(width);
            }
            if (command === "prnt_scrn") {
                printScreener.handlePrintScreen({cursorPositionX, cursorPositionY}, this.SCREENSHOT_SIZE)
                    .then((data) => {
                        const stringBase64 = data.split(',')[1];
                        duplex.write(`prnt_scrn ${stringBase64}\0`);
                    });
            }
            if (!["mouse_position", "prnt_scrn"].includes(command)) {
                duplex.write(command + "\0");
            }
            console.log(command, "done")
        } catch (err) {
            console.log(command, "fail")
        }

    }

    public parseArgs(data: string) {
        const [command, rawWidth, rawLength] = data.split(" ");
        const width = rawWidth ? parseInt(rawWidth) : 0;
        const length = rawLength ? parseInt(rawLength) : width;
        return {command, width, length}
    }
}

export default new ClientMessageHandler();