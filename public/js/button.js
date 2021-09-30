class Button{
    constructor(pos, width, height, sprite){
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.sprite.draw = function(pos, angle, scale){
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, 0, 0, this.width * scale.x, this.height * scale.y);
        //context.strokeStyle = "#"+(Math.floor(Math.random()*255)).toString(16)+(Math.floor(Math.random()*255)).toString(16)+(Math.floor(Math.random()*255)).toString(16);
        //context.strokeRect(-camera_rotated.x, -camera_rotated.y, this.width, this.height);
        context.restore();
    }
    }
    draw(){
        this.sprite.draw(this.pos, 0, Vector.create(this.width/this.sprite.width, this.height/this.sprite.height));
    }
    click(){
        
    }
}
