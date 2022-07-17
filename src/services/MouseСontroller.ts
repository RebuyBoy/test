import robot from "robotjs";

class MouseController {

    public drawRectangle(length: number, width: number) {
        let {x, y} = robot.getMousePos();
        robot.mouseClick("left");
        robot.mouseToggle('down', 'left');

        this.drawLine(width, x, y, "right")
        this.drawLine(length, x + width, y, "down");
        this.drawLine(width, x + width, y + length, "left")
        this.drawLine(length, x, y + length, "up");
        robot.mouseToggle('up', 'left');
    }

    public drawCircle(radius: number) {
        robot.mouseClick("left");
        robot.mouseToggle('down', 'left');
        const {x, y} = robot.getMousePos();

        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
            const newX = x - radius + (radius * Math.cos(i));
            const newY = y + (radius * Math.sin(i));
            robot.dragMouse(newX, newY);
        }
        robot.mouseToggle('up');
    }

    private drawLine(length: number, x: number, y: number, direction: string) {
        for (let i = 0; i < length; i++) {
            if (direction === "right") {
                robot.dragMouse(x + i, y);
            }
            if (direction === "down") {
                robot.dragMouse(x, y + i);
            }
            if (direction === "left") {
                robot.dragMouse(x - i, y);
            }
            if (direction === "up") {
                robot.dragMouse(x, y - i);
            }
        }
    }
}

export default new MouseController();