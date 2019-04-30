<template>
    <div>
        <div class="poptip">
            <file-select @change="changeFile" style="display: inline-block;">
                <mu-button icon color="primary">
                    <mu-icon value="add_photo_alternate"></mu-icon>
                </mu-button>
            </file-select>
            <mu-button icon color="primary" @click="addText()">
                <mu-icon value="text_fields"></mu-icon>
            </mu-button>
            <mu-button icon color="primary" @click="upperLayer" :disabled="!!!selection">
                <mu-icon value="keyboard_arrow_up"></mu-icon>
            </mu-button>
            <mu-button icon color="primary" @click="lowerLayer" :disabled="!!!selection">
                <mu-icon value="keyboard_arrow_down"></mu-icon>
            </mu-button>
            <mu-button icon color="primary" @click="openBackground = true">
                <mu-icon value="layers"></mu-icon>
            </mu-button>
            <mu-button icon color="error" @click="removeActive" :disabled="!!!selection || selection._remove === false">
                <mu-icon value="delete"></mu-icon>
            </mu-button>
            <mu-button icon color="primary" @click="save">
                <mu-icon value="save"></mu-icon>
            </mu-button>
        </div>
        <mu-bottom-sheet :open.sync="openBackground" :overlay="true" style="opacity: 0.8">
            <mu-list>
                <mu-list-item button ref="backgroundColor" @click="openBackgroundColor">
                    <mu-list-item-action>
                        <mu-icon value="color_lens" color="primary"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>背景颜色</mu-list-item-title>
                </mu-list-item>
                <mu-list-item button>
                    <mu-list-item-action>
                        <mu-icon value="image" color="primary"></mu-icon>
                    </mu-list-item-action>
                    <file-select @change="changeBackgroundImage">
                        <mu-button icon style="width: unset; height: unset; padding: 0; border-radius: 0;">
                            <mu-list-item-title>背景图片</mu-list-item-title>
                        </mu-button>
                    </file-select>
                </mu-list-item>
                <mu-list-item v-if="!!currentBackgroundImg">
                    <label style="width: 40px;">圆角</label>
                    <mu-slider style="margin-bottom: 0;" v-model="backgroundImageRadius" :max="backgroundImageRadiusMax" @change="setBackgroundProp"></mu-slider>
                </mu-list-item>
                <mu-list-item v-if="!!currentBackgroundImg">
                    <label style="width: 40px;">透明</label>
                    <mu-slider style="margin-bottom: 0;" v-model="backgroundImageOpacity" @change="setBackgroundProp({opacity: Number($event) / 100})"></mu-slider>
                </mu-list-item>
                <mu-list-item button v-if="!!currentBackgroundImg" @click="deleteBackgroundImg">
                    <mu-list-item-action>
                        <mu-icon value="delete" color="primary"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>删除背景图片</mu-list-item-title>
                </mu-list-item>
            </mu-list>
        </mu-bottom-sheet>
        <mu-popover cover :open.sync="openColor" :trigger="trigger">
            <sketch ref="colors" v-model="colors"></sketch>
        </mu-popover>
        <mu-popover :open="openSettings" :trigger="settingsTrigger" style="opacity: 0.8">
            <mu-list>
                <mu-list-item v-if="hasRadius">
                    <label style="width: 40px;">圆角</label>
                    <mu-slider style="margin-bottom: 0; min-width: 80px;" v-model="currentRadius" :max="radiusMax" @change="changeRadius"></mu-slider>
                </mu-list-item>
                <mu-list-item>
                    <label style="width: 40px;">透明</label>
                    <mu-slider style="margin-bottom: 0; min-width: 80px;" v-model="c_opacity" @change="c_opacityHandler"></mu-slider>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">字体</label>
                    <mu-select full-width v-model="c_fontFamily" @change="c_fontFamilyHandler">
                        <mu-option v-for="option in fontFamily" :key="option" :label="option" :value="option"></mu-option>
                    </mu-select>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">大小</label>
                    <mu-slider style="margin-bottom: 0;" v-model="c_fontSize" :max="150" @change="c_fontSizeHandler"></mu-slider>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">对齐</label>
                    <mu-row fill>
                        <mu-col span="3">
                            <mu-radio v-model="currentTextAlign" value="left" uncheck-icon="format_align_left" checked-icon="format_align_left"></mu-radio>
                        </mu-col>
                        <mu-col span="3">
                            <mu-radio v-model="currentTextAlign" value="center" uncheck-icon="format_align_center" checked-icon="format_align_center"></mu-radio>
                        </mu-col>
                        <mu-col span="3">
                            <mu-radio v-model="currentTextAlign" value="right" uncheck-icon="format_align_right" checked-icon="format_align_right"></mu-radio>
                        </mu-col>
                        <mu-col span="3">
                            <mu-radio v-model="currentTextAlign" value="justify" uncheck-icon="format_align_justify" checked-icon="format_align_justify"></mu-radio>
                        </mu-col>
                    </mu-row>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">颜色</label>
                    <div class="color-view" id="fontColor" @click="openFontColor" :style="`background-color: ${rgba}`"></div>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">样式</label>
                    <mu-row fill>
                        <mu-col span="2">
                            <mu-checkbox v-model="c_fontWeight" uncheck-icon="format_bold" checked-icon="format_bold" @change="setActiveProp('fontWeight', $event ? 'bold' : 'normal')"></mu-checkbox>
                        </mu-col>
                        <mu-col span="2">
                            <mu-checkbox v-model="c_fontStyle" uncheck-icon="format_italic" checked-icon="format_italic" @change="setActiveProp('fontStyle', $event ? 'italic' : 'normal')"></mu-checkbox>
                        </mu-col>
                        <mu-col span="2">
                            <mu-checkbox v-model="c_underline" uncheck-icon="format_underlined" checked-icon="format_underlined" @change="setActiveProp('underline', $event)"></mu-checkbox>
                        </mu-col>
                        <mu-col span="2">
                            <mu-checkbox v-model="c_linethrough" uncheck-icon="format_strikethrough" checked-icon="format_strikethrough" @change="setActiveProp('linethrough', $event)"></mu-checkbox>
                        </mu-col>
                        <mu-col span="2">
                            <mu-checkbox v-model="c_overline" uncheck-icon="format_underlined" checked-icon="format_underlined" @change="setActiveProp('overline', $event)"></mu-checkbox>
                        </mu-col>
                    </mu-row>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">行高</label>
                    <mu-slider style="margin-bottom: 0;" :step="0.1" :min="0.1" :max="10" v-model="c_lineHeight" @change="c_lineHeightHandler"></mu-slider>
                </mu-list-item>
                <mu-list-item v-if="hasText">
                    <label style="width: 40px;">间距</label>
                    <mu-slider style="margin-bottom: 0;" :min="-100" :max="800" v-model="c_charSpacing" @change="c_charSpacingHandler"></mu-slider>
                </mu-list-item>
            </mu-list>
        </mu-popover>
    </div>
