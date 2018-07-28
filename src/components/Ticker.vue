<template>
  <div class="columns m-0 border-bottom">
    <div class="column col-2 px-4 py-3 border-right">
      <b>{{asset}}</b>-STEEM<br/>
      Steem Dollars
    </div>
    <div class="column col-2 px-4 py-3 border-right">
      {{$n(ticker.latest)}}<br/>
      Last price
    </div>
    <div class="column col-2 px-4 py-3 border-right">
      {{$n(ticker.lowest_ask)}}<br/>
      Ask
    </div>
    <div class="column col-2 px-4 py-3 border-right">
      {{$n(ticker.highest_bid)}}<br/>
      Bid
    </div>
    <div class="column col-2 px-4 py-3 border-right">
      {{$n(ticker.percent_change, 'percent')}}<br/>
      Spread
    </div>
    <div class="column col-2 px-4 py-3">
      {{ticker.steem_volume}}<br/>
      24h volume
    </div>
  </div>
</template>

<script>
export default {
  props: ['asset', 'ticker'],
};
</script>
