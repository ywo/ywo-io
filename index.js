'use strict';
var FS = require('fs');
var PATH = require('path');
var child_process = require('child_process');
const _checkRuler = (ruler, string) => {
    if (Object.prototype.toString.call(ruler) === '[object RegExp]') {
        return ruler.test(string);
    } else {
        return string.indexOf(ruler) > -1;
    }
}
var io = {
    /**
     * 递归处理文件,文件夹
     * @param  {[string]} rootPath       [入口路径]
     * @param  {[function]} walkHandler    [回调函数，回调data和_count两个开参]
     * @param  {[array]} ignoreFiles    [忽略文件，可以使用正则或string: default: 参见defaultIgnoreFiles]
     * @param  {[boolean]} preventDefault [是否忽略默认忽略的文件， default: false]
     * @param  {[number]} maxCount       [最大遍历到的文件，方便调试 default: Infinity]
     */
    walkSync: (rootPath, walkHandler, ignoreFiles, preventDefault, maxCount) => {
        if (typeof rootPath === 'object') {
            let config = rootPath;
            rootPath = config.rootPath;
            walkHandler = config.walkHandler;
            ignoreFiles = config.ignoreFiles;
            preventDefault = config.preventDefault;
            maxCount = config.maxCount;
        }
        let defaultIgnoreFiles = preventDefault ? [] : [/\.svn\/$/, /\.git\/$/, /\.idea\/$/, /.gitignore$/, /.npmignore$/, /node_modules\/$/, /\.DS_Store$/];
        maxCount = maxCount || Infinity;
        rootPath = PATH.resolve(rootPath);
        ignoreFiles = ignoreFiles || [];
        ignoreFiles = defaultIgnoreFiles.concat(ignoreFiles);

        let _count = 0;
        const walk = (path) => {
            let data = {
                type: 'file',
                path: path,
                absolutePath: path,
                relativePath: PATH.relative(rootPath, path),
                rootPath: rootPath + '/',
            };
            try {
                if (FS.statSync(path).isDirectory(path)) {
                    data.type = 'directory';
                    data.path += '/';
                    data.absolutePath += '/';
                    data.relativePath += '/';
                }
            } catch (err) {
                console.log('stat error:', path, err);
            }
            walkHandler(data, _count);
            if (data.type === 'directory') {
                try {
                    let files = FS.readdirSync(path);
                    $i: for (let i = 0, len = files.length; i < len; ++i) {
                        if (_count >= maxCount) {
                            return;
                        }
                        let file = files[i];
                        let absolutePath = PATH.join(path, file);
                        let relativePath = PATH.relative(rootPath, absolutePath);
                        try {
                            if (FS.statSync(absolutePath).isDirectory(absolutePath)) {
                                relativePath += '/';
                            }
                        } catch (err) {}
                        if (absolutePath === process.argv[1]) { // 跳过脚本自己
                            continue;
                        }
                        $j: for (let j = 0, len = ignoreFiles.length; j < len; ++j) {
                            if (_checkRuler(ignoreFiles[j], relativePath)) {
                                // console.log(i, j, absolutePath);
                                continue $i;
                            }
                        }
                        ++_count && walk(absolutePath);
                    }
                } catch (err) {
                    console.log('read dir error:', path, err);
                }
            }
        }
        walk(rootPath);
    },
}
module.exports = io;
