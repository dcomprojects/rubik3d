import * as THREE from 'three';

let RotationHelper = function(camera, cube, cubeGroup) {

    let scope = this;

    this.getRotationToNormalizedPosition = (frontKey, target) => {
        return scope.blah(frontKey, target);
    };

    this.blah = (function() {

        let frontPos = new THREE.Vector3();
        let ihat = new THREE.Vector3(1, 0, 0);
        let jhat = new THREE.Vector3(0, 1, 0);
        let q1 = new THREE.Quaternion();
        let q2 = new THREE.Quaternion();
        let delta = new THREE.Quaternion();
        let m = new THREE.Matrix4();

        return (frontKey, targetOrientation) => {

            let front = cubeGroup.getByKey(frontKey);
            front.getWorldPosition(frontPos);
            frontPos.normalize();

            camera.worldToLocal(frontPos);

            let v = frontPos.dot(ihat);
            let rotationAngle =  (Math.acos(v)); 

            v = frontPos.dot(jhat);
            let tiltAngle = (Math.PI - Math.acos(v)); 

            frontPos.normalize();

            q2.setFromEuler(targetOrientation);
            q1.setFromEuler(new THREE.Euler(tiltAngle, rotationAngle, 0)).normalize();

            delta.multiplyQuaternions(q2, q1.conjugate());

            return {
                "rotation": rotationAngle,
                "tilt": tiltAngle,
                "frontPos": frontPos,
                "delta": delta.clone(),
            };
        };

    }() ); 

};

export {RotationHelper};