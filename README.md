## 更新 2016/02/15
 * 增加maxCount遍历若干条资源，方便调试
 * 增加对象形式配置方法
 * 文件夹路径全部以/结尾
 * 增加relativePath, absolutePath回传，data.path === data.absolutePath
 * 默认增加对.DS_Store, .npmignore, .gitignore, .idea 目录过滤

## 遍历文件
```
let ywoIo = require('ywo-io')
ywoIo.walkSync(SRC_PATH, (data, i) => {
    console.log(data, i);
});
```

## 默认会过滤.开头的文件夹和 node_modules, 如果需要扩展, 规则使用正则

```
ywoIo.walkSync(SRC_PATH, (data, i) => {
    console.log(data, i);
}, [/\^tmp$/]);
```

## 忽略默认配置
```
ywoIo.walkSync(SRC_PATH, (data, i) => {
    console.log(data, i);
}, [/\^tmp$/], true);
```
