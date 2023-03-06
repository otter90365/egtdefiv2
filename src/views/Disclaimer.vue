<script>
export default {
  methods: {
    backToIndex() {
      this.$emit('close')
    },
  },
};
</script>
<template>
  <div class="pb-16 pb-sm-0">
    <v-container>
      <v-row class="justify-center">
        <v-col cols="12" md="12">
          <v-card class="disclaimer">
            <v-card-title class="justify-center mb-sm-10 mb-2 rem-md-20 rem-1">
              <h3 class="mb-0" v-t="'disclaimer'"></h3>
            </v-card-title>
            <v-card-text class="rem-md-8 rem-1">
              <p v-for="line in $t('disclaimerContent')" :key="line">
                {{ line }}
              </p>
            </v-card-text>
            <v-card-actions>
              <button @click.prevent="backToIndex" class="rem-1 back-to-index">
                {{ $t('backToIndex') }}
              </button>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style lang="scss" scoped>
.disclaimer {
  min-height: 785px;
  border-radius: 26px !important;
  padding: 33px 83px;
  background-color: rgba(255, 255, 255, 0.8) !important;
  @include dai_vuetify_sm {
    padding: 20px 0;
    background-color: transparent !important;
    color: white !important;
  }
}
p {
  margin-bottom: 40px;
  line-height: 29px;
  color: #000;
  @include dai_vuetify_sm {
    color: white;
    line-height: 18.87px;
    margin-bottom: 20px;
  }
}
.back-to-index {
  cursor: pointer;
  min-width: 72px;
  height: 26px;
  margin: 0 auto;
  background: #00a77b;
  border-radius: 2px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
