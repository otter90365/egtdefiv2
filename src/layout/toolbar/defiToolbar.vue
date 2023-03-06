<script>
import toolbar from '@/components/toolbar.vue'

export default {
  components: {
    toolbar,
  },
  data() {
    return {
      toolbarMenu: [
        {
          title: this.$t(`toBorrow`),
          icon: 'toolbar/borrow.svg',
          link: { name: 'Defi-borrow' },
          routeName: 'Defi-borrow',
        },
        {
          title: 'Defi',
          icon: 'toolbar/main-defi.svg',
        },
        {
          title: this.$t(`toDeposit`),
          icon: 'toolbar/deposit.svg',
          link: { name: 'Defi-deposit' },
          routeName: 'Defi-deposit',
        },
      ],
      isMember: false,
    }
  },
  mounted() {
    if (this.$route.name.startsWith('Defi-deposit')) return 'Defi-deposit'
    else if (this.$route.name.startsWith('Defi-borrow')) return 'Defi-borrow'
    else return ''
  },
  computed: {
    active() {
      if (this.$route.name.startsWith('Defi-deposit')) return 'Defi-deposit'
      else if (this.$route.name.startsWith('Defi-borrow')) return 'Defi-borrow'
      else return ''
    },
  },
}
</script>
<template>
  <toolbar main-icon-bg-color="#1b1d22" :active="active" :items="toolbarMenu">
  </toolbar>
</template>