</template>
<script>
import uuid from 'uuid/v4';
import pify from 'pify';
import FileSelect from '@/components/file-select.vue';
import { Sketch } from 'vue-color';
const propHandler = function (val, k, t) { this.setActiveProp(k, val); };
const styleHandler = function (val, k, t) {
    const s = {};
    s[k] = val;
    this.setActiveStyle(s);
};
const CHANGE_PROP_FIELD = {
    fontFamily: { handler: propHandler, type: 'i-text' },
    fontSize: { handler: propHandler, type: 'i-text' },
    charSpacing: { handler: propHandler, type: 'i-text' },
    lineHeight: { handler: propHandler, type: 'i-text' },
    underline: { handler: propHandler, type: 'i-text' },
    linethrough: { handler: propHandler, type: 'i-text' },
    overline: { handler: propHandler, type: 'i-text' },
    opacity: {
        get (obj, k) {
            const r = this.getActiveStyle(k);
            if (!isNaN(r)) {
                return Number(r) * 100;
            }
        },
        set (val) {
            return Number(val) / 100;
        },
        handler: styleHandler
    },
    fontWeight: {
        get (obj) {
            return obj.fontWeight === 'bold';
        },
        type: 'i-text'
    },
    fontStyle: {
        get (obj) {
            return obj.fontStyle === 'italic';
        },
        type: 'i-text'
    }
};
export default {
    name: 'MuFabric',
    components: {
        FileSelect, Sketch
    },
    props: {
        widths: {
            type: Number
        },
        heights: {
            type: Number
        },
        dom: {
            type: String
        },
        fontFamily: {
            type: Array,
            default () {
                return ['Arial', 'Helvetica', '宋体', '黑体', '微软雅黑', '楷体', '仿宋', 'Verdana', 'Times New Roman', 'Roboto', 'Open Sans', 'Lato', 'Bellefair', 'Fresca', 'Raleway'];
            }
        },
        beforeSave: {
            type: Function,
            default () {
                return true;
            }
        },
        onSave: {
            type: Function,
            required: true
        },
        json: {
            type: [String, Object]
        },
        data: {
            type: [Object, Array]
        },
        defaultOptions: {
            type: Object,
            default () {
                return {
                    cornerSize: 20
                };
            }
        },
        typeOptions: {
            type: Object
        }
    },
    data () {
        return {
            canvas: {},
            colors: '#ffffff',
            openBackground: false,
            openColor: false,
            selection: null,
            currentRadius: 0,
            currentBackgroundImg: null,
            currentTextAlign: null,
            radius: {},
            trigger: null,
            backgroundImageRadius: 0,
            backgroundImageRadiusMax: 0,
            backgroundImageOpacity: 100,
            moving: false,
            ...Reflect.ownKeys(CHANGE_PROP_FIELD).reduce((r, k) => {
                const t = CHANGE_PROP_FIELD[k];
                r[`c_${k}`] = t.default;
                return r;
            }, {})
        };
    },
    computed: {
        openSettings () {
            return this.selection && (this.hasRadius || this.hasText) && !this.moving;
        },
        settingsTrigger () {
            return this.selection ? {
                getBoundingClientRect: () => {
                    return {
                        left: this.selection.left,
                        top: this.selection.top,
                        width: this.selection.width * this.selection.scaleX + 10,
                        height: this.selection.height * this.selection.scaleY + 10
                    };
                },
                contains: (e) => {
                    return false;
                },
                toString () {
                    return 'body';
                }
            } : null;
        },
        hasRadius () {
            return this.selection && this.selection.type === 'image';
        },
        hasText () {
            return this.selection && this.selection.type === 'i-text';
        },
        radiusMax () {
            return this.hasRadius ? this.radius[this.selection.id].max || 100 : 0;
        },
        rgba () {
            const val = typeof this.colors === 'object' && this.colors.rgba ? this.colors.rgba : { r: 255, g: 255, b: 255, a: 1 };
            return `rgba(${val.r}, ${val.g}, ${val.b}, ${val.a})`;
        }
    },
    watch: {
        currentTextAlign (val) {
            this.setActiveProp('textAlign', val);
        },
        colors (val) {
            if (!this.selection) {
                this.canvas.setBackgroundColor(this.rgba);
                this.canvas.requestRenderAll();
            } else {
                this.setActiveStyle({ fill: this.rgba });
            }
        }
    },
    mounted () {
        let dom = document.querySelector(this.dom);
        if (!dom) {
            dom = document.createElement('canvas');
            this.$el.appendChild(dom);
            this.width = this.width || (document.documentElement.clientWidth || document.body.clientWidth);
            this.height = this.height || (document.documentElement.clientHeight || document.body.clientHeight);
        } else {
            this.width = this.width || (dom.width || (document.documentElement.clientWidth || document.body.clientWidth));
            this.height = this.height || (dom.height || (document.documentElement.clientHeight || document.body.clientHeight));
        }
        this.canvas = new fabric.Canvas(dom, {
            width: this.width,
            height: this.height
        });
        this.canvas.on('selection:created', e => this.selectionHandler(e.target));
        this.canvas.on('selection:cleared', e => this.selection = null);
        this.canvas.on('selection:updated', e => this.selectionHandler(e.target));
        this.canvas.on('object:moving', e => this.moving = true);
        this.canvas.on('object:moved', e => this.moving = false);
        this.loadJSON(this.json);
        this.loadData(this.data);
    },
    methods: {
        ...Reflect.ownKeys(CHANGE_PROP_FIELD).reduce((r, k) => {
            const t = CHANGE_PROP_FIELD[k];
            r[`c_${k}Handler`] = function (val) {
                t.handler.apply(this, [typeof t.set === 'function' ? t.set(val) : val, k, t]);
            };
            return r;
        }, {}),
        async loadJSON (val) {
            if (val) {
                const json = typeof val === 'string' ? JSON.parse(val) : val;
                if (json.background) {
                    await this.pify(this.canvas.setBackgroundColor, json.background);
                }
                if (json.backgroundImage) {
                    const img = await this.loadImg(json.backgroundImage.src, json.backgroundImage);
                    this.backgroundImageRadius = json.backgroundImage._radius;
                    this.backgroundImageRadiusMax = json.backgroundImage._radiusMax;
                    img.set({
                        clipTo: ctx => ctx.arc(0, 0, this.backgroundImageRadius, 0, Math.PI * 2, true)
                    });
                    this.currentBackgroundImg = img;
                    this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
                }
                if (Array.isArray(json.objects)) {
                    await this.loadData(json.objects);
                }
                this.canvas.requestRenderAll();
            }
        },
        async loadData (data) {
            if (data) {
                data = Array.isArray(data) ? data : Array.of(data);
                for (const obj of data) {
                    if (obj.type === 'image') {
                        Reflect.deleteProperty(obj, 'clipTo');
                        await this.addImg(obj.src, obj);
                    }
                    if (obj.type === 'i-text') {
                        await this.addText(obj.text, obj);
                    }
                }
            }
        },
        changeRadius (val) {
            this.radius[this.selection.id].val = val;
            this.canvas.requestRenderAll();
        },
        upperLayer () {
            const active = this.canvas.getActiveObject();
            if (active) {
                active.bringToFront();
            } else {
                const objects = this.canvas.getActiveObjects();
                this.canvas.discardActiveObject();
                objects.forEach(object => object.bringToFront());
            }
        },
        lowerLayer () {
            const active = this.canvas.getActiveObject();
            if (active) {
                active.sendToBack();
            } else {
                const objects = this.canvas.getActiveObjects();
                this.canvas.discardActiveObject();
                objects.forEach(object => object.sendToBack());
            }
        },
        setActiveStyle (style) {
            const object = this.canvas.getActiveObject();
            if (!object) return;

            if (object.setSelectionStyles && object.isEditing) {
                object.setSelectionStyles(style);
            } else {
                Reflect.ownKeys(style).forEach(item => object.set(item, style[item]));
            }

            object.setCoords();
            this.canvas.requestRenderAll();
        },
        setActiveProp (name, val) {
            const object = this.canvas.getActiveObject();
            if (!object) return;
            object.set(name, val).setCoords();
            this.canvas.requestRenderAll();
        },
        getActiveStyle (name) {
            const object = this.canvas.getActiveObject();
            if (!object) return '';

            return (object.getSelectionStyles && object.isEditing)
                ? (object.getSelectionStyles()[name] || '')
                : (object[name] || '');
        },
        selectionHandler (target) {
            this.selection = target;
            Reflect.ownKeys(CHANGE_PROP_FIELD).filter(k => CHANGE_PROP_FIELD[k].type === this.selection.type || !CHANGE_PROP_FIELD[k].type).forEach(k => {
                let get = CHANGE_PROP_FIELD[k].get;
                get = get || ((o) => o[k]);
                this[`c_${k}`] = get.apply(this, [this.selection, k]);
            });
            if (this.hasRadius) {
                this.currentRadius = this.radius[this.selection.id].val;
            }
            if (this.selection.fill) {
                this.$refs.colors.colorChange(this.selection.fill);
            }
        },
        async loadImg (url, options = {}) {
            return new Promise(resolve => {
                fabric.Image.fromURL(url, img => resolve(img), {
                    ...this.optionsOfType('image'),
                    ...options
                });
            });
        },
        async addImg (url, options = {}) {
            const id = uuid();
            const img = await this.loadImg(url, options);
            const max = options._radiusMax || this.imageMaxRange(img);
            this.radius[id] = { val: options._radius || max, max };
            img.scale(0.5).set({
                left: this.canvas.width / 2 - img.width / 4,
                top: this.canvas.height / 2 - img.height / 4,
                clipTo: ctx => ctx.arc(0, 0, this.radius[img.id].val, 0, Math.PI * 2, true),
                id
            });
            this.addAndSelect(img);
        },
        addText (content = 'text', options = {}) {
            const text = new fabric.IText(content, Object.assign(this.optionsOfType('i-text'), {
                left: this.canvas.width / 2,
                top: this.canvas.height / 2,
                fill: '#000000',
                scaleX: 0.5,
                scaleY: 0.5,
                hasRotatingPoint: true
            }, options));
            this.addAndSelect(text);
        },
        removeActive () {
            const active = this.canvas.getActiveObject();
            if (active) {
                this.remove(active);
            } else {
                const objects = this.canvas.getActiveObjects();
                this.canvas.discardActiveObject();
                objects.forEach(object => this.remove(object));
            }
        },
        remove (obj) {
            if (obj && obj._remove !== false) {
                this.canvas.remove(obj);
                Reflect.deleteProperty(this.radius, obj.id);
            }
        },
        readFile (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = resolve;
                reader.readAsDataURL(file);
            });
        },
        async changeFile (files) {
            for (const file of files) {
                const result = await this.readFile(file);
                await this.addImg(result.target.result);
            }
        },
        async changeBackgroundImage (files) {
            const result = await this.readFile(files[0]);
            const img = await this.pifyBind(fabric.Image.fromURL, fabric.Image, result.target.result);
            this.backgroundImageRadius = this.backgroundImageRadiusMax = this.imageMaxRange(img);
            this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
                scaleX: this.canvas.width / img.width,
                scaleY: this.canvas.height / img.height,
                originX: 'left',
                originY: 'top',
                clipTo: ctx => ctx.arc(0, 0, this.backgroundImageRadius, 0, Math.PI * 2, true)
            });
            this.currentBackgroundImg = img;
        },
        setBackgroundProp (prop) {
            if (this.currentBackgroundImg) {
                if (typeof prop === 'object') {
                    this.currentBackgroundImg.set(prop);
                }
                this.canvas.requestRenderAll();
            }
        },
        deleteBackgroundImg () {
            this.canvas.backgroundImage = null;
            this.currentBackgroundImg = null;
            this.backgroundImageRadius = 0;
            this.backgroundImageRadiusMax = 0;
            this.backgroundImageOpacity = 100;
            this.canvas.requestRenderAll();
        },
        addAndSelect (obj) {
            this.canvas.add(obj);
            this.canvas.discardActiveObject().requestRenderAll();
            this.canvas.setActiveObject(obj);
        },
        async save () {
            const before = await this.beforeSave(this.canvas.getObjects().lenght, this.canvas.backgroundImage, this.canvas.backgroundColor);
            if (before === false) {
                return;
            }
            if (!fabric.Canvas.supports('toDataURL')) {
                alert('This browser doesn\'t provide means to serialize canvas to an image');
            } else {
                const json = this.canvas.toJSON(['id']);
                if (json.backgroundImage) {
                    json.backgroundImage._radius = this.backgroundImageRadius;
                    json.backgroundImage._radiusMax = this.backgroundImageRadiusMax;
                }
                json.objects.filter(o => o.type === 'image' && Reflect.has(this.radius, o.id)).forEach(o => {
                    o._radius = this.radius[o.id].val;
                    o._radiusMax = this.radius[o.id].max;
                    Reflect.deleteProperty(o, 'id');
                });
                this.onSave(json, this.canvas.toDataURL('png'));
            }
        },
        openBackgroundColor () {
            this.c_fill = this.canvas.backgroundColor;
            this.trigger = this.$refs.backgroundColor.$el;
            this.openColor = true;
        },
        openFontColor () {
            this.trigger = document.getElementById('fontColor');
            this.openColor = true;
        },
        imageMaxRange (img) {
            return Math.sqrt(Math.pow(img.height, 2) + Math.pow(img.width, 2)) / 2;
        },
        async pify (fn, ...args) {
            const result = await this.pifyBind(fn, this.canvas, ...args);
            return result;
        },
        async pifyBind (fn, that, ...args) {
            const result = await pify(fn.bind(that), { errorFirst: false })(...args);
            return result;
        },
        optionsOfType (type) {
            return Object.assign({}, this.defaultOptions, this.typeOptions ? this.typeOptions[type] : {});
        }
    }
};
</script>
<style lang="less">
.poptip {
    position: absolute;
    top: 0;
    background: rgba(238, 238, 238, 0.38);
    width: 100%;
    z-index: 1;
}
.color-view {
    height: 24px;
    width: 200px;
}
</style>
