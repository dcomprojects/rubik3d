
import * as THREE from 'three';

function Animation(duration, axis, angle, targets) {

    this.clock = new THREE.Clock(true);
    this.duration = duration;
    this.qTarget = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    this.targets = targets;
    this.t = 0;
    this.started = false;
}

Animation.prototype.init = function () {

    if (this.started) {
        return;
    }

    this.animationParent = new THREE.Group();

    if (this.targets.length == 1) {

        this.qStart = this.targets[0].parent.quaternion.clone();
        this.targets[0].parent.add(this.animationParent);

    } else {

        let c = this.targets.find(e => e.userData.piece.isCenter());
        this.qStart = c.parent.quaternion.clone();
        c.parent.add(this.animationParent);

    }

    this.parents = {};
    this.targets.forEach(e => {
        this.parents[e.uuid] = e.parent;
        this.animationParent.add(e);
    });

    this.qStart = new THREE.Quaternion();
    this.started = true;
};

Animation.prototype.qauternion = function(q) {
    this.qTarget = q;
    return this;
};

Animation.prototype.tick = function() {

    const elapsed = this.clock.getElapsedTime();
    const pct = elapsed/this.duration;

    THREE.Quaternion.slerp(this.qStart, this.qTarget, this.animationParent.quaternion, Math.min(pct, 1.0));

    if (pct >= 1) {
       this.targets.forEach(e => {
        let p = this.parents[e.uuid];
        p.attach(e);
       });

       this.animationParent.parent.remove(this.animationParent);
    }

    return pct < 1;
};

export {Animation};