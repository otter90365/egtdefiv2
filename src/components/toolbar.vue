<script>
export default {
  props: ['items', 'active', 'mainIconBgColor'],
  computed: {
    toolbarItems() {
      if (this.items.length === 3) return [[this.items[0]], [this.items[2]]];
      else return [this.items.slice(0, 2), this.items.slice(3)];
    },
    centerItem() {
      if (this.items.length === 3) return this.items[1];
      else return this.items[2];
    },
  },
  methods: {
    onClick(link = '') {
      if (typeof link === 'string' && link.startsWith('http')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        if (link) this.$router.push(link);
      }
    },
  },
};
</script>

<template>
  <div class="toolbar-wrapper">
    <div class="rounded-main-icon-bg"></div>
    <div class="toolbar-wrapper-bg"></div>
    <div class="toolbar-cursor"></div>
    <div class="toolbar-group">
      <div
        class="toolbar-item"
        :class="active === item.routeName ? 'active' : ''"
        v-for="item in toolbarItems[0]"
        :key="item.title"
        @click="onClick(item.link)"
      >
        <div class="toolbar-item-icon">
          <img
            :src="require('@/assets/img/' + item.icon)"
            width="35px"
            height="35px"
          />
        </div>
        <div class="toolbar-item-name">{{ item.title }}</div>
      </div>
    </div>
    <div
      class="main-icon"
    >
      <img :src="require('@/assets/img/' + centerItem.icon)" />
    </div>
    <div class="toolbar-group">
      <div
        class="toolbar-item"
        v-for="item in toolbarItems[1]"
        :key="item.title"
        :class="active === item.routeName ? 'active' : ''"
        @click="onClick(item.link)"
      >
        <div class="toolbar-item-icon">
          <img
            :src="require('@/assets/img/' + item.icon)"
            width="35px"
            height="35px"
          />
        </div>
        <div class="toolbar-item-name">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbar-wrapper {
  position: relative;
  width: 364px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.toolbar-group {
  display: flex;
  gap: 36px;
  justify-content: center;
  width: 150px;
}
.toolbar-wrapper > * {
  z-index: 2;
}
.toolbar-wrapper-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #1b1d22;
  border: 1px solid #c3c3c3;
  z-index: 1;
  border-radius: 7px;
}

.toolbar-item {
  position: relative;
  padding-bottom: 9px;
}

.toolbar-item.active::after {
  content: '';
  background: url(~@/assets/img/toolbar/cursor.svg) no-repeat;
  background-size: contain;
  background-position: bottom;
  width: 36px;
  height: 6px;
  position: absolute;
  bottom: 0px;
}

.toolbar-cursor {
  display: none;
}

.toolbar-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 0 1;
  font-size: 10px;
  width: 43px;
}

.toolbar-item-name {
  flex: 0 1;
  line-height: 11px;
  margin-top: 6px;
  color: white;
  mix-blend-mode: multiply;
  white-space: nowrap;
}

.toolbar-item-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #c3c3c3;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toolbar-item-icon img {
  width: 15px;
  height: 15px;
  object-fit: contain;
}

.main-icon {
  margin-bottom: 9px;
  background-color: #1b1d22;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.main-icon img {
  object-fit: contain;
  height: 50px;
  width: 50px;
}
.rounded-main-icon-bg {
  position: absolute;
  bottom: 7px;
  width: 61px;
  height: 61px;
  border: 1px solid #c3c3c3;
  background-color: #3e3e3e;
  z-index: 1;
  border-radius: 50%;
  box-sizing: content-box;
  left: 50%;
  transform: translateX(-50%);
}
</style>
