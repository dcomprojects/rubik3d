import * as THREE from 'three';
import {Cube} from "./cube";
import {render} from "./2d/render";
import {text} from 'd3';

const onload = () => {
	return new Promise(function (resolve, reject) {
		window.addEventListener('load', resolve);
	});
};

onload().then(() => {

	// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
	let vh = window.innerHeight * 0.01;
	// Then we set the value in the --vh custom property to the root of the document
	document.documentElement.style.setProperty('--vh', `${vh}px`);

	// We listen to the resize event
	window.addEventListener('resize', () => {
		// We execute the same script as before
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	});

	text("default3.csv").then((d) => {
		console.log(Cube);
		let cube = new Cube(d);
		render(cube);
	});


	//move to 3d rendering...
	const divCube = document.querySelector("div.cube");

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, divCube.clientWidth / divCube.clientHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(divCube.clientWidth, divCube.clientHeight);


	divCube.appendChild(renderer.domElement);

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({
		color: 0x00ff00
	});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

	var animate = function () {
		requestAnimationFrame(animate);

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		renderer.render(scene, camera);
	};

	animate();
});