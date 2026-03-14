const canvas = document.getElementById("globeCanvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.PointLight(0xffffff,1.5);
light.position.set(20,20,20);
scene.add(light);

/* Earth */
const geometry = new THREE.SphereGeometry(5,64,64);
const material = new THREE.MeshStandardMaterial({
color:0x0ea5e9,
emissive:0x001122
});
const earth = new THREE.Mesh(geometry,material);
scene.add(earth);

/* Shipment Arc */
const arcMaterial = new THREE.LineBasicMaterial({color:0x00e5ff});
const arcPoints = [];

arcPoints.push(new THREE.Vector3(3,2,4));
arcPoints.push(new THREE.Vector3(0,6,0));
arcPoints.push(new THREE.Vector3(-4,1,-3));

const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
const arc = new THREE.Line(arcGeometry, arcMaterial);
scene.add(arc);

function animate(){
requestAnimationFrame(animate);
earth.rotation.y += 0.0015;
renderer.render(scene,camera);
}
animate();