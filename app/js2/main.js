import {
	text
} from 'd3';
import {
	Cube
} from "./cube";
import {
	CubeHandler2d
} from "./2d/render";
import {
	CubeHandler3d
} from "./3d/render3d";
import {
	Menu, 
	updateFrontFaceAngle
} from "./menu";

const onload = () => {
	return new Promise(function (resolve) {
		window.addEventListener('load', resolve);
	});
};

const initWindowProps = () => new Promise((resolve) => {

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

	resolve();
});

const initCube = () => text("default.csv").then((data) => {
	return new Cube(data);
});

const render = (cube) => {

	return new Promise((resolve, reject) => {
		let ch3d = new CubeHandler3d(cube);
		let ch2d = new CubeHandler2d(cube);

		let orientationFn = () => {
			return ch3d.getOrientationMap();
		};

		ch3d.render3d((e) => {
			updateFrontFaceAngle(ch3d.getFrontFaceAngle());
			ch2d.setFaces(orientationFn);
		});

		ch2d.render(orientationFn);
		resolve();
	});

};

Promise.all([initCube(), onload()]).then(values => {
	initWindowProps();
	render(values[0]);
	new Menu({
		"links": [{
			text: "Scramble",
			fn: (e) => {
				values[0].scramble();
			}
		}]
	});
});