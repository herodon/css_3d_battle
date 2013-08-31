$(function(){
    var stage = Sprite3D.stage();
    var camera = stage.appendChild(
        Sprite3D.create()
    );
    var container = camera.appendChild(
        Sprite3D.create('battle_container')
            .rotationX(70)
            .update()
    );
    setInterval( function() {
        container
            .rotate(0, -1,0)
            .update();
    }, 1000 / 60 );
});