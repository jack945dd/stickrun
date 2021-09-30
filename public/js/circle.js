/*
圓形類別，基於Matter.Bodies.circle
!!!注意: Matter產生物件時以中心為基準點!!!
 */
function Circle(pos, radius, options, sprite){
    let circle = Bodies.circle(pos.x, pos.y, radius, options);
    circle.sprite = sprite;
    circle.sprite.draw = function(pos, angle, scale){
        context.save();
        let camera_translated = Vector.create(circle.position.x-camera.pos.x, circle.position.y-camera.pos.y);
        context.translate(camera_translated.x, camera_translated.y);
        context.rotate(circle.angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, -circle.sprite.width*scale.x/2, -circle.sprite.height*scale.y/2, this.width * scale.x, this.height * scale.y);
        /*context.strokeStyle = 'black';
        context.beginPath();
        context.arc(0, 0, circle.circleRadius, 0, 2*Math.PI);
        context.stroke();*/
        context.restore();
    }
    circle.draw = function(){
        circle.sprite.draw(circle.position, circle.angle, Vector.create(circle.circleRadius/circle.sprite.width*2, circle.circleRadius/circle.sprite.height*2));
    }
    return circle;
}
