<template>
  <div class="d-flex align-center">
    <div class="mr-3">{{ $t(title) }}</div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="inputTime"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="inputTime"
        no-title
        @input="menu = false"
        @change="updateTime"
        :max="max"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: "time-select",
  props:{
    title: String,
    time: String,
  },
  data(){
    return {
      menu: false,
      inputTime: null,
      max: null,
    }
  },
  methods:{
    updateTime(){
      this.$emit('update:time', this.inputTime)
    }
  },
  mounted(){
    this.inputTime = this.time
    let nowDate = new Date(Date.now())
    this.max = `${nowDate.getFullYear()}-${nowDate.getMonth()+1 < 10 ? `0${nowDate.getMonth()+1}`:nowDate.getMonth()+1}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}`:nowDate.getDate()}`
  }
}
</script>
<style>
</style>