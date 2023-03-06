<style scoped lang="scss">
.prepend-icon {
  height: 24px;
}
.unit span {
  color: white;
}

.click-max {
  color: #33418B;
  font-weight: bold;
}
::v-deep .v-input:not(.error--text):not([class^="primary_"]) .v-input__slot .v-input__append-inner>:last-child {
  background-color: #C4C4C4;
}
::v-deep .v-input__control .v-input__slot .v-input__append-inner {
  align-self: center;
  margin-top: 0 !important;
  display: flex;
  margin-right: -12px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  gap: 5px;
  .unit {
    display: flex;
    justify-content: center;
    max-width: 60px;
    width: 60px;
    font-size: 20px;
    @include dai_vuetify_md {
      font-size: 12px;
      max-width: 43px;
    }
  }
  & > :last-child {
    min-height: inherit;
    display: flex;
    align-items: center;
    background-color: currentColor;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    @include dai_vuetify_md {
      padding: 0px 15px;
    }
  }
}

::v-deep .v-input {
  font-size: 24px;
  @include dai_vuetify_md {
    font-size: 14px;
  }
}
</style>
<template>
  <div class="input-block d-flex justify-start align-center">
    <!-- mode input-->
    <v-text-field
      v-if="mode === 'input'"
      v-model="text"
      :placeholder="renderTitle"
      outlined
      dense
      :disabled="disabled"
      :rules="rules"
      :color="`primary_${$route.params.token}`"
    >
      <template v-slot:prepend-inner>
        <img
          class="prepend-icon"
          :src="`${require('../assets/img/borrow/user.svg')}`"
        />
      </template>
      <template v-slot:append>
        <div class="unit">
          <span>{{ unit }}</span>
        </div>
      </template></v-text-field
    >

    <!-- mode balance-->
    <v-text-field
      v-else-if="mode === 'balance'"
      v-model="text"
      outlined
      :placeholder="renderTitle"
      dense
      persistent-hint
      :color="`primary_${$route.params.token}`"
      :disabled="disabled"
      :rules="[...rules, balanceRule, decimalsRule]"
    >
      <template v-slot:prepend-inner>
        <img
          class="prepend-icon"
          :src="`${require('../assets/img/borrow/user.svg')}`"
        />
      </template>
      <template v-slot:append>
        <div @click="text = balance" class="click-max">Max</div>
        <div class="unit">
          <span>{{ unit }}</span>
        </div>
      </template>
    </v-text-field>

    <!-- mode select-->
    <v-select
      v-else-if="mode === 'select'"
      v-model="text"
      outlined
      dense
      :items="selectItems"
      :placeholder="renderTitle"
      :item-text="'name'"
      :item-value="'value'"
      :disabled="disabled"
      :rules="rules"
      :color="`primary_${$route.params.token}`"
      :item-color="`primary_${$route.params.token}`"
    >
      <template v-slot:prepend-inner>
        <img
          class="prepend-icon"
          :src="`${require('../assets/img/borrow/user.svg')}`"
        />
      </template>
      <template v-slot:append>
        <div class="unit">
          <span>{{ unit }}</span>
        </div>
      </template></v-select
    >

    <!-- mode onlyText-->
    <div v-else-if="mode === 'onlyText'" style="width: 100%;">
      {{ inputText }}
    </div>
    <!-- <div class="" style="min-width: 30px">{{ unit }}</div> -->
  </div>
</template>
<script>
import { ENABLED_ZERO_DAY_OPTION } from '@/constant/order'

export default {
  name: 'input-block',
  props: {
    mode: {
      type: String,
      default: 'input',
    },
    title: [String, Object],
    unit: String,
    inputText: [String, Number],
    decimals: {
      type: Number,
      default: 18
    },
    balance: Number,
    token: {
      type: String,
      default: 'eth',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
    selectItems: {
      type: Array,
      default() {
        const _dev = []
        if (ENABLED_ZERO_DAY_OPTION) _dev.push({
          name: '0',
          value: 0
        }, {
          name: '1hr',
          value: 1
        })
        return [
          ..._dev,
          {
            name: '7',
            value: 7 * 24,
          },
          {
            name: '14',
            value: 14 * 24,
          },
          {
            name: '30',
            value: 30 * 24,
          },
          {
            name: '60',
            value: 60 * 24,
          },
          {
            name: '90',
            value: 90 * 24,
          },
          {
            name: '120',
            value: 120 * 24,
          },
          {
            name: '150',
            value: 150 * 24,
          },
          {
            name: '180',
            value: 180 * 24,
          },
        ];
      },
    },
  },
  data() {
    return {
      text: '',
      balanceRule: (v) => parseFloat(v) < this.balance || this.$t('underBalance'),
      decimalsRule: v => (`${v}`.length - `${v}`.indexOf('.') - 1) <= this.decimals || `Over ${this.decimals} decimals`
    };
  },
  watch: {
    text(newVal) {
      this.$emit('update:inputText', newVal);
    },
    inputText(newVal) {
      this.text = newVal;
    },
  },
  mounted() {
    this.text = JSON.parse(JSON.stringify(this.inputText));
  },
  computed: {
    renderTitle() {
      if (typeof this.title === 'string') return this.$t(this.title);
      else {
        return this.$t(this.title.key, this.title.arg);
      }
    },
  },
};
</script>
