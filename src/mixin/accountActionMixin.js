export default {
  computed: {
    shortAddress() {
      return `${this.$store.state.account.slice(
        0,
        6
      )}...${this.$store.state.account.slice(38)}`;
    },
  },
  methods: {
    async connectToggle() {
      if (this.$store.state.account) {
        this.$store.commit('clearInfo');
        this.$cookies.remove('address');
        this.$router.push({ name: 'Home' });
      } else {
        if (window.ethereum) {
          await this.connectMetamask();
        } else {
          window.addEventListener(
            'ethereum#initialized',
            this.connectMetamask,
            {
              once: true,
            }
          );

          // If the event is not dispatched by the end of the timeout,
          // the user probably doesn't have MetaMask installed.
          setTimeout(this.connectMetamask, 2000); // 3 seconds
        }
        this.$forceUpdate();
      }
    },
  }
};