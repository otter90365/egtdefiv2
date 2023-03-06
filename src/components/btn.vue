<template>
  <div class="btn" :class="{'d-flex justify-center':isCenter}" :style="{width: width? width:''}">
    <v-btn
      class="btn-text"
      :class="{ 'white--text': !isOutlined, 'font-weight-bold': isRounded }"
      :style="{ background: gradientColor }"
      :color="color"
      :width="width"
      :height="height"
      :block="isBlock"
      :disabled="isDisabled || isLoading"
      :dark="isDark"
      :rounded="isRounded"
      :text="isText"
      :loading="isLoading"
      depressed
      @click.stop="clickBtn()"
      :outlined="isOutlined"
    >
      <template v-if="!isCustom">
        <span :class="{'rem-20':height>=60}">
          {{ $t(buttonText) }}
        </span>
      </template>
      <slot v-else name="custom"></slot>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    buttonText: String,
    width: [Number, String],
    height: Number,
    isBlock: {
      type: Boolean,
      default: false,
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary'
    },
    gradientColor: {
      type: String,
      default: ''
    },
    isRounded: {
      type: Boolean,
      default: false,
    },
    isText: {
      type: Boolean,
      default: false,
    },
    isCenter:{
      type: Boolean,
      default: false
    },
    isDark:{
      type: Boolean,
      default: false
    },
    isCustom:{
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickBtn() {
      console.log('clickBtn')
      this.$emit("clickBtn");
    },
  },
};
</script>