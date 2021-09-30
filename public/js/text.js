class Text{
    constructor(text, font, color, shadow_blur, shadow_color){
        this.text = text;
        this.font = font;
        this.color = color;
        this.shadow_blur = shadow_blur;
        this.shadow_color = shadow_color;
    }
    draw(pos){
        context.save();
        context.fillStyle = this.color;
        context.font = this.font;
        context.shadowBlur = this.shadow_blur;
        context.shadowColor = this.shadow_color;
        context.translate(pos.x, pos.y);
        context.fillText(this.text, 0, 0);
        context.restore();
    }
}
