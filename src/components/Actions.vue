<template>
  <div>
    <div class="columns mb-4 bg-gray-light text-uppercase rounded-2 overflow-hidden">
      <div class="column px-0 one-half">
        <a
          :class="tab === 'buy' ? 'bg-green-light d-block p-2' : 'd-block p-2'"
          @click="tab = 'buy'"
        >
          Buy
        </a>
      </div>
      <div class="column px-0 one-half">
        <a
          :class="tab === 'sell' ? 'bg-red-light d-block p-2' : 'd-block p-2'"
          @click="tab = 'sell'"
        >
          Sell
        </a>
      </div>
    </div>
    <div class="columns">
      <form class="text-left">
        <p>Quantity (SBD)</p>
        <input
          name="quantity"
          value="0.000"
          class="form-control input-lg input-block mb-2"
        />
        <p>Bid price (STEEM)</p>
        <input
          name="quantity"
          value="0.000000"
          class="form-control input-lg input-block mb-2"
        />
        <p>Total (STEEM)</p>
        <input
          name="quantity"
          value="0.000"
          class="form-control input-lg input-block mb-4"
        />
        <div class="text-uppercase">
          <button
            class="width-full border-0 bg-green-light p-2 rounded-2"
            v-if="tab === 'buy'"
          >
            Buy SBD
          </button>
          <button
            class="width-full border-0 bg-red-light p-2 rounded-2"
            v-if="tab === 'sell'"
          >
            Sell SBD
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'buy',
    };
  },
};
</script>