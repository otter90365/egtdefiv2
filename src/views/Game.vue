<template>
  <div class="game-page">
    <v-row justify="center" class="mt-15 mb-2 mb-md-5">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="game-card card-wrap d-flex flex-column justify-center align-center">
          <img :src="`${require(`@/assets/img/icon-game-${$route.params.token}.png`)}`" width="60px" class="mb-5">
          <div class="mb-4 d-flex flex-column align-center">
            <h2 :class="`primary_${$route.params.token}--text`">{{ $t('luckyPool') }}</h2>
            <h2 class="red--text">{{ roundData.roundamount.toLocaleString() }} {{ ($route.params.token).toUpperCase() }}</h2>
          </div>

          <v-row style="width: 100%;" class="mb-sm-4">
            <v-col cols="12" align="center">
              <h3 :class="`primary_${$route.params.token}--text`">{{ $t('countdown') }}</h3>
              <div v-if="status===1">
                <countdown :countdown="countdown"></countdown>
              </div>
              <h2 v-else>{{ status===2 ? $t('noOrder') : status===3 ? $t('drawing') : '' }}</h2>
            </v-col>
          </v-row>

          <v-row style="width: 100%;" class="mb-1">
            <v-col cols="12" align="center">
              <h3 :class="`primary_${$route.params.token}--text`">{{ $t('currRound') }}</h3>
              <h3>{{ round }}</h3>
            </v-col>
          </v-row>

          <btn class="mb-6" :buttonText="'luckyPoolRule'" isOutlined :color="`primary_${$route.params.token}`" @clickBtn="showRule('game')"></btn>

          <v-row style="width: 100%;" class="mb-sm-4">
            <v-col cols="12" align="center">
              <h3 :class="`primary_${$route.params.token}--text`">{{ $t('newLuckyAddress') }}</h3>
              <h3 class="d-none d-md-block">{{ roundData.last }}</h3>
              <h3 class="d-block d-md-none">{{ roundData.last ? `${roundData.last.slice(0, 6)}...${roundData.last.slice(38)}`:'' }}</h3>
            </v-col>
          </v-row>

          <v-row style="width: 100%;" class="mb-sm-4">
            <v-col cols="12" align="center">
              <h3 class="mb-3" :class="`primary_${$route.params.token}--text`">{{ $t('stepTable') }}</h3>
              <v-row class="white--text" :class="`primary_${$route.params.token}`">
                <v-col cols="6" align="center">
                  {{ $t('time') }}<br>({{ $t('blockchainBased') }})
                </v-col>
                <v-col cols="6" align="center">
                  {{ $t('accumPoolAmount') }}<br>({{ ($route.params.token).toUpperCase() }})
                </v-col>
              </v-row>
              <v-row class="game-data-row" v-for="(item, i) in gameTime" :key="i" :data-type="$route.params.token">
                <v-col cols="6" align="center">
                  {{ item }}
                </v-col>
                <v-col cols="6" align="center">
                  {{ gameData[`stage${i+1}`] ? (gameData[`stage${i+1}`] / (10 ** 18)).toLocaleString() : '--' }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="game-card card-wrap d-flex flex-column justify-center align-center">
          <div class="mb-4 d-flex flex-column align-center">
            <h2 :class="`primary_${$route.params.token}--text`">{{ $t('rankPool') }}</h2>
            <h2 class="red--text">{{ rankRoundData.toLocaleString() || null }} {{ ($route.params.token).toUpperCase() }}</h2>
          </div>

          <v-row style="width: 100%;" class="mb-sm-4">
            <v-col cols="12" align="center">
              <h3 :class="`primary_${$route.params.token}--text`">{{ $t('countdown') }}</h3>
              <countdown :countdown="rankCountdown" id="2"></countdown>
            </v-col>
          </v-row>

          <v-col cols="12" align="center">
            <h3 :class="`primary_${$route.params.token}--text`">{{ $t('currRound') }}</h3>
            <h3>{{ rankRound }}</h3>
          </v-col>

          <v-row style="width: 100%;" class="mb-2">
            <v-col cols="12" align="center">
              <h3 :class="`primary_${$route.params.token}--text`">{{ $t('myRankAmount') }}</h3>
              <h3>{{ (userData).toLocaleString() }}</h3>
            </v-col>
          </v-row>

          <btn class="mb-6" :buttonText="'rankPoolRule'" isOutlined :color="`primary_${$route.params.token}`" @clickBtn="showRule('rank')"></btn>

          <v-row style="width: 100%;" class="mb-8">
            <v-col cols="12" align="center">
              <v-data-table
                :headers="headers"
                :items="winnerList"
                :items-per-page="10"
                class="elevation-1"
              >
                <template v-slot:item.address="{ item }">
                  <span class="d-none d-md-block">{{ item.address }}</span>
                  <span class="d-block d-md-none">{{ `${item.address.slice(0, 6)}...${item.address.slice(35)}` }}</span>
                </template>
                <template v-slot:item.amount="{ item }">
                  <span style="width: 100px;">
                    {{ (item.amount / (10 ** 18)).toLocaleString() }}
                  </span>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
    <warning :warningShow="ruleShow" :content="$t(ruleTitle)" :rules="$t(rules)" :page="'rule'" @closeRule="ruleShow=false"></warning>
  </div>
</template>
<script>
import Game from '@/plugins/game.js'
import countdown from '@/components/countdown.vue'
import btn from '@/components/btn.vue'
import warning from '@/components/warning.vue'
export default {
  data (){
    return {
      ruleShow: false,
      rules: '',
      ruleTitle: '',
      gameContract: null,
      round: '--',
      rankRound: '--',
      roundData: {
        roundamount: '--',
        last: '--'
      },
      rankRoundData: '--',
      winnerList: [],
      headers: [
        {
          text: this.$t('rank'),
          align: 'center',
          value: 'rank',
          sortable: false,
          width: 60,
        },
        { text: this.$t('address'), value: 'address', sortable: false },
        { text: this.$t('rankAmount'), value: 'amount', sortable: false },
      ],
      ws: null,
      userData: '--',
      gameData: {},
      gameTime: [
        '24H', '12H', '6H', '3H', '1H', '30mins', '10mins'
      ],
      countdown: {
        hour: 0,
        min: 0,
        sec: 0,
      },
      rankCountdown: {
        hour: 0,
        min: 0,
        sec: 0,
      },
      stopTime: 0,
      status: 1,
    }
  },
  components:{
    countdown,
    btn,
    warning
  },
  methods:{
    async getRoundData(){
      // get round data
      try{
        this.roundData = await this.gameContract.getRoundDetails(this.round)
      }catch(error){
        this.roundData.roundamount = '--'
        this.roundData.last = '--'
        console.log('error', error)
      }
      // get rank data
      try{
        this.rankRoundData = await this.gameContract.getRankRoundDetails(this.rankRound)
      }catch(error){
        this.rankRoundData = '--'
        console.log('error', error)
      }
    },
    async getWinner(){
      try{
        let list = await this.gameContract.getWinner(this.round)
        for (let i=0; i<list.rank.length; i++){
          if (list.rank[i] === '0x0000000000000000000000000000000000000000'){
            break;
          }else{
            let data = {
              rank: i+1,
              // address: `${list.rank[i].slice(0, 10)}...${list.rank[i].slice(30)}`,
              address: list.rank[i],
              amount: list.rankamount[i],
            }
            this.winnerList.push(data)
          }
        }
      }catch(error){
        this.winnerList = []
        console.log('error', error)
      }
    },
    connectWs(){
      let _this = this
      this.ws = new WebSocket(`${this.$store.getters.wsBackendUrl}/api/v1/times`);
      this.ws.onopen = (e) => {
        console.log('[Client] Successfully Connected', e)
        _this.ws.send({})
      }
      this.ws.onmessage = function(e) {
        console.log('e', e.data)
        if (e.data === 'onorder' || e.data === 'noorder'){
          _this.status = 2
        }else if(e.data === 'opening'){
          _this.status = 3
        }else{
          let sec = parseInt(e.data) % 60
          let min = (Math.floor(parseInt(e.data) / 60) % 60).toFixed()
          let hour = (Math.floor(parseInt(e.data) / 60 / 60)).toFixed()
          // console.log(hour, min, sec)
          if (parseInt(e.data) > _this.stopTime){
            _this.countdown = {
              hour: parseInt(hour),
              min: parseInt(min),
              sec: parseInt(sec)
            }
          }
          _this.stopTime = parseInt(e.data)
          _this.status = 1
        }
      }
      this.ws.onclose = () => {
        this.$toasted.error(this.$t('renew'))
        console.log("closed");
      };
    },
    async getRankCountdown(){
      let time = await this.gameContract.getRankstoptime(this.rankRound)
      let offset = time - Date.now() / 1000
      let sec = parseInt(offset) % 60
      let min = (Math.floor(parseInt(offset) / 60) % 60).toFixed()
      let hour = (Math.floor(parseInt(offset) / 60 / 60)).toFixed()
      let day
      if (hour>23){
        hour = (Math.floor(parseInt(offset) / 60 / 60 % 24)).toFixed()
        day = (Math.floor(parseInt(offset) / 60 / 60 / 24)).toFixed()
      }
      // console.log(day, hour, min, sec)
      this.rankCountdown = {
        day: parseInt(day),
        hour: parseInt(hour),
        min: parseInt(min),
        sec: parseInt(sec)
      }
    },
    closeWs(){
      this.ws.close()
    },
    showRule(page){
      if (page === 'game'){
        this.ruleTitle = 'luckyPoolRule'
        this.rules = 'luckyPoolRuleText'
      }else{
        this.ruleTitle = 'rankPoolRule'
        this.rules = `rankPoolRuleText_${this.$route.params.token}`
      }
      this.ruleShow = true
    }
  },
  async mounted(){
    this.gameContract = await new Game()
    try{
      this.round = await this.gameContract.getCurrRound()
      this.rankRound = await this.gameContract.getRankRound()
    }catch(error){
      this.round = '--'
      this.rankRound = '--'
      console.log('error', error)
    }

    this.connectWs()
    await this.getRoundData()
    this.userData = await this.gameContract.getUserAmount(this.$store.state.account, this.rankRound)
    await this.getWinner()
    this.gameData = await this.gameContract.getGameData(this.round)
    await this.getRankCountdown()
  },
  async destroyed(){
    await this.closeWs()
  }
}
</script>
<style lang="scss">
.game-page{
  .game-data-row[data-type="tbt"]:nth-child(even){
    background-color: #E4DCEF;
  }
  .game-data-row[data-type="usdt"]:nth-child(even){
    background-color: #EDFEFE;
  }
}
</style>