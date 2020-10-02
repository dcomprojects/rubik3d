
import * as THREE from 'three';

function Animation(duration, axis, angle, targets) {

    this.clock = new THREE.Clock(true);
    this.duration = duration;
    this.qTarget = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    this.targets = targets;
    this.q0 = new THREE.Quaternion();

}

Animation.prototype.qauternion = function(q) {
    this.qTarget = q;
    return this;
};

Animation.prototype.tick = function() {

    const delta = this.clock.getDelta();
    const pct = delta/this.duration;
    this.duration -= delta;

    let q1 = new THREE.Quaternion().slerp(this.qTarget, pct > 1 ? 1 : pct);
    this.qTarget = new THREE.Quaternion().slerp(this.qTarget, pct > 1 ? 0 : 1 - pct);
    this.targets.forEach(t => {
        t.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q1));
    });

    return this.duration > 0;
};

export {Animation};