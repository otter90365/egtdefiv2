<script>
import BscBridge from '@/plugins/bscBridge.js';
import EGT from '@/plugins/egt.js';
import base from '@/mixin/base.js';
import loading from '@/components/loading.vue';
import Form from './form.vue';
export default {
  name: 'Egt-swap',
  mixins: [base],
  data() {
    return {
      amount: null,
      balance: 0,
      allowance: 0,
      bridgeContract: null,
      egtContract: null,
      loadingShow: false,
      timer: null,
      balanceRules: [(v) => v <= this.balance || 'Under Balance'],
    };
  },
  components: {
    loading,
    Form,
  },
  methods: {
    async clickSellBtn() {
      if (this.$store.state.chainId) {
        if (this.$refs.form.validate()) {
          let result = await this.bridgeContract.deposit(this.amount);
          // console.log('result', result)
          if (result.txHash) {
            await this.getBalance();
            this.$toasted.show(this.$t('txSend'));
            this.$refs.form.reset();
          } else if (result.code === 4001) {
            this.$toasted.error(this.$t('userRefuse'));
          }
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'));
      }
    },
    async approve() {
      if (this.$store.state.chainId) {
        let result = await this.egtContract.approveOther(
          this.bridgeContract.contract.options.address
        );
        // console.log('result', result)
        if (result.txHash) {
          this.loadingShow = true;
          this.timer = window.setInterval(async () => {
            this.allowance = await this.egtContract.getOtherAllowance(
              this.$store.state.account,
              this.bridgeContract.contract.options.address
            );
            if (this.allowance >= this.balance) {
              window.clearInterval(this.timer);
              this.loadingShow = false;
            }
          }, 1000);
        } else if (result.code === 4001) {
          this.$toasted.error(this.$t('userRefuse'));
        }
      } else {
        this.$toasted.error(this.$t('changeMainnet'));
      }
    },
    async getBalance() {
      let total = await this.egtContract.getBalance(this.$store.state.account);
      this.balance = total;
    },
  },
  async mounted() {
    // egt contract
    this.egtContract = await new EGT();

    // egt isMember
    // let isMember = await this.egtContract.isMember(this.$store.state.account)
    // if (isMember){
    this.bridgeContract = await new BscBridge();

    this.getBalance();
    this.allowance = await this.egtContract.getOtherAllowance(
      this.$store.state.account,
      this.bridgeContract.contract.options.address
    );
    // }else{
    //   this.$router.push({name: 'Egt-registry'})
    // }
  },
};
</script>
<template>
  <fragment>
    <Form
      :amount.sync="amount"
      :balance="balance"
      tokenName="EGT"
      targetTokenName="ETH"
      protocol="BEP-20"
      ref="form"
      :swapCoefficient="1"
      :allowance="allowance"
      :imgSrc="require('@/assets/img/borrow/egt.svg')"
      @approve="approve"
      @submit="clickSellBtn"
      :swapAmount="(amount || 0) / 1200"
    ></Form>
    <loading :loadingShow="loadingShow" :content="'waitApprove'"></loading>
  </fragment>
</template>
