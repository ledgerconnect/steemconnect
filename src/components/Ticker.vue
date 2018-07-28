<template>
  <div class="columns m-0 border mb-4">
    <div class="column col-2 border-right">
      Last price<br/>
      {{$n(ticker.latest)}}
    </div>
    <div class="column col-2 border-right">
      Ask<br/>
      {{$n(ticker.lowest_ask)}}
    </div>
    <div class="column col-2 border-right">
      Bid<br/>
      {{$n(ticker.highest_bid)}}
    </div>
    <div class="column col-2 border-right">
      Spread<br/>
      {{$n(ticker.percent_change, 'percent')}}
    </div>
    <div class="column col-2 border-right">
      24h volume STEEM<br/>
      {{ticker.steem_volume}}
    </div>
    <div class="column col-2">
      24h volume SBD<br/>
      {{ticker.sbd_volume}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['ticker'],
};
</script>
