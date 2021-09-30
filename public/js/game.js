var 
    gradient = new Gradient('orange', 768),
    background,
    camera = new Camera(Vector.create(0, 0), 1024, 768),
    buttons = [],
    engine = Engine.create(),
    level = new Level(),
    gamestate = 'mainmenu';
var title = new Sprite(start_interface, Vector.create(0, 0), 1250, 245);
var stickman = new Sprite(start_interface, Vector.create(0, 800), 450, 570);
var title_you = new Sprite(failed_end, Vector.create(0, 0), 697, 277);
var title_failed = new Sprite(failed_end, Vector.create(699, 0), 1107, 270);
var control_up = false, control_down = false, control_left = false, control_right = false;
var myplayer;
var singleplayer_starttime, then=0, dt;
var speed_scale = 1;
var orientation_sensity=10;
var touches = [];
var sound_enabled = false;
var music_enabled = false;
var paused = false;
var paused_animation = [];
var socket;
var score = 0;
for(let i =0; i<pause_anim.length; i++)
    paused_animation.push(new Sprite(pause_anim[i], Vector.create(0, 0), 512, 384));
var paused_animation_interval = 0;
var paused_animation_frame = 0;

var countdown_3 = new Animation(new Sprite(three, Vector.create(0, 0), 250, 308), {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(2, 2)}, {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(0.5, 0.5)}, "easeOutQuad", 1000);
countdown_3.once = true;
var countdown_2 = new Animation(new Sprite(two, Vector.create(0, 0), 301, 361), {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(2, 2)}, {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(0.5, 0.5)}, "easeOutQuad", 1000);
countdown_2.once = true;
var countdown_1 = new Animation(new Sprite(one, Vector.create(0, 0), 230, 392), {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(2, 2)}, {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(0.5, 0.5)}, "easeOutQuad", 1000);
countdown_1.once = true;
var countdown_go = new Animation(new Sprite(go, Vector.create(0, 0), 1023, 334), {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(2, 2)}, {pos: Vector.create(512, 384), angle: 0, scale: Vector.create(0.5, 0.5)}, "easeOutElastic", 1000);
countdown_go.once = true;
countdown_go.draw = function(){
    if(this.playing)
            this.sprite.draw(Vector.add(Vector.rotate(Vector.create(this.pos.x-this.sprite.width*this.scale.x/2, this.pos.y-this.sprite.height*this.scale.y/2), this.angle, this.pos), Vector.create(camera.pos.x, camera.pos.y)), this.angle, this.scale);
}

var background_text = new Text("Background color", "20px Arial", 'black', 0, 'black');
var playagain_text = new Text("(Press Space to Play Again!)", "20px Arial", 'black', 0, 'black');
var pause_text = new Text("Press P to pause", "20px Arial", 'black', 0, 'black');
var score_text = new Text("Score:", "bold 30px Arial", 'black', 0, 'black');
var score_number = new Text("0", "bold 30px Arial", 'white', 20, 'black');
var sound_btn = new Button(Vector.create(10, 10), 46, 46, sound_enabled ? new Sprite(start_interface, Vector.create(522, 696), 78, 78): new Sprite(start_interface, Vector.create(522, 602), 92, 92));
var backgrounds_btn = [];
    sound_btn.enabled = new Sprite(start_interface, Vector.create(522, 696), 78, 78);
    sound_btn.enabled.draw = function(pos, angle, scale){
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, 0, 0, this.width * scale.x, this.height * scale.y);
        context.restore();
    }
    sound_btn.disabled = new Sprite(start_interface, Vector.create(522, 602), 92, 92);
    sound_btn.disabled.draw = function(pos, angle, scale){
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, 0, 0, this.width * scale.x, this.height * scale.y);
        context.restore();
    }
    sound_btn.click = function(){
        if(sound_enabled)
            sound_enabled = false;
        else
            sound_enabled = true;
    }
    sound_btn.draw = function(){
        if(sound_enabled)
            this.enabled.draw(Vector.create(this.pos.x+3.5, this.pos.y+3.5), 0, Vector.create(this.width/this.disabled.width, this.height/this.disabled.height));
        else
            this.disabled.draw(this.pos, 0, Vector.create(this.width/this.disabled.width, this.height/this.disabled.height));
    }
