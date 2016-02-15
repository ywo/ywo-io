var io = require('../index.js');
console.log('// 1 ==================');
io.walkSync('./', (data, _count) => {
    console.log('-----------');
    console.log(data);
    console.log(_count);
});

console.log('// 2 ==================');
io.walkSync(__dirname, (data, _count) => {
    console.log('-----------');
    console.log(data);
    console.log(_count);
});

console.log('// 3 ==================');
io.walkSync(process.cwd(), (data, _count) => {
    console.log('-----------');
    console.log(data);
    console.log(_count);
});

console.log('// 4 ==================');
io.walkSync({
    rootPath: './',
    walkHandler: (data, _count) => {
        console.log('-----------');
        console.log(data);
        console.log(_count);
    }
});
