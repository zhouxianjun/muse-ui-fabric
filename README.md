# fabricjs

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## API

### Attributes

| 属性            | 说明                                                                                        | 类型           | 默认值                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| widths          | 画板宽度                                                                                    | Number         | dom 的大小或者自动适配为全屏                                                                                                                                      |
| height          | 画板高度                                                                                    | Number         | dom 的大小或者自动适配为全屏                                                                                                                                      |
| dom             | canvas 元素选择器                                                                           | String         | 自动生成 canvas                                                                                                                                                   |
| font-family     | 画板支持的字体                                                                              | Array          | ['Arial', 'Helvetica', '宋体', '黑体', '微软雅黑', '楷体', '仿宋', 'Verdana', 'Times New Roman', 'Roboto', 'Open Sans', 'Lato', 'Bellefair', 'Fresca', 'Raleway'] |
| before-save     | 保存之前钩子函数,返回 false 则终止保存                                                      | Funciton       | () => true                                                                                                                                                        |
| on-save         | 保存回调函数                                                                                | Funciton       | -                                                                                                                                                                 |
| json            | 初始化渲染数据(从保存回调中获取)                                                            | String\|Object | -                                                                                                                                                                 |
| data            | 初始化加载元素数据(目前只支持 type 为`image` OR `i-text`;`_remove`属性为该元素不允许被删除) | Array\|Object  | -                                                                                                                                                                 |
| default-options | 每个元素默认配置                                                                            | Object         | {cornerSize: 20} [AllOptions](http://fabricjs.com/docs/fabric.Object.html)                                                                                        |
| type-options    | 不同类型的元素默认配置                                                                      | Object         | [AllOptions](http://fabricjs.com/docs/fabric.Object.html)                                                                                                         |

### Example

```html
<template>
    <div id="app">
        <fabric :on-save="save" :json="json" :data="data"></fabric>
    </div>
</template>

<script>
import 'fabric';
import Fabric from 'muse-ui-fabric';
import 'muse-ui-fabric/dist/muse-ui-fabric.css';
import myImg from '@/assets/my.jpg';

export default {
    name: 'app',
    components: {
        Fabric
    },
    data () {
        return {
            json: null,
            dom: '#canvas',
            data: {
                type: 'image',
                src: myImg,
                _remove: false
            }
        };
    },
    created () {
        this.json = localStorage.getItem('canvas');
    },
    methods: {
        save (json, img) {
            console.log(json);
            console.log(img);
            localStorage.setItem('canvas', JSON.stringify(json));
        }
    }
};
</script>
```
