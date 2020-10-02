let RotationHelper = function(camera, cube, cubeGroup) {

    let scope = this;

    this.getRotationToNormalizedPosition = (arg) => {
        console.log(arg);
        return scope.blah(arg);
    };

    this.blah = (function() {

        return (arg) => {
            console.log(`Hello ${arg}`);
            return true;
        };

    }() ); 

};

export {RotationHelper};