/*
貼圖類別
    建構子:
        src: 圖片來源，請參考assets.js
        draw_offset: 圖片來源的起始座標位移
        width: 寬度
        height: 高度
    draw: 畫圖
        pos: 畫在canvas的座標
        angle: 以左上角為基準點的旋轉角度，單位弧度
        scale: 縮放比例
 */
class Sprite{
    constructor(src, draw_offset, width, height){
        this.img = new Image;
        this.img.src = src;
        this.draw_offset = draw_offset;
        this.width = width;
        this.height = height;
    }
    draw(pos, rotation, scale){
        context.save();
        let camera_rotated = Vector.rotate(camera.pos, -rotation);
        context.translate(pos.x, pos.y);
        context.rotate(rotation);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, -camera_rotated.x, -camera_rotated.y, this.width * scale.x, this.height * scale.y);
        //context.strokeStyle = "#"+(Math.floor(Math.random()*255)).toString(16)+(Math.floor(Math.random()*255)).toString(16)+(Math.floor(Math.random()*255)).toString(16);
        //context.strokeRect(-camera_rotated.x, -camera_rotated.y, this.width, this.height);
        context.restore();
    }
}
