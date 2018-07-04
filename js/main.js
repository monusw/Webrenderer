"use strict";
var canvas = document.getElementById("canvas");
var width = 800;
var height = 800;
var renderer = new WebRenderer(canvas, width, height);
var scene = new Scene();
var camera = new Camera(_Math.radians(45.0), width / height, 10, 80000);
camera.lookAt(new Vec3(2400, 1600, 4000), new Vec3(0, 0, 0), new Vec3(0, 1, 0));
var box = new Box(800, 800, 800);
box.setVertexColor(0, new Color(0xff0000));
box.setVertexColor(1, new Color(0xff00ff));
box.setVertexColor(2, new Color(0x00ffff));
box.setVertexColor(3, new Color(0x0000ff));
scene.addChild(box);
var box2 = new Box(600, 600, 600);
box2.wireframe = true;
box2.setPosition(new Vec3(800, 0, 0));
scene.addChild(box2);
renderer.renderScene(scene, camera);
animate();
function animate() {
    box2.rotation.x += 0.01;
    box2.rotation.y += 0.02;
    box.rotation.x += 0.005;
    box.rotation.z += 0.005;
    renderer.renderScene(scene, camera);
    requestAnimationFrame(animate);
}
