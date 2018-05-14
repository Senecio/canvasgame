
var Mind = require('./libs/Mind');
var Class = require('./libs/Class');

// 事件
function Event() {

}

// 发送事件
Event.prototype.Emit = function(name, data) {
    if (this.interested && this.interested[name] instanceof Array) {
        if (this.disableMap && this.disableMap[name]) {
            return;
        }
        var callbacks = this.interested[name];
        for (var i = 0; i < callbacks.length; ++i) {
            callbacks[i](data);
        }
    }
}

// 添加事件回调
Event.prototype.Add = function(name, callback) {

    if (typeof callback !== 'function') {
        console.log('add event need set callback!');
        return;
    }

    if (!this.interested) {
        this.interested = new Object();
    }

    if (!this.interested[name]) {
        this.interested[name] = new Array();
    }

    this.interested[name].push(callback);
}

// 删除事件回调
Event.prototype.Remove = function(name, callback) {
    if (this.interested && this.interested[name] instanceof Array) {
        var callbacks = this.interested[name];
    }
}

// 事件开启
Event.prototype.Enable = function(name) {
    if (this.disableMap && !this.disableMap[name]) {
        this.disableMap[name] = false;
    }
}

// 事件关闭
Event.prototype.Disable = function(name) {
    if (!this.disableMap) {
        this.disableMap = new Object();
    }

    if (!this.disableMap[name]) {
        this.disableMap[name] = true;
    }
}

// 地图对象类
var MapObject = Class.extend(function () {
    this.constructor = function (x, y, z) {
        this.position = new Mind.Vec3(x, y, z);
        this.event = new Event();
    }

    // 设置位置
    this.SetPosition = function(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.event.Emit('changePosition', this);
    }
});

// 箱子
var Box = MapObject.extend(function (parent) {
    this.constructor = function (position, style) {
        parent.constructor.call(this, position.x, position.y, position.z);
        this.style = style;
    }

    
});

// 墙
var Wall = MapObject.extend(function (parent) {
    this.constructor = function (position, style) {
        parent.constructor.call(this, position.x, position.y, position.z);
        this.style = style;
    }
});

// 平面
var Plane = MapObject.extend(function (parent) {
    this.constructor = function (size, position, style) {
        parent.constructor.call(this, position.x, position.y, position.z);
        this.size = size;
        this.style = style;
    }
});

function ObjectManager() {
    this.boxList = [];
    this.wallList = [];
    this.plane = null;
}

ObjectManager.prototype.Generate = function(mapConfig) {
    this.mapConfig = mapConfig;
    
    var mapping = mapConfig.mapping;
    var height = mapping.length;
    var width = mapping[0].length;
    
    this.plane = new Plane({width:width, height:height}, {x:0,y:0,z:0});

    var x, z, flag;
    for (var i = 0; i < height; ++i) {
        for (var j = 0; j < width; ++j) {
            x = -width*0.5+j+0.5;
            z = -height*0.5+i+0.5;
            flag = mapping[i][j];
            if (flag === 1) {
                this.wallList.push(new Wall({x:x,y:0,z:z}));
            } else if (flag === 2) {
                this.boxList.push(new Box({x:x,y:0,z:z}));
            }
        }
    }
}

ObjectManager.prototype.GetBoxList = function() {
    return this.boxList;
}

ObjectManager.prototype.GetWallList = function() {
    return this.wallList;
}

ObjectManager.prototype.GetPlane = function() {
    return this.plane;
}

if (typeof module !== 'undefined') {
    module.exports.ObjectManager = ObjectManager;
    module.exports.Event = Event;
    module.exports.Box = Box;
    module.exports.Wall = Wall;
}
