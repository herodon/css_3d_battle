//地形サイズ
var GROUND_SIZE = 600;
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
    
    var stage = Sprite3D.stage($('#root').get(0));
    var camera = stage.appendChild(
        Sprite3D.create().update()
    );
    var container = camera.appendChild(
        Sprite3D.create()
            .move(0, -200, -450)
            .rotationX(-30)
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
            .tileSize(CHARA_SIZE,CHARA_SIZE)
            .tilePosition(1,1)
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .move(-180, (CHARA_SIZE / 2) * -1, 120)
            .update()
    );
    init_motion(player_unit);

    var enemy_unit = ground.appendChild(
        Sprite3D.create('.enemy_unit')
            .tileSize(CHARA_SIZE,CHARA_SIZE)
            .tilePosition(1,1)
            .origin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .transformOrigin(CHARA_SIZE / 2, CHARA_SIZE / 2)
            .move(180, (CHARA_SIZE / 2) * -1, 120)
            .rotationY(180)
            .update()
    );
    init_motion(enemy_unit);
    
    update_motion_list.push(player_unit);
    update_motion_list.push(enemy_unit);
    billboard_list.push(player_unit);
    billboard_list.push(enemy_unit);
    billboard(-30, 0, 0);
    
    function focus_player(){
        focus_unit(player_unit, -25);
    }
    
    function focus_enemy(){
        focus_unit(enemy_unit, 25);
    }
    
    function focus_unit(unit, roty){
        console.log(unit.y());
        focus_camera(unit.x() * -1,
//                     (unit.y() + ground.y()) * -1,  //視点の高さをユニットにあわせる
                     unit.y() * -0.5,
                     unit.z() * 3,
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
    
    //モーション系処理初期化
    function init_motion(unit){
        unit.now_motion = "neutral";
        unit._motion_count = 0;
        unit.change = function (next_motion) {
            this.now_motion = next_motion;
            this._motion_count = 0;
        }
        unit.step_motion = function () {
            if(this.now_motion == "neutral"){
                var t = this._motion_count % 20;
                if(t==0 || t==19){
                    this.tilePosition(0,0);
                }else if(t==10){
                    this.tilePosition(1,0);
                }
                if(this._motion_count >= 20) this._motion_count = 0;
            }else if(this.now_motion == "attack"){
                var t = this._motion_count % 60;
                if(t < 20){
                    this.tilePosition(0,1);
                }else if(t < 40){
                    this.tilePosition(1,1);
                }else if(t < 60){
                    this.tilePosition(2,1);
                }
                if(this._motion_count >= 59) this.change("neutral");
            }else{
                var t = this._motion_count % 4;
                if(t <= 1){
                    this.tilePosition(0,2);
                }else if(t <= 3){
                    this.tilePosition(1,2);
                }
                if(this._motion_count >= 60) this.change("neutral");
            }
            this._motion_count++;
        }
    }
    
    /**
    * ドット絵のアニメーションを進める
    */
    function update_motion_step() {
        for(var i=0; i<update_motion_list.length; i++) {
            var unit = update_motion_list[i];
            unit.step_motion();
        }
    }
    
    /**
    * グラフィック更新処理
    */
    function update_draw() {
        TWEEN.update();
        update_motion_step();
    }
    
    //buttons init
    $('#button_pan_field').click(pan_field);
    $('#button_focus_player').click(focus_player);
    $('#button_focus_enemy').click(focus_enemy);
    
    $('#button_motion_neutral_player').click(function(){
        player_unit.change("neutral");
    });
    $('#button_motion_attack_player').click(function(){
        player_unit.change("attack");
    });
    $('#button_motion_damage_player').click(function(){
        player_unit.change("damage");
    });
    
    //起動直後のズーム演出
    pan_field(3000);
    
    setInterval( function() {
        game_logic.doStep();
        update_draw();
    }, 1000 / 30 );
    
});