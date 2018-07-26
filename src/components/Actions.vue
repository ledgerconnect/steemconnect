<template>
  <div class="columns">
    <div class="column one-half">
      <div class="text-uppercase width-full bg-green-light p-2 rounded-2">
        Buy
      </div>
    </div>
    <div class="column one-half">
      <div class="text-uppercase width-full bg-red-light p-2 rounded-2">
        Sell
      </div>
    </div>
    <div class="text-left">
      <p>Quantity</p>
      <input
        name="quantity"
        v-model="quantity"
        class="form-control input-lg input-block mb-2"
      />
      <p>Bid price</p>
      <input
        name="quantity"
        v-model="bid"
        class="form-control input-lg input-block mb-2"
      />
      <p>Total</p>
      <input
        name="quantity"
        v-model="total"
        class="form-control input-lg input-block mb-2"
      />
    </div>
    <div class="width-full text-uppercase bg-green-light column p-2 rounded-2">
      Buy SBD
    </div>
  </div>
</template>
