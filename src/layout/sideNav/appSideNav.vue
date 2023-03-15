<script>
export default {
  computed: {
    menuItems() {
      return [
        {
          title: 'ABSOLUTE',
          routeName: 'Index',
          icon: 'route-absolute.svg',
          link: '/',
        },
        {
          title: 'MINING',
          routeName: '',
          icon: 'sidebar/mining.svg',
        },
        {
          title: 'DEFI',
          routeName: 'Index',
          icon: 'sidebar/defi.svg',
          link: '/',
        },
        {
          title: 'SHOP',
          routeName: 'shop',
          icon: 'sidebar/shop.svg',
          link: `https://bep20swaput.com/${$store.state.locale === 'chs' ? 'cn' : $store.state.locale}`,
        },
      ];
    },
  },
};
</script>
<template>
  <div style="margin-top: 60px">
    <div class="sidebar-sub-title">
      {{$t('sideNavSubTitle[0]')}}
    </div>
    <div class="sidebar-sub-title">
      {{$t('sideNavSubTitle[1]')}}
    </div>
    <div
      style="color: #1933BE; font-size: 38px; font-weight: bold; margin: 36px 0 26px 0;"
      v-html="$t('sideNavSlogan')"
    >
    </div>
  </div>
</template>
