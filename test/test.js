var io = require('../index.js');
// console.log = () => {}

io.walkSync('.//', (data, _count) => {
    console.log(_count, data.relativePath);
});

console.log('// 2 ==================');
io.walkSync(__dirname, (data, _count) => {
    console.log(_count, data.relativePath);
});

console.log('// 3 ==================');
io.walkSync(process.cwd(), (data, _count) => {
    console.log(_count, data.absolutePath, data.type);
});

console.log('// 4 ==================');
io.walkSync({
    rootPath: './',
    walkHandler: (data, _count) => {
        console.log(_count, data.path, data.type);
    }
});
