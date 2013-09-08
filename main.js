//地形サイズ
var GROUND_SIZE = 800;
//地形高さ
var GROUND_HEIGHT = 20;
//キャラクターサイズ
var CHARA_SIZE = 100;

//パターンアニメする画像リスト
var update_motion_list = new Array();
//ビルボード対象のリスト
var billboard_list = new Array();


//初期化
$(function(){
    
    var game_logic = new GameLogic();
    
    var stage = Sprite3D.stage();
    var camera = stage.appendChild(
        Sprite3D.create().update()
    );
    var background = camera.appendChild(
        Sprite3D.create()
    );
    var container = camera.appendChild(
        Sprite3D.create()
            .move(0, -400, -1800)
            .rotationX(-40)
            .update()
    );
    
    var ground = container.appendChild(
        Sprite3D.box( GROUND_SIZE, GROUND_HEIGHT, GROUND_SIZE, ".ground_box" )
//        .origin(GROUND_SIZE / 2, GROUND_SIZE / 2, 10)
//        .transformOrigin(GROUND_SIZE / 2, GROUND_SIZE / 2, 10)
        .y(100)
//        .rotationX(90)
        .update()
    );
    
    var player_unit = ground.appendChild(
        Sprite3D.create('.player_unit')
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .move(-180, (CHARA_SIZE / 2) * -1, 120)
            .update()
    );

    var enemy_unit = ground.appendChild(
        Sprite3D.create('.enemy_unit')
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .move(180, (CHARA_SIZE / 2) * -1, 120)
            .update()
    );
    
    var command_list = camera.appendChild(
        Sprite3D.create($('#command').get(0))
            .update()
    );
    
    update_motion_list.push(player_unit);
    update_motion_list.push(enemy_unit);
    billboard_list.push(player_unit);
    billboard_list.push(enemy_unit);
    billboard(-40, 0, 0);
    
    function focus_player(){
        focus_unit(player_unit, -25);
    }
    
    function focus_enemy(){
        focus_unit(enemy_unit, 25);
    }
    
    function focus_unit(unit, roty){
        focus_camera(unit.x() * -1,
                     (unit.y() + ground.y()) * -1,  //視点の高さをユニットにあわせる
                     unit.z() * 4,                  //４倍ズーム
                     0,
                     roty,
                     0);
    }
    
    function pan_field(msec){
        focus_camera(0, 100, -200, 0, 0, 0, msec);
    }
    
    function focus_camera(posx, posy, posz, rotx, roty, rotz, msec){
        if(!Number.isFinite(msec)) msec = 500;
        
        var tween = new TWEEN.Tween( { 
                x: container.x(),
                y: container.y(),
                z: container.z(),
                rotX: container.rotationX(),
                rotY: container.rotationY(),
                rotZ: container.rotationZ()
            } )
            .to( { 
                x: posx,
                y: posy,
                z: posz,
                rotX: rotx,
                rotY: roty,
                rotZ: rotz
            }, msec )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function () {
                var diff_rotx = this.rotX - container.rotationX();
                var diff_roty = this.rotY - container.rotationY();
                var diff_rotz = this.rotZ - container.rotationZ();
                
                container
                    .position(this.x, this.y, this.z)
                    .rotate(diff_rotx, diff_roty, diff_rotz)
                    .update();
                
                billboard(diff_rotx, diff_roty, diff_rotz);
            });
        
        tween.start();
    }
    
    /**
    * 常にカメラ側を向くようにする（ビルボード処理をかける）
    */
    function billboard(rotx, roty, rotz){
        for(var i=0; i<billboard_list.length; i++) {
            billboard_list[i]
                .rotate(rotx * -1, roty * -1, rotz * -1)
                .update();
        }
    }
    
    //buttons init
    $('#button_pan_field').click(pan_field);
    $('#button_focus_player').click(focus_player);
    $('#button_focus_enemy').click(focus_enemy);
    
    /**
    * ドット絵のアニメーションを進める
    */
    function update_motion_step() {
        for(var i=0; i<update_motion_list.length; i++) {
            var pattern = update_motion_list[i].nowPattern;
        }
    }
    
    /**
    * グラフィック更新処理
    */
    function update_draw() {
        TWEEN.update();
        update_motion_step();
    }
    
    pan_field(3000);
    
    setInterval( function() {
        game_logic.doStep();
        update_draw();
    }, 1000 / 30 );
    
});