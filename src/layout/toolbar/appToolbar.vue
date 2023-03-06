<script>
import toolbar from '@/components/toolbar.vue';

export default {
  components: {
    toolbar,
  },
  computed: {
    toolbarMenu() {
      return [
        { title: 'SWAP', icon: 'toolbar/swap.svg' },
        {
          title: 'MINING',
          routeName: '',
          icon: 'toolbar/mining.svg',
        },
        {
          title: 'ABSOLUTE',
          routeName: '',
          icon: 'route-absolute.svg',
          link: '/',
        },
        {
          title: 'DEFI',
          routeName: 'Index',
          icon: 'toolbar/defi.svg',
          link: '/',
        },
        {
          title: 'SHOP',
          routeName: 'shop',
          icon: 'toolbar/shop.svg',
          link: `https://tbtswap.com/${this.$store.state.locale}`,
        },
      ];
    },
  },
};
</script>
<template>
  <toolbar active="Index" :items="toolbarMenu"> </toolbar>
</template>
