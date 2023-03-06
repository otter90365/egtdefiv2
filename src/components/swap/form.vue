<script>
import accountActionMixin from '@/mixin/accountActionMixin'
import base from '@/mixin/base'
export default {
  props: [
    'tokenName',
    'targetTokenName',
    'balance',
    'imgSrc',
    'protocol',
    'amount',
    'swapCoefficient',
    'allowance',
    'swapAmount',
  ],
  mixins: [base, accountActionMixin],
  data() {
    return {
      balanceRules: [(v) => v <= this.balance || 'Under Balance'],
    }
  },
  computed: {
    disabled() {
      return this.allowance === 0 || this.allowance < this.balance
        ? true
        : false
    },
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    reset() {
      return this.$refs.form.reset()
    },
    numberFormat(num) {
      if (parseFloat(num)) return parseFloat(num).toFixed(2)
      return num
    }
  }
}
</script>
<template>
  <div class="swap-form">
    <div class="swap-title pl-3 mb-3">
      {{ $t('yoursReceiveAddress') }}
    </div>
    <div class="pl-3 mb-md-10 mb-4 rem-md-13 d-none d-md-block">
      {{ $store.state.account }}
    </div>
    <div class="pl-3 mb-md-10 mb-4 rem-md-13 d-block d-md-none">
      {{ shortAddress }}
    </div>

    <div class="swap-title pl-3 mb-4">
      {{ $t('enterAmount', {tokenName, protocol}) }}
    </div>
    <v-form ref="form">
      <v-text-field
        :value="amount"
        @input="$emit('update:amount', $event)"
        :placeholder="$t('enterWantedSwapAmount', { tokenName })"
        outlined
        persistent-hint
        dense
        :disabled="disabled"
        :rules="[...TokenAmountRules, ...balanceRules]"
      >
        <template v-slot:prepend-inner>
          <img class="prepend-icon" :alt="tokenName" :src="imgSrc" />
        </template>
        <template v-slot:append>
          <div class="click-max" @click="$emit('update:amount', balance)">Max</div>
        </template>
      </v-text-field>
    </v-form>
    <div
      class="d-flex justify-space-between rem-2 rem-md-9 font-weight-bold"
      style="color: #818181"
    >
      <div>{{ $t('usable') }} {{ ':' }} {{ balance }} {{ tokenName }}</div>
      <div>
        {{ $t('swapAmount', { amount: numberFormat(swapAmount), tokenName: targetTokenName }) }}
      </div>
    </div>
    <div class="d-flex justify-center">
      <button
        class="click-btn"
        @click="$emit('approve')"
        v-if="allowance === 0 || allowance < balance"
      >
        {{ $t('sellApprove') }}
      </button>
      <button v-else class="click-btn" @click="$emit('submit')">
        {{ $t('swapImmediate') }}
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.swap-form {
  color: #777777;
}
.swap-title {
  position: relative;
  font-weight: 700;
  font-size: 28px;
  @include dai_vuetify_md {
    font-size: 16px;
  }
  &:after {
    content: '';
    position: absolute;
    width: 5px;
    height: 27px;
    top: 50%;
    transform: translateY(-50%);
    left: 0px;

    background: #33418b;
    border-radius: 6px;
  }
}
.prepend-icon {
  width: 36px;
  @include dai_vuetify_md {
    width: 20px;
  }
}
.click-max {
  color: #777;
  cursor: pointer;
}
::v-deep .v-input__control .v-input__slot {
  min-height: 67px !important;
  align-items: center;
  @include dai_vuetify_md {
    min-height: 40px !important;
  }
  .v-input__prepend-inner {
    margin-top: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 67px;
    @include dai_vuetify_md {
      min-height: 40px !important;
    }
  }
  .v-input__append-inner {
    align-self: center;
    margin-top: 0 !important;
    display: flex;
    margin-right: -12px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 67px;
    @include dai_vuetify_md {
      min-height: 40px;
    }
    & > :last-child {
      min-height: inherit;
      padding: 0px 27px;
      display: flex;
      align-items: center;

      @include dai_vuetify_md {
        padding: 0px 15px;
      }
    }
  }
}

.click-btn {
  background: #00a77b;
  color: white;
  font-weight: bold;
  margin-top: 97px;
  border-radius: 4px;
  min-width: 137px;
  height: 44px;
  font-size: 27px;
  padding: 0 12px;
  box-sizing: border-box;
  @include dai_vuetify_md {
    margin-top: 50px;
    border-radius: 4px;
    min-width: 80px;
    height: 26px;
    font-size: 16px;
    padding: 0 4px;
  }
  &:active {
    transform: scale(.95);
  }
}
</style>
