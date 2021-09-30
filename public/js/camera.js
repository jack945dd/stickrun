class Camera{
    constructor(pos, width, height){
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.center = Vector.create(0, 0);
        this.center.x = this.pos.x + width/2;
        this.center.y = this.pos.y + height/2;
    }
    moveTo(pos){
        this.center = pos;
        this.pos.x = this.center.x - width/2;
        this.pos.y = this.center.y - height/2;
    }
}
