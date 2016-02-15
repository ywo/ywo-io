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
    /*
    递归处理文件,文件夹
    path 路径
    ignoreFiles 规则 [.js, .css, .html...]
    _floor 层数
    walkHandle 文件,文件夹处理函数

    */
    walkSync: (rootPath, walkHandle, ignoreFiles, preventDefault, maxCount) => {
        if (typeof rootPath === 'object') {
            let config = rootPath;
            rootPath = config.rootPath;
            walkHandle = config.walkHandle;
            ignoreFiles = config.ignoreFiles;
            preventDefault = config.preventDefault;
            maxCount = config.maxCount;
        }

        let defaultIgnoreFiles = preventDefault ? [] : [/\.svn\/$/, /\.git\/$/, /.gitignore$/, /.npmignore$/, /node_modules\/$/, /\.DS_Store$/, ];
        maxCount = maxCount || Infinity;
        rootPath = PATH.resolve(rootPath);
        console.log(rootPath);
        ignoreFiles = ignoreFiles || [];
        ignoreFiles = defaultIgnoreFiles.concat(ignoreFiles);

        let _count = 0;
        const walk = (path) => {
            let data = {
                type: null,
                path: null,
                absolutePath: null,
                relativePath: null,
                rootPath: rootPath + '/',
            };
            try {
                if (FS.statSync(path).isDirectory(path)) {
                    data.type = 'directory';
                    try {
                        let files = FS.readdirSync(path);
                        let filesLen = files.length;
                        if (!filesLen) return;

                        $i: for (let i = 0; i < filesLen; ++i) {
                            if (_count >= maxCount) {
                                return;
                            }
                            let file = files[i];
                            let absolutePath = PATH.join(path, file);
                            let relativePath = PATH.relative(rootPath, absolutePath);
                            try {
                                if (FS.statSync(absolutePath).isDirectory(absolutePath)) {
                                    absolutePath += '/';
                                    relativePath += '/';
                                }
                            } catch (err) {}
                            data.relativePath = relativePath;
                            data.path = data.absolutePath = absolutePath;
                            $j: for (let j = 0, len = ignoreFiles.length; j < len; ++j) {
                                if (_checkRuler(ignoreFiles[j], relativePath)) {
                                    // console.log(i, j, absolutePath);
                                    continue $i;
                                }
                            }
                            walk(absolutePath);
                        }
                    } catch (err) {
                        console.log('read dir error:', path, err);
                    }
                } else {
                    data.type = 'file';
                    data.path = data.absolutePath = path;
                    data.relativePath = PATH.relative(rootPath, data.path);
                }
                walkHandle(data, ++_count);
            } catch (err) {
                console.log('stat error:', path, err);
            }
            if (data.relativePath === null) {
                console.log(data);
            }
        }
        walk(rootPath);
    },

    mkdirSync: function(path) {
        var i, currentPath = '',
            dirNames = path.split(/[\/\\]/);
        for (i = 0; i < dirNames.length; i++) {
            currentPath += (i === 0 ? '' : '/') + dirNames[i];
            if (FS.existsSync(currentPath)) {
                continue;
            }
            FS.mkdirSync(currentPath);
        }
    },
}
module.exports = io;
