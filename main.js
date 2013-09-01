var GROUND_SIZE = 800;
var GROUND_HEIGHT = 20;
var CHARA_SIZE = 100;

$(function(){
    var stage = Sprite3D.stage();
    var camera = stage.appendChild(
        Sprite3D.create().update()
    );
    var container = camera.appendChild(
        Sprite3D.create('.battle_container')
            .move(0, 100, -200)
            .update()
    );
    
//    var ground = container.appendChild(
//        Sprite3D.create('.ground')
//            .origin(GROUND_SIZE / 2, GROUND_SIZE / 2)
//            .transformOrigin(GROUND_SIZE / 2, GROUND_SIZE / 2)
//            .move(0, 100, 0)
//            .rotationX(90)
//            .update()
//    );
    
    var ground = container.appendChild(
        Sprite3D.box( GROUND_SIZE, GROUND_SIZE, 20, ".ground_box" )
//        .origin(GROUND_SIZE / 2, GROUND_SIZE / 2, 10)
//        .transformOrigin(GROUND_SIZE / 2, GROUND_SIZE / 2, 10)
        .y(100)
        .rotationX(90)
        .update()
    );
    
    var player_unit = ground.appendChild(
        Sprite3D.create('.player_unit')
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE)
//            .position((GROUND_SIZE / 2) - (CHARA_SIZE / 2), (GROUND_SIZE / 2) - CHARA_SIZE, 0)
//            .move(GROUND_SIZE * -0.25, 0, 20)
            .move(-280, 0, 20)
            .rotation(270, 0, 0)
            .update()
    );

    var enemy_unit = ground.appendChild(
        Sprite3D.create('.enemy_unit')
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE)
//            .position((GROUND_SIZE / 2) - (CHARA_SIZE / 2), (GROUND_SIZE / 2) - CHARA_SIZE, 0)
//            .move(GROUND_SIZE * 0.25, 0, 20)
            .move(280, 0, 20)
            .rotation(270, 0, 0)
            .update()
    );
    
    function focus_player(){
        console.log(player_unit.z());
        focus_camera(player_unit.x(),
                     player_unit.y(),
                     250,
                     25);
    }
    
    function focus_enemy(){
        focus_camera(enemy_unit.x(),
                     enemy_unit.y(),
                     250,
                     -25);
    }
    
    function pan_field(){
        focus_camera(0, 100, -200, 0);
    }
    
    function focus_camera(posx, posy, posz, angle){
        var tween = new TWEEN.Tween( { 
                x: container.x(),
                y: container.y(),
                z: container.z(),
                rotY: container.rotationY()
            } )
            .to( { 
                x: posx,
                y: posy,
                z: posz,
                rotY: angle
            }, 500 )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function () {
                var rot = this.rotY - container.rotationY();
                
                container
                    .position(this.x, this.y, this.z)
                    .rotate(0, rot, 0)
                    .update();
                
                billboard(0, rot, 0);
            });
        
        tween.start();
    }
    
    function billboard(rotx, roty, rotz){
        //billboard
        player_unit
            .rotate(rotx * -1, roty * -1, rotz * -1)
            .update();
        
        enemy_unit
            .rotate(rotx * -1, roty * -1, rotz * -1)
            .update();
    }
    
    //buttons init
    $('#button_pan_field').click(pan_field);
    $('#button_focus_player').click(focus_player);
    $('#button_focus_enemy').click(focus_enemy);
    
    //update
    setInterval( function() {
//        container
//            .rotate(0, 1, 0)
//            .update();
//        billboard(0, 1, 0);
        TWEEN.update();
    }, 1000 / 30 );
    
});