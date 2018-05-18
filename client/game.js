//require('./libs/weapp-adapter');
var GameObject = require('./gameObject');
var ObjectManager = GameObject.ObjectManager;
var Visulization = require('./visualization');

console.log(window.innerWidth, window.innerHeight);
canvas.width *= 2;
canvas.height *= 2;


function Init() {

    this.mouse = {
        leftButton: { status: 0, event: "" },
        middleButton: { status: 0, event: "" },
        rightButton: { status: 0, event: "" },
        moving: false,
    };
    var mouse = this.mouse;

    canvas.addEventListener('mousedown', onCanvasMouseDown, false);
    canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    canvas.addEventListener('mouseup', onCanvasMouseUp, false);

    function onCanvasMouseDown(event) {
        if (event.button === 0) {
            mouse.leftButton.status = 1;
            mouse.leftButton.event = "down";
        } else if (event.button === 1) {
            mouse.middleButton = 1;
            mouse.middleButton.event = "down";
        } else if (event.button === 2) {
            mouse.rightButton = 1;
            mouse.rightButton.event = "down";
        }
    }

    function onCanvasMouseMove(event) {
        //获取鼠标指针坐标
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        event.preventDefault();
        var pos = getMousePos(canvas, event);
        mouse.x = (pos.x / canvas.width) * 2 - 1;
        mouse.y = - (pos.y / canvas.height) * 2 + 1;

        mouse.moving = true;
    }

    function onCanvasMouseUp(event) {
        if (event.button === 0) {
            mouse.leftButton.status = 0;
            mouse.leftButton.event = "up";
        } else if (event.button === 1) {
            mouse.middleButton.status = 0;
            mouse.middleButton.event = "up";
        } else if (event.button === 2) {
            mouse.rightButton.status = 0;
            mouse.rightButton.event = "up";
        }
    }

    this.clearMouseEvent = function clearMouseEvent() {
        mouse.leftButton.event = "";
        mouse.middleButton.event = "";
        mouse.rightButton.event = "";

        mouse.moving = false;
    }
}

function DoLogic() {
    this.visulization.DoIntersection(this.mouse);
}

function Draw() {
    this.visulization.Render();
}

function FrameEnd() {
    this.clearMouseEvent();
}

function LoadMap() {
    var map1 = require('./map1.js');
    this.objectMng = new ObjectManager();
    this.objectMng.Generate(map1);
    this.visulization = new Visulization(canvas, this.objectMng);

    //this.objectMng.GetBoxList()[0].SetPosition(0,0,0);

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
    this.Init = Init.bind(this);
    this.DoLogic = DoLogic.bind(this);
    this.Draw = Draw.bind(this);
    this.LoadMap = LoadMap.bind(this);
    this.FrameEnd = FrameEnd.bind(this);
}

var game = new Game();
game.Init();
game.LoadMap();

var mainLoop = function () {

    game.DoLogic();
    game.Draw();

    game.FrameEnd();

    requestAnimationFrame(mainLoop, canvas);
}
mainLoop();

