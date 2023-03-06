<script>
import sidebarMenu from '@/components/sidenav.vue';
export default {
  components: { sidebarMenu },
  data() {
    return {
      sidebarMenu: [
        {
          title: this.$t(`toDeposit`),
          routeName: 'Defi-deposit',
          link: { name: 'Defi-deposit' },
        },
        {
          title: this.$t(`toBorrow`),
          routeName: 'Defi-borrow',
          link: { name: 'Defi-borrow' },
        },
      ],
    };
  },
  computed: {
    active() {
      if (this.$route.name.startsWith('Defi-deposit')) return 'Defi-deposit';
      else if (this.$route.name.startsWith('Defi-borrow')) return 'Defi-borrow';
      else return '';
    },
    token() {
      return this.$route.params.token;
    },
  },
};
</script>
<template>
  <div style="margin-top: 60px;">
    <div
      style="color: #1933BE; font-size: 38px; font-weight: bold; margin: 36px 0 26px 0"
    >
      {{$t('toDeposit')}}
    </div>

    <sidebar-menu :list="sidebarMenu" :active="active"></sidebar-menu>
    <img
      v-if="token"
      :src="require(`@/assets/img/borrow/${token}.svg`)"
      :alt="`${token}.svg`"
      class="token-display"
    />
  </div>
</template>
<style lang="scss" scoped>
.token-display {
  position: absolute;
  top: 179px;
  right: 0;
  transform: translateX(50%) translateY(-50%);
}
</style>
