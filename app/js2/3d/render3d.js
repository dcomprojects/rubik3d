import * as THREE from 'three';

let render3d = () => {

    const divCube = document.querySelector("div.cube");

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(divCube.clientWidth, divCube.clientHeight);

    divCube.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    var material = new THREE.MeshBasicMaterial({
        //color: 0x00ff00
        vertexColors: THREE.FaceColors
    });

    let group = new THREE.Group();

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                let g = geometry.clone();

                g.faces.forEach(f => {
                    f.color.setRGB(Math.random(),
                        Math.random(), Math.random());
                });

                let cube = new THREE.Mesh(g, material);
                cube.position.set(i - 1, j - 1, k - 1);
                group.add(cube);
            }
        }
    }

    scene.add(group);

    camera.position.z = 5;

    var animate = function () {
        requestAnimationFrame(animate);

        group.rotation.x += 0.01;
        group.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();
};

export {
    render3d
};