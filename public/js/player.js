function Player(pos, width, height, name){
    let hitbox = new Rectangle(Vector.create(pos.x+width/2, pos.y+height/2), width, height, {label: 'hitbox', isSensor: false}, null);
    hitbox.width = width;
    hitbox.height = height;
    hitbox.draw = function(){
        context.save();
        context.fillStyle = 'gray';
        let camera_rotated = Vector.rotate(camera.pos, 0);
        context.translate(hitbox.vertices[0].x, hitbox.vertices[0].y);
        context.rotate(hitbox.angle);
        context.fillRect(-camera_rotated.x, -camera_rotated.y, width, height);
        context.restore();
    }
    
    let hitbox_lower = new Rectangle(Vector.create(hitbox.position.x, hitbox.position.y+hitbox.height/2-width/2), height, width, {label: 'hitbox_lower', isSensor: true}, null);
    hitbox_lower.width = height;
    hitbox_lower.height = width;
    hitbox_lower.draw = function(){
        context.save();
        context.fillStyle = 'gray';
        let camera_rotated = Vector.rotate(camera.pos, 0);
        context.translate(hitbox_lower.vertices[0].x, hitbox_lower.vertices[0].y);
        context.rotate(hitbox_lower.angle);
        context.fillRect(-camera_rotated.x, -camera_rotated.y, height, width);
        context.restore();
    }
    
    let player_body = new Rectangle(hitbox.position, 12, 60, {isStatic: true, isSensor: true}, new Sprite(body, Vector.create(0, 0), 25, 120));
    let player_head = new Circle(hitbox.position, 18, {isStatic: true, isSensor: true}, new Sprite(head, Vector.create(0, 0), 50, 50));
    let player_lefthand_up = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_lefthand_down = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_righthand_up = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_righthand_down = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_leftleg_up = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_leftleg_down = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_rightleg_up = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    let player_rightleg_down = new Rectangle(hitbox.position, 10, 30, {isStatic: true, isSensor: true}, new Sprite(limbs, Vector.create(0, 0), 20, 60));
    
    let player = Body.create({parts: [hitbox, hitbox_lower]});
    Body.set(player, 'label', 'player');
    player.lower = false;
    player.ground = true;
	player.jump = false;
	player.jump_count = 25;
    player.animations = [
        {name: 'stand', interval: 33},
        {name: 'run', interval: 33},
        {name: 'lowdown', interval: 16},
        {name: 'jump', interval: 16},
        {name: 'roll', interval: 33},
        {name: 'fall', interval: 16}
    ];
    player.animation = 'stand';
    player.animation_interval = 0;
    player.frame = 0;
    player.stand_sprite = [];
    for(let i=0; i<stand.length; i++)
        player.stand_sprite.push(new Sprite(stand[i], Vector.create(0, 0), 28, 110));
    player.run_sprite = [];
    for(let i=0; i<run.length; i++)
        player.run_sprite.push(new Sprite(run[i], Vector.create(0, 0), 72, 108));
    player.lowdown_sprite = new Sprite(lowdown, Vector.create(0, 0), 93, 51);
    player.jump_sprite = new Sprite(jump, Vector.create(0, 0), 68, 94);
    player.roll_sprite = [];
    for(let i=0; i<roll.length; i++)
        player.roll_sprite.push(new Sprite(roll[i], Vector.create(0, 0), 81, 79));
    player.fall_sprite = new Sprite(fall, Vector.create(0, 0), 79, 104);
    
    player.update = function(){
        if(then >= singleplayer_starttime){
            if(player.ground)
                player.animation = 'run';
            let vel = Vector.create(speed_scale/1000*dt*300, player.velocity.y);
            Body.setAngularVelocity(player, 0);
            if(control_right)
                vel.x += 2;
            if(control_left){
                //vel.x -= 2;
				vel.x  -= 2+speed_scale/1000*dt*300;
			}
            if(control_up){
                if(player.ground){
                    player.animation = 'jump';
                    sound_jump.play();
                    sound_jump.muted = !sound_enabled;
                    vel.y = -4*Math.PI;
                    player.jump_count--;
                    player.ground = false;
                }
                else{
                    if(player.jump_count && !player.jump){
                        player.animation = 'jump';
                        sound_jump.muted = !sound_enabled;
                        vel.y = -4*Math.PI;
                        player.jump_count--;
                    }
                    else{
                        player.jump = 1;
                        if(player.animation != 'fall'){
                            player.animation = 'roll';
                        }
                    }
                }
            }
            else{
                if(!player.ground){
                    player.jump = 1;
                    if(player.animation != 'fall'){
                        player.animation = 'roll';
                    }
                }
            }
            if(control_down && player.ground){
                Body.set(player.parts[1], 'isSensor', true);
                Body.set(player.parts[2], 'isSensor', false);
                player.lower = true;
                player.animation = 'lowdown';
            }
            else{
                Body.set(player.parts[1], 'isSensor', false);
                Body.set(player.parts[2], 'isSensor', true);
                player.lower = false;
            }
            Body.setVelocity(player, vel);
            Body.setVelocity(player_body, vel);
            Body.setVelocity(player_head, vel);
            Body.setPosition(player, Vector.create(Common.clamp(player.position.x, camera.pos.x+100, camera.pos.x+500), player.position.y));
            if(player.position.y>650)
                Body.translate(player, Vector.create(0, 650-player.position.y));
            if(!(gamestate == 'gameover')){
                Body.setPosition(player_body, Vector.add(player.parts[1].position, Vector.create(5, -10)));
                Body.setPosition(player_head, Vector.create(player_body.position.x, player_body.position.y-player_body.height/2-8));
                Body.setPosition(player_lefthand_up, Vector.create(player_body.position.x-14, player_body.position.y-12));
                Body.setAngle(player_lefthand_up, 0.85);
                Body.setPosition(player_lefthand_down, Vector.create(player_body.position.x-16, player_body.position.y+8));
                Body.setAngle(player_lefthand_down, -0.4);
                Body.setPosition(player_righthand_up, Vector.create(player_body.position.x+8, player_body.position.y-12));
                Body.setAngle(player_righthand_up, -0.4);
                Body.setPosition(player_righthand_down, Vector.create(player_body.position.x+24, player_body.position.y-6));
                Body.setAngle(player_righthand_down, 1);
                Body.setPosition(player_leftleg_up, Vector.create(player_body.position.x-10, player_body.position.y+40));
                Body.setAngle(player_leftleg_up, 0.4);
                Body.setPosition(player_leftleg_down, Vector.create(player_body.position.x-20, player_body.position.y+50));
                Body.setAngle(player_leftleg_down, 1.6);
                Body.setPosition(player_rightleg_up, Vector.create(player_body.position.x+16, player_body.position.y+36));
                Body.setAngle(player_rightleg_up, -1);
                Body.setPosition(player_rightleg_down, Vector.create(player_body.position.x+24, player_body.position.y+46));
                Body.setAngle(player_rightleg_down, -0.1);
            }
        }
    }
    player.draw = function(){
        /*if(player.lower)
            player.parts[2].draw();
        else
            player.parts[1].draw();*/
        if(!paused)
            player.animation_interval += dt;
        if(gamestate == 'singleplayer'){
            switch(player.animation){
                case 'stand':
                    if(!paused)
                        if(player.animation_interval >= player.animations[0].interval){
                            player.animation_interval -= player.animations[0].interval;
                            player.frame++;
                            if(player.frame>=stand.length)
                                player.frame = 0;
                        }
                    player.stand_sprite[player.frame].draw(player.parts[1].vertices[0], 0, Vector.create(1.3, 1.3));
                    break;
                case 'run':
                    if(!paused)
                        if(player.animation_interval >= player.animations[1].interval){
                            player.animation_interval -= player.animations[1].interval;
                            player.frame++;
                            if(player.frame>=run.length)
                                player.frame = 0;
                        }
                    player.run_sprite[player.frame].draw(Vector.add(player.parts[1].vertices[0], Vector.create(-10, 0)), 0, Vector.create(1.3, 1.3));
                    break;
                case 'lowdown':
                    player.frame = 0;
                    player.animation_interval = 0;
                    player.lowdown_sprite.draw(player.parts[2].vertices[0], 0, Vector.create(1.4, 1.4));
                    break;
                case 'jump':
                    player.frame = 0;
                    player.animation_interval = 0;
                    player.jump_sprite.draw(player.parts[1].vertices[0], 0, Vector.create(1.3, 1.3));
                    break;
                case 'roll':
                    if(!paused)
                        if(player.animation_interval >= player.animations[4].interval){
                            player.animation_interval -= player.animations[4].interval;
                            player.frame++;
                            if(player.frame>=roll.length){
                                player.animation = 'fall';
                                player.frame = 0;
                            }
                        }
                    player.roll_sprite[player.frame].draw(Vector.add(player.parts[1].vertices[0], Vector.create(-20, 0)), 0, Vector.create(1.3, 1.3));
                    break;
                case 'fall':
                    player.frame = 0;
                    player.animation_interval = 0;
                    player.fall_sprite.draw(Vector.add(player.parts[1].vertices[0], Vector.create(-20, 0)), 0, Vector.create(1.3, 1.3));
                    break;
            }
        }
        else{
            player_body.draw();
            player_head.draw();
            player_lefthand_up.draw();
            player_lefthand_down.draw();
            player_righthand_up.draw();
            player_righthand_down.draw();
            player_leftleg_up.draw();
            player_leftleg_down.draw();
            player_rightleg_up.draw();
            player_rightleg_down.draw();
        }
    }
    player.player_gameover = function(collision){
        Events.off(engine, 'collisionActive');
        let idx = Math.floor(Math.random()*sound_hit.length);
        sound_hit[idx].play();
        sound_hit[idx].muted = !sound_enabled;
        sound_youfailed.play();
        sound_youfailed.muted = !sound_enabled;
        //console.log(collision);
        Body.set(player.parts[1], 'isSensor', true);
        Body.set(player.parts[2], 'isSensor', true);
        Body.setStatic(player_body, false);
        Body.set(player_body, 'isSensor', false);
        Body.setStatic(player_head, false);
        Body.set(player_head, 'isSensor', false);
        Body.setStatic(player_lefthand_up, false);
        Body.set(player_lefthand_up, 'isSensor', false);
        Body.setStatic(player_lefthand_down, false);
        Body.set(player_lefthand_down, 'isSensor', false);
        Body.setStatic(player_righthand_up, false);
        Body.set(player_righthand_up, 'isSensor', false);
        Body.setStatic(player_righthand_down, false);
        Body.set(player_righthand_down, 'isSensor', false);
        Body.setStatic(player_leftleg_up, false);
        Body.set(player_leftleg_up, 'isSensor', false);
        Body.setStatic(player_leftleg_down, false);
        Body.set(player_leftleg_down, 'isSensor', false);
        Body.setStatic(player_rightleg_up, false);
        Body.set(player_rightleg_up, 'isSensor', false);
        Body.setStatic(player_rightleg_down, false);
        Body.set(player_rightleg_down, 'isSensor', false);
        gameover();
    }
    World.add(engine.world, [player, player_body, player_head, player_lefthand_up, player_lefthand_down, player_righthand_up, player_righthand_down, player_leftleg_up, player_leftleg_down, player_rightleg_up, player_rightleg_down]);
    return player;
}
