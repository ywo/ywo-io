'use strict';
var fs = require('fs');
var PATH = require('path');
var child_process = require('child_process');

var io = {
    /*
    递归处理文件,文件夹
    path 路径
    ignoreFiles 规则 [.js, .css, .html...]
    _floor 层数
    walkHandle 文件,文件夹处理函数

    */
    walkSync: function(rootPath, walkHandle, ignoreFiles, preventDefault) {
        var defaultIgnoreFiles = preventDefault ? [] : [/^\./, /^node_modules$/];
        var _floor = 0;
        rootPath = PATH.normalize(rootPath);
        ignoreFiles = ignoreFiles || [];
        ignoreFiles = defaultIgnoreFiles.concat(ignoreFiles);

        function walk(path) {
            try {
                var stats = fs.statSync(path);
                var data = {
                    path: path
                };
                var i, files, len, _path;
                var j, file;
                if (stats.isDirectory(path)) {
                    data.type = 'directory';
                    try {
                        files = fs.readdirSync(path);
                        $i: for (i = 0, len = files.length; i < len; ++i) {
                            file = files[i];
                            for(j = 0; j < ignoreFiles.length; ++j) {
                                if(ignoreFiles[j].test(file)) {
                                    // console.log(i, j, file);
                                    continue $i;
                                };
                            }
                            _path = PATH.join(path, files[i]);
                            walk(_path);
                        }
                    } catch (err) {
                        console.log('read dir error:', err);
                    }
                } else {
                    data.type = 'file';
                }
                walkHandle(data, _floor);
                _floor++;
            } catch (err) {
                console.log('stat error:', err);
            }
        }
        walk(rootPath);
    },

    mkdirSync: function(path) {
        var i, currentPath = '',
            dirNames = path.split(/[\/\\]/);
        for (i = 0; i < dirNames.length; i++) {
            currentPath += (i === 0 ? '' : '/') + dirNames[i];
            if (fs.existsSync(currentPath)) {
                continue;
            }
            fs.mkdirSync(currentPath);
        }
    },
}
module.exports = io;
