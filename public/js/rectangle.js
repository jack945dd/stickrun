/*
矩形類別，基於Matter.Bodies.rectangle
!!!注意: Matter產生物件時以中心為基準點!!!
 */
function Rectangle(pos, width, height, options, sprite){
    let rect = Bodies.rectangle(pos.x, pos.y, width, height, options);
    rect.width = width;
    rect.height = height;
    rect.sprite = sprite;
    rect.draw = function(){
        rect.sprite.draw(rect.vertices[0], rect.angle, Vector.create(rect.width/rect.sprite.width, rect.height/rect.sprite.height));
    }
    return rect;
}