///////////////////////////////////////////////////////////////////////////
function mainmenu(){
    camera.pos.x = 0;
    sound_bgm.currentTime = 0;
    gamestate = 'mainmenu';
    buttons.length = 0;
    var singleplayer_btn = new Button(Vector.create(100, 200), 315, 90, new Sprite(start_interface, Vector.create(670, 250), 630, 180));
    singleplayer_btn.click = function(){
        singleplayer();
    }
    /*var multiplayer_btn = new Button(Vector.create(100, 300), 315, 90, new Sprite(start_interface, Vector.create(0, 420), 630, 180));
    multiplayer_btn.click = function(){
        multiplayer();
    }*/
    var fullscreen_btn = new Button(Vector.create(960, 60), 35, 30, new Sprite(fullscreen, Vector.create(0, 0), 35, 30));
    fullscreen_btn.click = gameFullscreen;
    var music_btn = new Button(Vector.create(920, 630), 78, 82, music_enabled ? new Sprite(start_interface, Vector.create(522, 776), 76, 82): new Sprite(start_interface, Vector.create(1155, 587), 78, 82));
    music_btn.enabled = new Sprite(start_interface, Vector.create(522, 776), 76, 82);
    music_btn.enabled.draw = function(pos, angle, scale){
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, 0, 0, this.width * scale.x, this.height * scale.y);
        context.restore();
    }
    music_btn.disabled = new Sprite(start_interface, Vector.create(1155, 587), 78, 82);
    music_btn.disabled.draw = function(pos, angle, scale){
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);
        context.drawImage(this.img, this.draw_offset.x, this.draw_offset.y, this.width, this.height, 0, 0, this.width * scale.x, this.height * scale.y);
        context.restore();
    }
    music_btn.click = function(){
        if(music_enabled)
            music_enabled = false;
        else{
            music_enabled = true;
            sound_bgm.play();
        }
    }
    music_btn.draw = function(){
        if(music_enabled)
            this.enabled.draw(this.pos, 0, Vector.create(this.width/this.sprite.width, this.height/this.sprite.height));
        else
            this.disabled.draw(this.pos, 0, Vector.create(this.width/this.sprite.width, this.height/this.sprite.height));
    }
    gradient_orange_btn = new Button(Vector.create(33, 600), 134, 66, new Sprite(gradients[0], Vector.create(0, 0), 67, 33));
    gradient_orange_btn.click = function(){
        gradient.color = 'orange';
    }
    gradient_purple_btn = new Button(Vector.create(183, 600), 134, 66, new Sprite(gradients[1], Vector.create(0, 0), 67, 33));
    gradient_purple_btn.click = function(){
        gradient.color = 'purple';
    }
    gradient_blue_btn = new Button(Vector.create(333, 600), 134, 66, new Sprite(gradients[2], Vector.create(0, 0), 67, 33));
    gradient_blue_btn.click = function(){
        gradient.color = 'aqua';
    }
    buttons.push(singleplayer_btn);
    //buttons.push(multiplayer_btn);
    buttons.push(fullscreen_btn);
    buttons.push(sound_btn);
    buttons.push(music_btn);
    buttons.push(gradient_orange_btn);
    buttons.push(gradient_purple_btn);
    buttons.push(gradient_blue_btn);
}
function mainmenu_update(){
    sound_bgm.muted = !music_enabled;
    if(sound_bgm.ended)
        sound_bgm.play();
    title.draw(Vector.create(50, 50), 0, Vector.create(0.5, 0.5));
    stickman.draw(Vector.create(600, 300), 0, Vector.create(0.5, 0.5));
    background_text.draw(Vector.create(170, 590));
}
/////////////////////////////////////////////////////////////////////////
function singleplayer(){
    score = 0;
	speed_scale = 1;
    sound_bgm.currentTime = 0;
    countdown_3.played = false;
    countdown_2.played = false;
    countdown_1.played = false;
    countdown_go.played = false;
    sound_bgm.play();
    buttons.length = 0;
    buttons.push(sound_btn);
    background = new Background(backgrounds[Math.floor(Math.random()*backgrounds.length)], 0.4);
    background.offset = 0;
    level = new Level();
    engine = Engine.create();
    engine.world.gravity.y = 2;
    camera = new Camera(Vector.create(0, 0), 1024, 768);
    gamestate = 'singleplayer';
    level.append(new Chunk(Vector.create(level.chunks.length*1024-level.chunks.length, 0), chunks[0]));
    myplayer = new Player(Vector.create(100, 560), 70, 140, '');
    singleplayer_starttime = then+3000;
    countdown_3.play();
    Events.on(engine, 'collisionActive', 
        function(event){
            for(let i=0; i<event.pairs.length; i++){
                let pairs = event.pairs[i];
                if(myplayer.lower == true){
                    if(pairs.bodyA.label == 'hitbox_lower'){
                        switch(pairs.bodyB.label){
                            case 'ground':
                                myplayer.ground = true;
                                myplayer.jump_count = 25;
                                myplayer.jump = 0;
                                break;
                            case 'box':
                                let collision = aabb(myplayer.parts[2].vertices[0], myplayer.parts[2].width, myplayer.parts[2].height, pairs.bodyB.vertices[0], pairs.bodyB.width, pairs.bodyB.height);
                                if(collision.collided){
                                    if(Math.abs(Math.abs(collision.h)-Math.abs(collision.v))<15){//corner
                                        if(pairs.bodyA.position.y>pairs.bodyB.position.y){
                                         myplayer.player_gameover(collision);
                                        }
                                    }
                                    else if(Math.abs(collision.v)>Math.abs(collision.h) && collision.h>0){//horizontal
                                            myplayer.player_gameover(collision);
                                    }
                                    else{//vertical
                                        if(collision.v>0){
                                        myplayer.ground = true;
                                        myplayer.jump_count = 25;
                                        myplayer.jump = 0;
                                        }
                                        else{
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                }
                                break;
                            case 'saw':
                                myplayer.player_gameover();
                                break;
                        }
                    }
                    else if(pairs.bodyB.label == 'hitbox_lower'){
                        switch(pairs.bodyA.label){
                            case 'ground':
                                myplayer.ground = true;
                                myplayer.jump_count = 25;
                                myplayer.jump = 0;
                                break;
                            case 'box':
                                let collision = aabb(myplayer.parts[2].vertices[0], myplayer.parts[2].width, myplayer.parts[2].height, pairs.bodyA.vertices[0], pairs.bodyA.width, pairs.bodyA.height);
                                if(collision.collided){
                                    if(Math.abs(Math.abs(collision.h)-Math.abs(collision.v))<15){//corner
                                        if(pairs.bodyB.position.y>pairs.bodyA.position.y){
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                    else if(Math.abs(collision.v)>Math.abs(collision.h) && collision.h>0){//horizontal
                                            myplayer.player_gameover(collision);
                                    }
                                    else{//vertical
                                        if(collision.v>0){
                                        myplayer.ground = true;
                                        myplayer.jump_count = 25;
                                        myplayer.jump = 0;
                                        }
                                        else{
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                }
                                break;
                            case 'saw':
                                myplayer.player_gameover();
                                break;
                        }
                    }
                }
                else{
                    if(pairs.bodyA.label == 'hitbox'){
                        switch(pairs.bodyB.label){
                            case 'ground':
                                myplayer.ground = true;
                                myplayer.jump_count = 25;
                                myplayer.jump = 0;
                                break;
                            case 'box':
                                let collision = aabb(myplayer.parts[1].vertices[0], myplayer.parts[1].width, myplayer.parts[1].height, pairs.bodyB.vertices[0], pairs.bodyB.width, pairs.bodyB.height);
                                if(collision.collided){
                                    if(Math.abs(Math.abs(collision.h)-Math.abs(collision.v))<15){//corner
                                        if(pairs.bodyA.position.y>pairs.bodyB.position.y){
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                    else if(Math.abs(collision.v)>Math.abs(collision.h) && collision.h>0){//horizontal
                                            myplayer.player_gameover(collision);
                                    }
                                    else{//vertical
                                        if(collision.v>0){
                                        myplayer.ground = true;
                                        myplayer.jump_count = 25;
                                        myplayer.jump = 0;
                                        }
                                        else{
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                }
                                break;
                            case 'saw':
                                myplayer.player_gameover();
                                break;
                        }
                    }
                    else if(pairs.bodyB.label == 'hitbox'){
                        switch(pairs.bodyA.label){
                            case 'ground':
                                myplayer.ground = true;
                                myplayer.jump_count = 25;
                                myplayer.jump = 0;
                                break;
                            case 'box':
                                let collision = aabb(myplayer.parts[1].vertices[0], myplayer.parts[1].width, myplayer.parts[1].height, pairs.bodyA.vertices[0], pairs.bodyA.width, pairs.bodyA.height);
                                if(collision.collided){
                                    if(Math.abs(Math.abs(collision.h)-Math.abs(collision.v))<15){//corner
                                        if(pairs.bodyB.position.y>pairs.bodyA.position.y){
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                    else if(Math.abs(collision.v)>Math.abs(collision.h) && collision.h>0){//horizontal
                                            myplayer.player_gameover(collision);
                                    }
                                    else{//vertical
                                        if(collision.v>0){
                                        myplayer.ground = true;
                                        myplayer.jump_count = 25;
                                        myplayer.jump = 0;
                                        }
                                        else{
                                            myplayer.player_gameover(collision);
                                        }
                                    }
                                }
                                break;
                            case 'saw':
                                myplayer.player_gameover();
                                break;
                        }
                    }
                }
            }
        }
    );
}
function singleplayer_update(){
    if(sound_bgm.ended)
        sound_bgm.play();
    if(singleplayer_starttime-then<2000)
        countdown_2.play();
    if(singleplayer_starttime-then<1000)
        countdown_1.play();
    if(singleplayer_starttime-then<0)
        countdown_go.play();
    background.draw();
    if((level.chunks.length*1024-level.chunks.length)-camera.pos.x<2048)
        level.append(new Chunk(Vector.create(level.chunks.length*1024-level.chunks.length, 0), chunks[Math.floor(Math.random()*(chunks.length-1))+1]));
    if(Math.floor(camera.pos.x/1024)-1>=0){
        level.trim(Math.floor(camera.pos.x/1024)-1);
    }
    if(then >= singleplayer_starttime && !(gamestate == 'gameover') && !paused){
        Engine.update(engine, dt);
        score += Math.floor(Math.PI*speed_scale*0.5);
        camera.pos.x += speed_scale/1000*dt*300;
        myplayer.update();
    }
    level.draw();
    myplayer.draw();
    countdown_3.update();
    countdown_3.draw();
    countdown_2.update();
    countdown_2.draw();
    countdown_1.update();
    countdown_1.draw();
    countdown_go.update();
    countdown_go.draw();
    score_text.draw(Vector.create(60, 40));
    score_number.text = score.toString();
    score_number.draw(Vector.create(160, 40));
    pause_text.draw(Vector.create(860, 30));
    if(paused){
        singleplayer_starttime += dt;
        paused_animation_interval += dt;
        countdown_3.pause();
        countdown_2.pause();
        countdown_1.pause();
        countdown_go.pause();
        context.save();
        context.fillStyle = "rgba(0, 0, 0, 0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
        if(paused_animation_interval >= 66){
            paused_animation_interval -= 66;
            paused_animation_frame++;
            if(paused_animation_frame>=pause_anim.length){
                paused_animation_frame = 0;
            }
        }
        paused_animation[paused_animation_frame].draw(Vector.create(384+camera.pos.x, 128+camera.pos.y), 0, Vector.create(0.5, 0.5));
    }
    if(gamestate == 'gameover'){
        Engine.update(engine, dt);
        title_you.draw(Vector.create(camera.pos.x+50, camera.pos.y+300), 0, Vector.create(0.5, 0.5));
        title_failed.draw(Vector.create(camera.pos.x+425, camera.pos.y+300), 0, Vector.create(0.5, 0.5));
        playagain_text.draw(Vector.create(750, 690));
    }
}
function multiplayer(){
    console.log('multiplayer');
    var multiplayer_bg_btn = new Button(Vector.create(300, 200), 359, 388, new Sprite(multiplayer_bg, Vector.create(0, 0), 359, 388));
    multiplayer_bg_btn.click = function(){
        
    }
    var multiplayer_2p_btn = new Button(Vector.create(300, 200), 142, 43, new Sprite(multiplayer_2p, Vector.create(0, 0), 142, 43));
    multiplayer_2p_btn.click = function(){
        socket.emit('2p');
    }
    buttons.push(multiplayer_bg_btn);
    buttons.push(multiplayer_2p_btn);
}
function pause(){
    if(paused){
        paused = false;
        countdown_3.resume();
        countdown_2.resume();
        countdown_1.resume();
        countdown_go.resume();
    }
    else{
        paused = true;
        countdown_3.pause();
        countdown_2.pause();
        countdown_1.pause();
        countdown_go.pause();
    }
}
function gameover(){
    gamestate = 'gameover';
    let play_again_btn = new Button(Vector.create(800, 700), 205, 50, new Sprite(failed_end, Vector.create(1, 279), 409, 99));
    play_again_btn.click = function(){
        singleplayer();
    }
    let mainmenu_btn = new Button(Vector.create(760, 40), 253, 61, new Sprite(failed_end, Vector.create(699, 272), 506, 122));
    mainmenu_btn.click = function(){
        mainmenu();
    }
    buttons.push(play_again_btn);
    buttons.push(mainmenu_btn);
}
///////////////////////////////////////////////////////////////////////////
function render(timestamp){
    dt = timestamp - then;
    if(dt>1000)
        dt=0;
    then = timestamp; 
    context.clearRect(0, 0, canvas.width, canvas.height);
    gradient.draw();
    if(gamestate == 'mainmenu')
        mainmenu_update();
    else if(gamestate == 'singleplayer' || gamestate == 'gameover')
        singleplayer_update();
    for(var b=0; b<buttons.length; b++){
        buttons[b].draw();
    }
    requestAnimationFrame(render);
}
//////////////////////////////////////////////////////////
$('document').ready(
    function(){
        socket = io();
        engine.world.gravity.y = 2;
        mainmenu();
        canvas.addEventListener('click', 
            function(event){
                let mouse = getMousePos(canvas, event);
                for(var b=buttons.length-1; b>=0; b--){
                    if(inRect(mouse, buttons[b])){
                        buttons[b].click();
                        break;
                    }
                }
            }
        );
        document.addEventListener('keydown', 
            function(event){
                switch(event.key){
                    case 'ArrowUp':
                        control_up = true;
                        break;
                    case 'ArrowDown':
                        control_down = true;
                        break;
                    case 'ArrowLeft':
                        control_left = true;
                        break;
                    case 'ArrowRight':
                        control_right = true;
                        break;
                    case ' ':
                        if(gamestate == 'gameover')
                            singleplayer();
                        break;
                    case 'f': case 'F':
                        gameFullscreen();
                        break;
                    case 'p' : case 'P':
                        if(gamestate == 'singleplayer')
                            pause();
                        break;
                }
            }
        );
        document.addEventListener('keyup', 
            function(event){
                switch(event.key){
                    case 'ArrowUp':
                        control_up = false;
                        break;
                    case 'ArrowDown':
                        control_down = false;
                        break;
                    case 'ArrowLeft':
                        control_left = false;
                        break;
                    case 'ArrowRight':
                        control_right = false;
                        break;
                }
            }
        );
        if(window.DeviceOrientationEvent)
            window.addEventListener('deviceorientation', 
                function(event){
                    if(event.beta<-orientation_sensity)
                        control_left = true;
                    else if(event.beta>orientation_sensity)
                        control_right = true;
                    else{
                        control_left = false;
                        control_right = false;
                    }
                }
            );
        canvas.addEventListener('touchstart', 
            function(event){
                control_down = false;
                control_up = false;
                touches = event.touches;
                for(let i=0; i<touches.length; i++){
                    if(touches[i].clientX < window.innerWidth/2)
                        control_up = true;
                    else if(touches[i].clientX > window.innerWidth/2)
                        control_down = true;
                }
            }
        );
        document.addEventListener('touchend', 
            function(event){
                control_down = false;
                control_up = false;
                touches = event.touches;
                for(let i=0; i<touches.length; i++){
                    if(touches[i].clientX < window.innerWidth/2)
                        control_up = true;
                    else if(touches[i].clientX > window.innerWidth/2)
                        control_down = true;
                }
            }
        );
		setInterval(function(){if(!paused && speed_scale <2){speed_scale += 0.01;console.log(speed_scale);}}, 1000);
        requestAnimationFrame(render);
    }
);
