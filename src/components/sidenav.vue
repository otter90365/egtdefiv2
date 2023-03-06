<script>
export default {
  name: 'SideNav',
  props: {
    list: Array,
    active: String,
  },
  methods: {
    onClick(link = '') {
      if (typeof link === 'string' && link.startsWith('http')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        if (link) this.$router.push(link).catch((err) => err);
      }
    },
  },
};
</script>
<template>
  <div class="sidebar-menu d-flex flex-column">
    <span
      class="d-flex menu-item can-click"
      v-for="(item, i) in list"
      :key="i"
      :class="active === item.routeName ? 'active' : 'in-active'"
      @click="onClick(item.link)"
    >
      <img
        v-if="item.icon"
        class="icon"
        :src="require('@/assets/img/' + item.icon)"
        width="35px"
        height="35px"
      />
      <span>{{ item.title }}</span>
      <span class="active-point"></span>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.sidebar-menu {
  gap: 14px;
  color: #1933be;
}
.menu-item {
  align-items: center;
  position: relative;
  gap: 8px;
  font-size: 24px;
  border: solid 1px #1933be;
  padding: 20px 34px;
  border-radius: 45px;
  width: 230px;
}
.active-point {
  width: 18px;
  height: 18px;
  background-color: #1933be;
  border-radius: 50%;
  margin-left: auto;
}

.in-active .active-point {
  display: none;
}
</style>
