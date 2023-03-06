<template>
  <v-dialog persistent v-model="warningShow" max-width="450" width="80%">
    <!-- 風險提示 -->
    <v-card v-if="page !== 'rule'" class="warning-card-wrap pt-3">
      <v-card-title class="d-flex justify-center">
        <h2 class="mb-3 mb-md-5" style="color: #E08700">{{ $t('warning') }}</h2>
      </v-card-title>
      <v-card-text style="color: #8D8D8D">
        <div class="rem-md-12 rem-4 warning-content">
          {{ $t('warningContent') }}
        </div>
        <!-- <btn
        :buttonText="'confirm'"
        :color="`primary_${$route.params.token}`"
        :width="270"
        @clickBtn="confirm()"
      ></btn> -->
      </v-card-text>
      <div class="modal-footer rem-sm-10 rem-7">
        <div class="left" @click="cancel">{{ $t('cancel') }}</div>
        <div class="right" @click="confirm">{{ $t('continueDeposit') }}</div>
      </div>
    </v-card>
  </v-dialog>
</template>
<style scoped lang="scss">
.warning-card-wrap {
  border-radius: 26px !important;
  @include dai_vuetify_md {
    border-radius: 18px !important;
  }
}

.warning-content {
  line-height: 37px;
  @include dai_vuetify_md {
    line-height: 26px;
  }
}

.en .modal-footer {
  letter-spacing: 1px!important;
  @include dai_vuetify_md {
    letter-spacing: 1px!important;
    .right {
      letter-spacing: 1px;
    }
  }
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: stretch;
  height: 79px;
  border-top: solid 1.3px #ababab;
  font-weight: bold;
  letter-spacing: 12px;
  color: #6e6e6e;
  @include dai_vuetify_md {
    height: 54px;
    .right {
      letter-spacing: 4px;
    }
  }
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .left {
    border-right: solid 1px #ababab;
    @include dai_vuetify_md {
      padding-left: 15px;
    }
  }
}
</style>
<script>
export default {
  name: 'warning',
  props: {
    warningShow: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
    page: {
      type: String,
      default: 'borrow',
    },
    rules: {
      type: [Array, String],
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$router.push({ name: 'Index' });
    },
    // closeRule() {
    //   this.$emit('closeRule');
    // },
  },
};
</script>
