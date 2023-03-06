<script>
export default {
  props: ['items', 'active'],
}
</script>
<template>
  <div class="defi-nav-group">
    <router-link :to="item.link"
      class="defi-nav-item"
      v-for="item in items"
      :class="active === item.routeName ? 'active' : ''"
      :key="item.text">
      <span v-html="$t(item.navText)"></span>
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
.defi-nav-group {
  display: flex;
  gap: 34px;

  @include dai_vuetify_md {
    gap: 16px;
  }
}
.defi-nav-item {
  width: 80px;
  height: 80px;
  @include dai_vuetify_md{
    width: 39px;
    height: 39px;
  }
}
.en .defi-nav-item {
  @include dai_vuetify_md {
    font-size: 10px;
  }
}
.defi-nav-item {
  display: flex;
  flex: 1 1;
  cursor: pointer;
  padding: 12px;
  
  text-decoration: none;
  color: white;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid #c9c9c9;
  box-shadow: 0px 2.14241px 5.35603px rgba(0, 0, 0, 0.25),
    inset 0px 1.74086px 1.74086px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  position: relative;
  line-height: 1.1;
  justify-content: center;

  @include dai_vuetify_md {
    font-size: 14px;
    padding: 0px;
    border-width: 1px;
    gap: 3px;
    border-radius: 4px;
  }

  span {
    display: flex;
    height: 100%;
    white-space: nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  }
}

.defi-nav-item.active {
  border-color: #f19915;
}

.defi-nav-item.active::after {
  background-color: #f19915;
  width: 50%;
}

.defi-nav-item::after {
  content: '';
  position: absolute;
  height: 4px;
  bottom: -20px;
  width: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: width background-color .3s;

  @include dai_vuetify_md {
    height: 2px;
    bottom: -12px;
  }
}
</style>
