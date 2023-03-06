<template>
  <div :style="{background: background}" class="rounded-circle logo-wrap d-flex justify-center align-center">
    <img :src="`${require(`@/assets/img/${img}`)}`" :alt="`logo-${name}`">
  </div>
</template>
<script>
export default {
  props: {
    background: String,
    img: String,
    name: String,
  }
}
</script>
<style lang="scss">
.logo-wrap{
  width: 90px;
  height: 90px;
}

@media screen and (max-width: 600px) {
  .logo-wrap {
    width: 53px;
    height: 53px;
    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>