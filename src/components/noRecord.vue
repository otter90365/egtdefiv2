<template>
  <div class="no-record-block d-flex justify-center align-center rounded-lg">
    {{ $t('noRecord') }}
  </div>
</template>

<script>
export default {
  name: 'no-record'
}
</script>

<style scoped>
.no-record-block{
  background-color: #EDFEFE;
  height: 200px;
}
</style>