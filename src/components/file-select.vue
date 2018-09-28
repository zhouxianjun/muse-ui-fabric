<template>
    <div class="file-select">
        <div
            class="file-select file-select-select"
            @click="handleClick">
            <input
                ref="input"
                type="file"
                class="file-select-input"
                @change="handleChange"
                :multiple="multiple"
                :accept="accept">
            <slot></slot>
        </div>
        <slot name="tip"></slot>
    </div>
</template>
<script>
export default {
    name: 'FileSelect',
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        accept: {
            type: String
        }
    },
    data () {
        return {};
    },
    methods: {
        handleClick () {
            this.$refs.input.click();
        },
        handleChange (e) {
            const files = e.target.files;
            if (!files) {
                return;
            }
            this.$emit('change', files);
            this.$refs.input.value = null;
        }
    }
};
</script>
<style lang="less">
@upload-prefix-cls: ~"file-select";
@text-color             : #515a6e;
@border-radius-small    : 4px;
@transition-time        : .2s;
@ease-in-out            : ease-in-out;
@font-size-small        : 12px;
@input-disabled-bg           : #f3f3f3;
@primary-color          : #2d8cf0;
@legend-color           : #999;

.@{upload-prefix-cls} {
    input[type="file"]{
        display: none;
    }

    &-list{
        margin-top: 8px;

        &-file{
            padding: 4px;
            color: @text-color;
            border-radius: @border-radius-small;
            transition: background-color @transition-time @ease-in-out;
            overflow: hidden;
            position: relative;

            & > span{
                cursor: pointer;
                transition: color @transition-time @ease-in-out;
                i{
                    display: inline-block;
                    width: @font-size-small;
                    height: @font-size-small;
                    color: @text-color;
                    text-align: center;
                }
            }

            &:hover{
                background: @input-disabled-bg;
                & > span{
                    color: @primary-color;
                    i{
                        color: @text-color;
                    }
                }
                .@{upload-prefix-cls}-list-remove{
                    opacity: 1;
                }
            }
        }
        &-remove{
            opacity: 0;
            font-size: 18px;
            cursor: pointer;
            float: right;
            margin-right: 4px;
            color: @legend-color;
            transition: all @transition-time ease;
            &:hover{
                color: #444;
            }
        }
    }

     &-select {
        display: inline-block;
    }
}
</style>
