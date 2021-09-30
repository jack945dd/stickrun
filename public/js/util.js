var 
    Common = Matter.Common,
    Vector = Matter.Vector,
    Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Constraint = Matter.Constraint,
    canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    request = new XMLHttpRequest(),
    chunks = [];
    request.open('GET', 'chunks.json', false);
    request.send('null');
    chunks = JSON.parse(request.responseText).chunks;

function getMousePos(canvas, event){
    if(document.fullscreenElement){
        let ratio = window.innerHeight/canvas.height;
        let w = canvas.width*ratio;
        let h = canvas.height*ratio;
        let rect = {left: (window.innerWidth-w)/2, top: (window.innerHeight-h)/2};
        return {x: (event.clientX - rect.left)/ratio, y: (event.clientY - rect.top)/ratio};
    }
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function inRect(pos, rect){
    return pos.x > rect.pos.x && pos.x < rect.pos.x+rect.width && pos.y < rect.pos.y+rect.height && pos.y > rect.pos.y;
}
function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}
function inverse_lerp(start, end, value){
    return (value-start)/(end-start);
}
function aabb(pos1, width1, height1, pos2, width2, height2){
    if(pos1.x < pos2.x + width2 && pos1.x + width1 > pos2.x && pos1.y < pos2.y + height2 && pos1.y + height1 > pos2.y)
		return {collided: true, h: pos1.x+width1/2<pos2.x+width2/2 ? pos1.x+width1-pos2.x : pos2.x+width2-pos1.x, v: pos1.y+height1/2<pos2.y+height2/2 ? pos1.y+height1-pos2.y : pos1.y-(pos2.y+height2)};
    else 
        return {collided: false};
}
function toggleFullscreen(){
    if(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled){
        if(document.fullscreenElement){
            if(document.exitFullscreen)
                return document.exitFullscreen();
            else if(document.webkitRequestFullscreen)
                return document.webkitExitFullscreen();
            else if(document.mozCancelFullscreen)
                return document.mozCancelFullscreen();
        }
        else{
            if(canvas.requestFullscreen)
                return canvas.requestFullscreen();
            else if(canvas.webkitRequestFullscreen)
                return canvas.webkitRequestFullscreen();
            else if(canvas.mozRequestFullscreen)
                return canvas.mozRequestFullscreen();
        }
    }
}
async function gameFullscreen(){
    if(document.fullscreenElement){
        toggleFullscreen();
        screen.orientation.unlock();
    }
    else{
        await toggleFullscreen();
        await screen.orientation.lock('landscape');
    }
}
