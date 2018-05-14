
var THREE = require('./libs/three.min.js');

var wallTex = new THREE.TextureLoader().load( './images/wall.jpg' );
var floorTex = new THREE.TextureLoader().load('./images/floor.jpg');
var boxTex = new THREE.TextureLoader().load('./images/box.jpg');

var planeMaterial = new THREE.MeshBasicMaterial({ color: 0xccccff, map: floorTex });

var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: boxTex });
var wallMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd, map: wallTex });

function Scene(canvas, objectMng) {
    //渲染器
    var ctx = canvas.getContext('webgl');
    var renderer = new THREE.WebGLRenderer({ context: ctx});
    //设置渲染器的高度和宽度，如果加上第三个值 false，则按场景大小显示，等比例缩放  
    renderer.setSize(canvas.width, canvas.height, false);
    var barHeight = 30;
    renderer.setViewport(0, barHeight, canvas.width, canvas.height - 2 * barHeight);  
    renderer.setClearColor(new THREE.Color("rgb(255, 0, 0)"));
    renderer.antialias = true;

    var aspect = canvas.width / canvas.height;
    //设置相机（视野，显示口的宽高比，近裁剪面，远裁剪面）
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    //var frustumSize = 26;
    //var camera = new THREE.OrthographicCamera(
    //    frustumSize * aspect / -2, 
    //    frustumSize * aspect / 2, 
    //    frustumSize / 2, 
    //    frustumSize / -2, 
    //    0.1, 
    //    1000
    //);

    var angle = 3.1415926 / 180;
    var pitch = 60 * angle;
    var distance = 10;
    camera.position.y = distance;
    camera.position.z = distance * Math.cos(pitch);
    camera.position.x = -distance * Math.cos(pitch);
    camera.setRotationFromEuler(new THREE.Euler(-pitch, -45 * angle, 0, 'YXZ'));

    this.cameraDistance = distance;

    var scene = new THREE.Scene();
    this.objectMng = objectMng;

    // 地板
    var plane = objectMng.GetPlane();
    scene.add(Plane(plane.size.width, plane.size.height));
    // 墙
    var wallList = objectMng.GetWallList();
    for (var i = 0; i < wallList.length; ++i) {
        scene.add(Wall(wallList[i].position.x, wallList[i].position.z));
    }
    // 箱子
    var boxList = objectMng.GetBoxList();
    var box, mesh;
    for (var i = 0; i < boxList.length; ++i) {
        box = boxList[i];
        mesh = Box(box.position.x, box.position.z, box);
        scene.add(mesh);
    }

    scene.fog= new THREE.Fog(0x000000,0.015,100)

    this.Render = function () {
          renderer.render(scene, camera);
    }

    this.SetCameraDistance = function (scale) {
        var distance = scale * self.cameraDistance;
        camera.position.y = distance;
        camera.position.z = distance * Math.cos(pitch);
        camera.position.x = -distance * Math.cos(pitch);
        self.cameraDistance = distance;
    }
}

function Plane(width, height) { 
    var geometry = new THREE.BoxGeometry(width+2, 0.01, height+2);
    var mesh = new THREE.Mesh(geometry, planeMaterial);
    mesh.position.x = 0;
    mesh.position.z = 0;
    mesh.position.y = 0;

    return mesh;
}

function Wall(x, y) {
    var mesh = new THREE.Mesh(boxGeometry, wallMaterial);
    mesh.position.x = x;
    mesh.position.z = y;
    mesh.position.y = 0.5;

    return mesh;
}

function Box(x, y, box) {
    var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.position.x = x;
    mesh.position.z = y;
    mesh.position.y = 0.5;

    var attachInfo = {
        "Link": function(mesh, box) {
            if (!this.linked) {
                this.onwer = mesh;
                this.target = box;
                this.changePositionCB = function() {
                    this.onwer.position.x = this.target.position.x;
                    this.onwer.position.z = this.target.position.z;
                }.bind(this);
                this.target.event.Add('changePosition', this.changePositionCB);
            }
            this.linked = true;
        },
        "Dislink": function() {
            if (this.linked) {
                this.target.event.Remove('changePosition', this.changePositionCB);
                this.target = undefined;
                this.onwer = undefined;
                this.changePositionCB = undefined;
            }
            this.linked = false;
        },
    }
    mesh.attachInfo = attachInfo;
    // link ..
    mesh.attachInfo.Link(mesh, box);
    return mesh;
}

function Actor() {

}

if (typeof module !== 'undefined')
    module.exports = Scene;