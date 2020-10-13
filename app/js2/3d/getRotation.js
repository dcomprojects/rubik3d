import * as THREE from 'three';
import { Vector2, Vector3 } from 'three/build/three.module';

let RotationHelper = function(camera, cube, cubeGroup) {

    let scope = this;

    this.getRotationToNormalizedPosition = (orientation, target) => {
        return scope.blah(orientation, target);
    };

    this.blah = (function() {

        let frontPos = new THREE.Vector3();
        let ihat = new THREE.Vector3(1, 0, 0);
        let jhat = new THREE.Vector3(0, 1, 0);
        let q1 = new THREE.Quaternion();
        let q2 = new THREE.Quaternion();
        let delta = new THREE.Quaternion();
        let deltaUp = new THREE.Quaternion();
        let m = new THREE.Matrix4();

        return (orientation, targetOrientation) => {

            let dtr = THREE.MathUtils.degToRad;
            let rtd = THREE.MathUtils.radToDeg;
            let e = new THREE.Euler(dtr(30), dtr(30));

            let camY = camera.up.clone();
            console.log(camY);
            //camera.localToWorld(camY);
            let camZ = new THREE.Vector3(0,0,-1);
            camera.localToWorld(camZ);

            let camX = new THREE.Vector3();
            camX.crossVectors(camY, camZ); 

            let cubeY = orientation.up.clone();
            cubeGroup.localToWorld(cubeY);

            let cubeZ = orientation.front.clone();
            cubeGroup.localToWorld(cubeZ);

            let frontPos = cubeZ.clone(); 
            camera.worldToLocal(frontPos);

            let cubeX = new THREE.Vector3();
            cubeX.crossVectors(cubeY, cubeZ);

            delta.setFromUnitVectors(cubeX.normalize(), camX.normalize());
            cubeY.applyQuaternion(delta);

            let delta2 = new THREE.Quaternion();
            delta2.setFromUnitVectors(cubeY.normalize(), camY.normalize());
            delta.premultiply(delta2);

            cubeZ.applyQuaternion(delta);
            let delta3 = new THREE.Quaternion();
            delta3.setFromUnitVectors(cubeZ.normalize(), camZ.normalize());

            let yRota, xRota;
            if (frontPos.x >= 0 && frontPos.y >= 0) {
                yRota = 30;
                xRota = -30;
            } else if (frontPos.x < 0 && frontPos.y < 0) {
                yRota = -30;
                xRota = 30;
            } else if (frontPos.x >= 0 && frontPos.y < 0) {
                xRota = 30;
                yRota = 30;
            } else {
                xRota = -30;
                yRota = -30;
            }

            delta.premultiply(delta3)
            .premultiply(new THREE.Quaternion().setFromAxisAngle(camX, dtr(xRota)))
            .premultiply(new THREE.Quaternion().setFromAxisAngle(camY, dtr(yRota)));

            return {
                "delta": delta.clone() 
            };
        };

    }() ); 

};

export {RotationHelper};