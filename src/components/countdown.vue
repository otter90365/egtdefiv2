<template>
  <div class="wrap">  
    <div :class="`countdown${id} countdown`">
      <div v-show="total_seconds>=86400" :class="`bloc-time${id}`" class="bloc-time days" :data-init-value="countNum.day">
        <span class="count-title">DAYS</span>

        <div :class="`figure${id}`" class="figure days days-1">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>

        <div :class="`figure${id}`" class="figure days days-2">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span></span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>
      </div>

      <div v-show="countdown.day" class="mt-10">：</div>

      <div :class="`bloc-time${id}`" class="bloc-time hours" :data-init-value="countNum.hour">
        <span class="count-title">HOURS</span>

        <div :class="`figure${id}`" class="figure hours hours-1">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>

        <div :class="`figure${id}`" class="figure hours hours-2">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span></span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>
      </div>

      <div class="mt-10">：</div>

      <div :class="`bloc-time${id}`" class="bloc-time min" :data-init-value="countNum.min">
        <span class="count-title">MINS</span>

        <div :class="`figure${id}`" class="figure min min-1">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>        
        </div>

        <div :class="`figure${id}`" class="figure min min-2">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>
      </div>

      <div v-show="total_seconds<86400" class="mt-10">：</div>

      <div v-show="total_seconds<86400" :class="`bloc-time${id}`" class="bloc-time sec" :data-init-value="countNum.sec">
        <span class="count-title">SECS</span>

          <div :class="`figure${id}`" class="figure sec sec-1">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>          
        </div>

        <div :class="`figure${id}`" class="figure sec sec-2">
          <span :class="`top${id} top`">-</span>
          <span :class="`top-back${id} top-back`">
            <span>-</span>
          </span>
          <span :class="`bottom${id} bottom`">-</span>
          <span :class="`bottom-back${id} bottom-back`">
            <span>-</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gsap } from "gsap";
