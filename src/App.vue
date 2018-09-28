<template>
    <div id="app">
        <fabric :on-save="save" :json="json" :data="data"></fabric>
    </div>
</template>

<script>
import 'fabric';
import Fabric from './components';
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
        this.json = localStorage.getItem('Kanvas');
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
