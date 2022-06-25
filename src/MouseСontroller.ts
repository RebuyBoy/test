import robot from "robotjs";

class MouseControl {

    public drawRectangle(width: number, length: number) {
        const {x, y} = robot.getMousePos();
        robot.mouseClick("left");
        robot.mouseToggle('down', 'left');

        this.drawLineRight(width, x, y)
        this.drawLineDown(length, x + width, y)
        this.drawLineLeft(width, x + width, y + length)
        this.drawLineUp(length, x, y + length)
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

    private drawLineRight(width: number, x, y) {
        for (let i = 0; i <= width; i++) {
            robot.dragMouse(x + i, y);
        }
    }

    private drawLineDown(length: number, x, y) {
        for (let i = 0; i <= length; i++) {
            robot.dragMouse(x, y + i);
        }
    }

    private drawLineLeft(width: number, x, y) {
        for (let i = 0; i <= width; i++) {
            robot.dragMouse(x - i, y);
        }
    }

    private drawLineUp(length: number, x, y) {
        for (let i = 0; i <= length; i++) {
            robot.dragMouse(x, y - i);
        }
    }
}

export default new MouseControl();