<template>
  <v-dialog persistent fullscreen v-model="loadingShow" style="height: 100vh;">
    <div class="d-flex flex-column justify-center align-center" :class="`primary_${$route.params.token}--text`" style="height: 100%; background-color: rgba(255, 255, 255, .7);">
      <v-progress-circular
        indeterminate
        :color="`primary_${$route.params.token}`"
        class="mb-5"
      ></v-progress-circular>
      <h2>{{ $t(content) }}</h2>
    </div>
  </v-dialog>
</template>
<script>
export default {
  name: 'loading',
  props:{
    loadingShow: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
  }
}
</script>