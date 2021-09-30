class Gradient{
    constructor(color, height){
        this.color = color;
        this.height = height;
    }
    draw(){
        let gradient = context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'white');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}
