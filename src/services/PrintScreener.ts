import robot, {Bitmap} from "robotjs";
import Jimp from "jimp";

export class PrintScreener {

    public async handlePrintScreen(mousePos: { cursorPositionX: number, cursorPositionY: number }, screenshotSize: number) {
        const screenSize = robot.getScreenSize();
        const {
            screenshotPointX,
            screenshotPointY
        } = this.screenOverflowHandler(mousePos, screenSize, screenshotSize);
        const bmp = robot.screen.capture(screenshotPointX, screenshotPointY, screenshotSize, screenshotSize);
        this.correctColors(bmp);
        const jimp = new Jimp({
            "data": bmp.image,
            "width": bmp.width,
            "height": bmp.height
        });
        return jimp.getBase64Async(Jimp.MIME_PNG);
    }

    private screenOverflowHandler(mousePos: { cursorPositionX: number, cursorPositionY: number }, screenSize: { width: number, height: number }, screenshotSize: number) {
        const screenshotSizeCenter = screenshotSize / 2;
        let screenshotPointX = mousePos.cursorPositionX - screenshotSizeCenter;
        let screenshotPointY = mousePos.cursorPositionY - screenshotSizeCenter;
        const maximalScreenPointX = screenSize.width - screenshotSize;
        const maximalScreenPointY = screenSize.height - screenshotSize;
        const minimalScreenPointX = 0;
        const minimalScreenPointY = 0;

        screenshotPointX = screenshotPointX < 0 ? minimalScreenPointX : screenshotPointX;
        screenshotPointY = screenshotPointY < 0 ? minimalScreenPointY : screenshotPointY;
        screenshotPointX = screenshotPointX > maximalScreenPointX ? maximalScreenPointX : screenshotPointX;
        screenshotPointY = screenshotPointY > maximalScreenPointY ? maximalScreenPointY : screenshotPointY;
        return {screenshotPointX, screenshotPointY}
    }


    private correctColors(bmp: Bitmap) {
        for (let i = 0; i < bmp.image.length; i += 4) {
            let r = bmp.image[i]
            let b = bmp.image[i + 2]
            let a = bmp.image[i + 3]
            bmp.image[i] = b
            bmp.image[i + 2] = r
            bmp.image[i + 3] = a
        }
    }
}

export default new PrintScreener();