<template>
    <div id="app">
        <fabric :on-save="save" :json="json" :data="data" :type-options="typeOptions"></fabric>
    </div>
</template>

<script>
import 'fabric';
import Fabric from './components';

export default {
    name: 'app',
    components: {
        Fabric
    },
    data () {
        return {
            typeOptions: {
                image: {
                    crossOrigin: 'anonymous'
                }
            },
            json: {
                backgroundImage: {
                    src: 'https://picture-files.oss-cn-qingdao.aliyuncs.com/JIYU/90dcb08d3af5ec213f5ef6fca528964e5cac4348.jpg'
                }
            },
            dom: '#canvas',
            data: {
                type: 'image',
                src: 'https://picture-files.oss-cn-qingdao.aliyuncs.com/JIYU/bf09f159e024526f33b73de8855eb6892ff745c6.jpg',
                _remove: false
            }
        };
    },
    created () {
        // this.json = localStorage.getItem('Kanvas');
    },
    methods: {
        save (json, img) {
            console.log(json);
            console.log(img);
            localStorage.setItem('Kanvas', JSON.stringify(json));
        }
    }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
    margin: 0;
    padding: 0;
}
</style>
