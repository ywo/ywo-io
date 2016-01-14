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
