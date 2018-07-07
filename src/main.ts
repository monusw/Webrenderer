var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var width = 800;
var height = 800;
var renderer = new WebRenderer(canvas, width, height);

var scene = new Scene();
var camera = new Camera(_Math.radians(45.0), width/height, 10, 80000);
camera.lookAt(new Vec3(2400, 1600, 4000), new Vec3(0, 0, 0), new Vec3(0, 1, 0));

var box = new Box(800, 800, 800);
box.setVertexColor(0, new Color(0xff0000));
box.setVertexColor(1, new Color(0xff00ff));
box.setVertexColor(2, new Color(0x00ffff));
box.setVertexColor(3, new Color(0x0000ff));
// box.wireframe = true;
scene.addChild(box);

var box2 = new Box(600, 600, 600);
// box2.setVertexColor(0, new Color(0xff0000));
// box2.setVertexColor(6, new Color(0x00ff00));
box2.wireframe = true;
box2.setPosition(new Vec3(800, 0, 0));
scene.addChild(box2);

var light = new Light(new Color(0xffffff), Light.POINT_LIGHT);
light.pos.set(2400, 1600, 2400);
light.dir.set(-2400, -1600, -2400);
scene.light = light;

var material1 = new Material();
material1.diffuse = new Color(0xffffff).mulVec3(new Vec3(1.0, 0.5, 0.31));
box.material = material1;

box2.material = material1;

var enableAnimate = true;

canvas.onclick = function (event:any) {
    enableAnimate = !enableAnimate;
}

var texture = TextureLoader.createTexture()
                           .loadDiffuse("assets/container.png")
                           .loadSpecular("assets/container_specular.png")
                           .getTexture();

var material2 = new Material();
material2.diffuse = texture;
material2.shininess = 16;
box.material = material2;

animate();

function animate() {
    if (enableAnimate) {
        box2.rotation.x += 0.01;
        box2.rotation.y += 0.02;
        box.rotation.x += 0.01;
        box.rotation.z += 0.02;
    }
    
    renderer.renderScene(scene, camera);

    requestAnimationFrame(animate);
}
