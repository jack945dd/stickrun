/*
關卡的區塊類別
    建構子:
        pos:  區塊左上角在全域座標的位置
        data: 區塊資料，從全域變數chunks陣列中的元素當參數
    draw:
        從data的物件中呼叫對應的draw
 */
class Chunk{
    constructor(pos, data){
        this.pos = pos;
        this.data = [];
        for(let i=0; i<data.length; i++){
            let obj = null;
            switch(data[i].type){
                case 'ground':
                    obj = new Rectangle(Vector.add(pos, Vector.create(data[i].x, data[i].y)), 1024, 64, {isStatic: true, label: 'ground'}, new Sprite(objects, Vector.create(0, 0), 1024, 64));
                    break;
                case 'box':
                    obj = new Rectangle(Vector.add(pos, Vector.create(data[i].x, data[i].y)), 74, 74, {isStatic: true, label: 'box'}, new Sprite(objects, Vector.create(0, 758), 148, 148));
                    break;
                case 'saw':
                    obj = new Circle(Vector.add(pos, Vector.create(data[i].x, data[i].y)), 36, {label: 'saw'}, new Sprite(objects, Vector.create(177, 758), 144, 144));
                    let constraint = Constraint.create({length: 0, pointA: Vector.add(pos, Vector.create(data[i].x, data[i].y)), bodyB: obj});
                    World.add(engine.world, constraint);
                    constraint.draw = function(){}
                    this.data.push(constraint);
                    break;
                case 'test':
                    obj = new Circle(Vector.add(pos, Vector.create(data[i].x, data[i].y)), 36, {isStatic: false}, new Sprite(objects, Vector.create(177, 758), 144, 144));
                    break;
            }
            World.add(engine.world, [obj])
            this.data.push(obj);
        }
    }
    draw(){
        for(let i=0; i<this.data.length; i++){
            if(this.data[i].label == 'saw')
                Body.setAngularVelocity(this.data[i], 1);
            this.data[i].draw();
        }
        /*context.save();
        let camera_translated = Vector.create(this.pos.x-camera.pos.x, this.pos.y-camera.pos.y);
        context.translate(camera_translated.x, camera_translated.y);
        context.strokeStyle = 'black';
        context.beginPath();
        context.strokeRect(0, 0, 1024, 768);
        context.stroke();
        context.restore();*/
    }
}
