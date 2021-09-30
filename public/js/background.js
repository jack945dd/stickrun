class Background{
    constructor(src, parallax_speed){
        this.y = src == "assets/hd/graphics/bg_53.png" ? 384 : 256;
        this.bg_l = new Sprite(src, Vector.create(0, 0), 1024, 512);
        this.bg_r = new Sprite(src, Vector.create(0, 0), 1024, 512);
        this.parallax_speed = parallax_speed;
        this.offset = 0;
    }
    draw(){
        let y = this.bg_l.img.src == "assets/hd/graphics/bg_53.png" ? 384 : 256;
        if((camera.pos.x*(1-this.parallax_speed))>(1024*(1+this.offset))){
            this.offset++;
        }
        this.bg_l.draw(Vector.create(camera.pos.x*this.parallax_speed+this.offset*1024, this.y), 0, Vector.create(1, 1));
        this.bg_r.draw(Vector.create(camera.pos.x*this.parallax_speed+(this.offset+1)*1024, this.y), 0, Vector.create(1, 1));
    }
}
