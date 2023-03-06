<template>
  <v-container class="defi-page">
    <v-row justify="center" class="my-md-4 mt-2 mb-15">
      <v-col cols="11" sm="8">
        <v-card
          light
          class="defi-card card-wrap d-flex flex-column justify-center align-center"
        >
          <div></div>
          <h2 class="mb-3 deposit-title">
            {{ $t('borrowRule') }}
          </h2>
          <div class="deposit-subtitle" v-t="'depositMention'"></div>
          <div>
            <div
              class="rule-block"
              v-for="(text, i) in $t('borrowRuleText')"
              :key="i"
              style="white-space: pre-wrap;"
            >
              <span class="id">{{ i + 1 }}</span>
              <span v-text="text"></span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Defi-borrow',
  data() {
    return {
      defiContract: null,
      isMember: false,
    };
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
.defi-page {
  .deposit-title {
    width: 346px;
    height: 62px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: white;
    background-color: #00126f;
    border-radius: 62px;
    font-size: 30px;
    @include dai_vuetify_md {
      width: 207px;
      border-radius: 37px;
      height: 37px;
      font-size: 17px;
    }
  }
  .deposit-subtitle {
    color: #ababab;
    font-size: 20px;
    text-align: center;
    @include dai_vuetify_md {
      font-size: 13px;
    }
  }
}
.defi-card {
  padding-left: 0;
  padding-right: 0;
}
.rule-block {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-self: start;
  gap: 16px;
  padding: 21px 38px 21px 20px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);

  @include dai_vuetify_md {
    font-size: 13px;
    padding: 13px;
  }
  .id {
    font-size: 100px;
    transform: translateY(-23px);
    color: rgba(0, 0, 0, 0.1);
    font-family: 'Romanesco';
    line-height: 100px;
    @include dai_vuetify_md {
      line-height: 80px;

      transform: translateY(-18px);
      font-size: 80px;
    }
  }
  &:last-of-type {
    border-bottom: unset;
  }
}
</style>
