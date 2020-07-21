const test = require('ava');
const c = require('../app/js2/cube2');

test('foo', t => {
    console.log(c.Cube);
    let cube = new c.Cube();
    t.is(cube.yeah("blah"), "blah");
});

test('blah', t => {
    let fn = c.another;
    t.is(fn(3), 9);
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});