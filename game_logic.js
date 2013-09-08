/**
* ゲーム内の動作を書くクラス
*/
function GameLogic() {
    this.status = this._doTitle;
    this.progress = GameLogic.Progress.Begin;
        
    this.players = [];
    this.enemies = [];
}

GameLogic.Progress = {};
GameLogic.Progress.Begin = 0;
GameLogic.Progress.Doing = 1;
GameLogic.Progress.Done = 2;


/**
* ゲームロジックの処理ステップを進める
*/
GameLogic.prototype.doStep = function () {
    this.status();
};

GameLogic.prototype._doTitle = function () {
    this._nextStep(this._doInputCommand);
};

GameLogic.prototype._doInputCommand = function () {
    if(this.progress === GameLogic.Progress.Done){
        this._nextStep(this._doBattle);
    }
};

GameLogic.prototype._doBattle = function () {
    if(this.progress === GameLogic.Progress.Done){
        if(this._isButtleEnd()){
            if(this._isWin()){
                this._nextStep(this._doWin);
            }else{
                this._nextStep(this._doLose);
            }
        }else{
            this._nextStep(this._doInputCommand);
        }
    }
};

GameLogic.prototype._doWin = function () {
    
};

GameLogic.prototype._doLose = function () {
};

GameLogic.prototype._isButtleEnd = function () {
};

GameLogic.prototype._isWin = function () {
};

GameLogic.prototype._nextStep = function (nextStatus) {
    this.progress = GameLogic.Progress.Begin;
    this.status = nextStatus;
    this.status();
};

