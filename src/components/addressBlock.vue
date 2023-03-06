<template>
  <div class="d-flex flex-column align-center">
    <div>{{ $t('yourAddress') }}</div>
    <div class="mb-10 d-none d-sm-block">{{ $store.state.account }}</div>
    <div class="mb-10 d-block d-sm-none">{{ shortAddress }}</div>
  </div>
</template>
<script>
export default {
  computed:{
    shortAddress(){
      return `${this.$store.state.account.slice(0, 6)}...${this.$store.state.account.slice(38)}`
    }
  },
}
</script>