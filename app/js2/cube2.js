function Cube() {
    Object.assign(this, {
        hello: "my hello"
    });
}

Cube.prototype.yeah = function(arg) {

    console.log(this);
    console.log(this.hello);
    return arg;
};

function another(x) {
    return x * x;
}

//Cube.prototype.yeah.bind(Cube.prototype.yeah, Cube);

export {Cube, another};