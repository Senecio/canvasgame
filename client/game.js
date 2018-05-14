//require('./libs/weapp-adapter');
var GameObject = require('./gameObject');
var ObjectManager = GameObject.ObjectManager;
var Visulization = require('./visualization');

console.log(window.innerWidth , window.innerHeight);
canvas.width *= 2;
canvas.height *= 2;

function DoLogic() {

}

function Draw() {
    this.visulization.Render();
}

function LoadMap() {
    var map1 = require('./map1.js');
    this.objectMng = new ObjectManager();
    this.objectMng.Generate(map1);
    this.visulization = new Visulization(canvas, this.objectMng);

    this.objectMng.GetBoxList()[0].SetPosition(0,0,0);

    /*
    this.touchCmd = "none";
    this.length = 0;

    this.lastV1x = 0;
    this.lastV1y = 0;
    this.lastV2x = 0;
    this.lastV2y = 0;
    
    var self = this;
    wx.onTouchStart(function (event) {
        //console.log("->1", event);
        if (event.touches.length === 2) {
            self.touchCmd = "scale";
            self.lastV1x = event.touches[0].clientX;
            self.lastV1y = event.touches[0].clientY;
            self.lastV2x = event.touches[1].clientX;
            self.lastV2y = event.touches[1].clientY;
        }
        //console.log("->2", changedTouches);
        //console.log("->3", timeStamp);
    });

    wx.onTouchMove(function (event) {
        if (self.touchCmd === "scale" && event.touches.length === 2) {
            var v1x = event.touches[0].clientX;
            var v1y = event.touches[0].clientY;
            var v2x = event.touches[1].clientX;
            var v2y = event.touches[1].clientY;

            var lastLength = Distance(self.lastV1x, self.lastV1y, self.lastV2x, self.lastV2y);
            var newLength = Distance(v1x, v1y, v2x, v2y);

            var newScale = lastLength / newLength;

            self.lastV1x = v1x;
            self.lastV1y = v1y;
            self.lastV2x = v2x;
            self.lastV2y = v2y;

            self.visulization.SetCameraDistance(newScale);
            console.log("->2", newScale);
        }
    })
    */
}

function Game() {
    this.DoLogic = DoLogic.bind(this);
    this.Draw = Draw.bind(this);
    this.LoadMap = LoadMap.bind(this);
}

var game = new Game();
game.LoadMap();

var mainLoop = function() {

    game.DoLogic();
    game.Draw();

    requestAnimationFrame(mainLoop, canvas);
}
mainLoop();

