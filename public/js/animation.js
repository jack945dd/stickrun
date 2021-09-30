class Animation{
     constructor(sprite, start_transform, end_transform, type, duration){
        this.sprite = sprite;
        this.playing = false;
        this.starttime = 0;
        this.duration = duration;
        this.start = start_transform;
        this.end = end_transform;
        this.pos = Vector.create(0, 0);
        this.angle = 0;
        this.scale = Vector.create(1, 1);
        this.type = type;
        this.once = false;
        this.played = false;
    }
    play(){
        if(!this.playing){
            if(!(this.once && this.played)){
                this.playing = true;
                this.starttime = then;
            }
        }
    }
    pause(){
        this.playing = false;
    }
    resume(){
        if(!this.playing && then>this.starttime)
            this.playing = true;
    }
    update(){
        if(this.playing){
            if(then>this.starttime+this.duration){
                this.playing = false;
                this.played = true;
                return;
            }
            let weight = inverse_lerp(this.starttime, this.starttime+this.duration, then);
            switch(this.type){
                case "easeOutQuad":
                    weight = weight*(2-weight);
                    this.pos.x = lerp(this.start.pos.x, this.end.pos.x, weight);
                    this.pos.y = lerp(this.start.pos.y, this.end.pos.y, weight);
                    this.angle = lerp(this.start.angle, this.end.angle, weight);
                    this.scale.x = lerp(this.start.scale.x, this.end.scale.x, weight);
                    this.scale.y = lerp(this.start.scale.y, this.end.scale.y, weight);
                    break;
                case "easeOutElastic":
                    weight = weight === 0 ? 0 : weight === 1 ? 1 : Math.pow(2, -10 * weight) * Math.sin((weight * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
                    this.pos.x = lerp(this.start.pos.x, this.end.pos.x, weight);
                    this.pos.y = lerp(this.start.pos.y, this.end.pos.y, weight);
                    this.angle = lerp(this.start.angle, this.end.angle, weight);
                    this.scale.x = lerp(this.start.scale.x, this.end.scale.x, weight);
                    this.scale.y = lerp(this.start.scale.y, this.end.scale.y, weight);
                    break;
            }
        }
        else{
            this.starttime += dt;
        }
    }
    draw(){
        if(this.playing)
            this.sprite.draw(Vector.rotate(Vector.create(this.pos.x-this.sprite.width*this.scale.x/2, this.pos.y-this.sprite.height*this.scale.y/2), this.angle, this.pos), this.angle, this.scale);
    }
} 
