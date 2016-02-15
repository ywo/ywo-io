var io = require('../index.js');
io.walkSync('./', (data, _count) => {
	console.log('-----------');
	console.log(data);
	console.log(_count);
});

console.log('==================');

io.walkSync(__dirname, (data, _count) => {
	console.log('-----------');
	console.log(data);
	console.log(_count);
});

console.log('==================');

io.walkSync(process.cwd(), (data, _count) => {
	console.log('-----------');
	console.log(data);
	console.log(_count);
});