export default {
  name: 'countdown',
  props:{
    id:{
      type: String,
      default: '1',
    },
    countdown: {
      type: Object,
      default: ()=>{
        return {}
      } 
    }
  },
  data(){
    return {
      ele: {},
      total_seconds: 0,
      countdown_interval: null,
      countNum: {
        day: 0,
        hour: 0,
        min: 0,
        sec: 0,
      },
      // values: {}
    }
  },
  watch:{
    countdown: {
      handler: function(newVal){
        if (parseInt(newVal.day) === 0 && parseInt(newVal.hour) === 0 && parseInt(newVal.min) === 0 && parseInt(newVal.sec) === 0){
          if (this.countdown_interval){
            this.countNum = {
              day: 0,
              hour: 0,
              min: 0,
              sec: 0,
            }
            window.clearInterval(this.countdown_interval);
          }
        }else{
          this.countNum = newVal
        }
      },
      deep: true,
    },
    countNum:{
      handler: function(){
        this.start()
      },
      deep: true,
    }
  },
  methods:{
    // Initialize the countdown
    start(){
      // DOM
      let day
      let hours = document.getElementsByClassName(`bloc-time${this.id} hours`)
      let min = document.getElementsByClassName(`bloc-time${this.id} min`)[0]
      let secs = document.getElementsByClassName(`bloc-time${this.id} sec`)
      if (this.countdown.day > 0){
        day = document.getElementsByClassName(`bloc-time${this.id} days`)[0]
      }
      this.ele = {
        days  : day ? day.getElementsByClassName(`figure${this.id}`) : null,
        hours  : hours[0].getElementsByClassName(`figure${this.id}`),
        minutes: min.getElementsByClassName(`figure${this.id}`),
        seconds: secs[0].getElementsByClassName(`figure${this.id}`)
      };

      // Init countdown values
      // this.values = {
      //   hours  : parseInt(hour.getAttribute('data-init-value')),
      //   minutes: parseInt(min.getAttribute('data-init-value')),
      //   seconds: parseInt(sec.getAttribute('data-init-value')),
      // };
      this.values = {
        days  : this.countNum.day || 0,
        hours  : this.countNum.hour,
        minutes: this.countNum.min,
        seconds: this.countNum.sec,
      };

      // console.log('this.values', this.values)
      
      // Initialize total seconds
      this.total_seconds = this.values.days * 60 * 60 * 24 + this.values.hours * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;

      // Animate countdown to the end 
      this.count();    
    },
    count(){
      var that = this,
          $day_1 = this.ele.days ? this.ele.days[0] : null,
          $day_2 = this.ele.days ? this.ele.days[1] : null,
          $hour_1 = this.ele.hours[0],
          $hour_2 = this.ele.hours[1],
          $min_1  = this.ele.minutes[0],
          $min_2  = this.ele.minutes[1],
          $sec_1  = this.ele.seconds[0],
          $sec_2  = this.ele.seconds[1];
      this.countdown_interval = setInterval(function() {
        if(that.total_seconds > 0) {
          --that.values.seconds;              

          if(that.values.minutes >= 0 && that.values.seconds < 0) {
            that.values.seconds = 59;
            --that.values.minutes;
          }

          if(that.values.hours >= 0 && that.values.minutes < 0) {
            that.values.minutes = 59;
            --that.values.hours;
          }

          if(that.values.days >= 0 && that.values.hours < 0) {
            that.values.hours = 23;
            --that.values.days;
          }

          // Update DOM values
          // Days
          if ($day_1 && $day_2){
            that.checkHour(that.values.days, $day_1, $day_2);
          }

          // Hours
          that.checkHour(that.values.hours, $hour_1, $hour_2);

          // Minutes
          that.checkHour(that.values.minutes, $min_1, $min_2);

          // Seconds
          that.checkHour(that.values.seconds, $sec_1, $sec_2);

          --that.total_seconds;
        }
        else {
          window.clearInterval(that.countdown_interval);
        }
      }, 1000);
    },
    animateFigure($el, value){
      var  $top         = $el.getElementsByClassName(`top${this.id}`)[0]
      var  $bottom      = $el.getElementsByClassName(`bottom${this.id}`)[0]
      var  $back_top    = $el.getElementsByClassName(`top-back${this.id}`)[0]
      var  $back_bottom = $el.getElementsByClassName(`bottom-back${this.id}`)[0]

      // Before we begin, change the back value
      $back_top.getElementsByTagName('span')[0].innerHTML = value;

      // Also change the back bottom value
      $back_bottom.getElementsByTagName('span')[0].innerHTML = value;

      // Then animate
      gsap.to($top, 0.8, {
        rotationX           : '-180deg',
        transformPerspective: 300,
        ease                : "power2.out",
        onComplete          : function() {
          $top.innerHTML = value;
          $bottom.innerHTML = value;
          gsap.set($top, { rotationX: 0 });
        }
      });

      gsap.to($back_top, 0.8, { 
          rotationX           : 0,
          transformPerspective: 300,
          ease                : "power2.out",
          clearProps          : 'all' 
      });
    },
    checkHour(value, $el_1, $el_2){
      var val_1       = value.toString().charAt(0),
          val_2       = value.toString().charAt(1),
          fig_1_value = $el_1.getElementsByClassName(`top${this.id}`)[0].innerHTML,
          fig_2_value = $el_2.getElementsByClassName(`top${this.id}`)[0].innerHTML;

      if(value >= 10) {
        // Animate only if the figure has changed
        if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
        if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
      }
      else {
        // If we are under 10, replace first figure with 0
        if(fig_1_value !== '0') this.animateFigure($el_1, 0);
        if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
      }    
    }
  },
  destroyed(){
    if (this.countdown_interval){
      window.clearInterval(this.countdown_interval);
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #1a1a1a;
}

// Title
h1 {  
  margin-bottom: 60px;
  text-align: center;
  font: 300 2.25em 'Arial';
  text-transform: uppercase;
  
  strong {
    font-weight: 400;
    color: #ea4c4c;
  }  
}

h2 {
  margin-bottom: 80px;  
  text-align: center;  
  font: 300 0.7em 'Arial'; 
  text-transform: uppercase;  
  
  strong {    
    font-weight: 400;   
  }
}

// Countdown
.countdown {
  width: 100%;
  // margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .bloc-time {
    float: left;    
    margin-right: 10px;
    text-align: center;
    &:last-child {
      margin-right: 0;
    }
  }

  .count-title {
    display: block;
    margin: 10px 0;
    font: normal 0.94em 'Verdana';
    color: #1a1a1a;
    text-transform: uppercase;
  }

  .figure {
    position: relative;
    float: left;
    height: 100px;
    width: 60px;
    margin-right: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .2), inset 2px 4px 0 0 rgba(255, 255, 255, .08);
    // @include box-shadow(0 3px 4px 0 rgba(0, 0, 0, .2),inset 2px 4px 0 0 rgba(255, 255, 255, .08));
    @media screen and (max-width: 1201px){
      height: 70px;
      width: 40px;
    }
    @media screen and (max-width: 961px){
      height: 85px;
      width: 45px;
    }
    @media screen and (max-width: 769px){
      height: 70px;
      width: 35px;
    }
    @media screen and (max-width: 426px){
      height: 40px;
      width: 23px;
      border-radius: 4px;
    }

    &:last-child {
      margin-right: 0;
    }
  
    >span {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      font: normal 5.94em/107px 'Arial';
      font-weight: 700;
      color: #de4848;
      @media screen and (max-width: 1201px){
        font: normal 60px 'Arial';
      }
      @media screen and (max-width: 961px){
        font: normal 75px 'Arial';
      }
      @media screen and (max-width: 769px){
        font: normal 60px 'Arial';
      }
      @media screen and (max-width: 426px){
        font: normal 33px 'Arial';
      }
    }

    .top, .bottom-back {    
      &:after {
        content: "";
        position: absolute;
        z-index: -1;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
      }
    }

    .top {
      z-index: 3;
      background-color: #f7f7f7;
      transform-origin: 50% 100%;
      -webkit-transform-origin: 50% 100%;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      transform: perspective(200px);
      // @include border-top-radius(10px); 
      // @include transform(perspective(200px));
    }

    .bottom {  
      z-index: 1;
      
      &:before {
        content: "";
        position: absolute;
        display: block; 
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background-color: rgba(0, 0, 0, .02);
      }
    }

    .bottom-back {
      z-index: 2;
      top: 0;
      height: 50%;
      overflow: hidden;    
      background-color: #f7f7f7;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      // @include border-top-radius(10px);

      span {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }

    .top, .top-back {
      height: 50%;
      overflow: hidden;
      backface-visibility: hidden;
      // @include backface-visibility(hidden);
    }

    .top-back {
      z-index: 4;
      bottom: 0;
      background-color: #fff;
      -webkit-transform-origin: 50% 0;
      transform-origin: 50% 0;
      transform: perspective(200px) rotateX(180deg);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      // @include transform(perspective(200px) rotateX(180deg));
      // @include border-bottom-radius(10px); 

      span {
        position: absolute;
        top: -100%;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
}
</style>