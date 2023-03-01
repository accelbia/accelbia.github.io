import * as THREE from 'three';
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';

let camera, controls, scene, renderer, composer, glitchPass;
let ico_shell, line;
let counter = 0;

function init() {

    //Scene 
    scene = new THREE.Scene();

    //Camera 
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);

    //Renderer 
    const canvas = document.getElementById('c');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);


    //IcosahedronGeometry Wireframe
    const icosahedron = new THREE.IcosahedronGeometry(1.5, 0);
    const wireframe = new THREE.WireframeGeometry(icosahedron);
    line = new THREE.LineSegments(wireframe);
    line.material.depthTest = true;
    line.material.transparent = true;


    //Glowing material
    const material2 = new THREE.MeshPhongMaterial({
        // color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    ico_shell = new THREE.Mesh(icosahedron, material2);
    // scene.add(ico_shell);
    line.position.x = 0;
    scene.add(line);

    //Light 
    const light = new THREE.DirectionalLight(0x404040);
    light.position.set(-1, -1, 1);
    light.intensity = 2;
    scene.add(light);

    const light2 = new THREE.PointLight(0x404040, 1, 100);
    light2.intensity = 5;
    light2.position.set(1, 1, 0);
    scene.add(light2);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    //Decrease zoom speed as it gets closer to the object
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;


}



//Animation function 
function animate() {
    requestAnimationFrame(animate);
    rerender_canvas();

    var zoom = controls.target.distanceTo(controls.object.position)


    //Controls
    controls.update();

    line.rotation.z += 0.005;
    line.rotation.y -= 0.005;

    ico_shell.rotation.z += 0.005;
    ico_shell.rotation.y -= 0.005;


    renderer.render(scene, camera);
    if (counter < 1000) {
        counter++;
        const geometry = new THREE.SphereGeometry(0.05, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);
        scene.add(star);
        star.position.x = (Math.random() - 0.5) * 100;
        star.position.y = (Math.random() - 0.5) * 100;
        star.position.z = (Math.random() - 0.5) * 100;
    }
    line.material.emissiveIntensity = ((zoom - 0.5) / 10);
    line.material.opacity = ((zoom - 0.5) / 10);

    ico_shell.material.opacity = ((zoom - 0.5) / 10);


};

function rerender_canvas() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

init();
animate();