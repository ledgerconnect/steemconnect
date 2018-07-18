<template>
  <div class="columns">
    <div class="column col-2">
      Last price<br/>
      {ticker.latest}}
    </div>
    <div class="column col-2">
      Ask<br/>
      {{ticker.lowest_ask}}
    </div>
    <div class="column col-2">
      Bid<br/>
      {{ticker.highest_bid}}
    </div>
    <div class="column col-2">
      Spread<br/>
      {{ticker.percent_change}}
    </div>
    <div class="column col-2">
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
