<template>
  <VueModal
    v-if="open"
    @close="open = false"
    title="Transfer"
    class="small"
  >
    <div class="default-body">
      <p>Asset</p>
      <select :value="asset" class="form-select input-block mb-2">
        <option value="STEEM">STEEM</option>
        <option value="SBD">SBD</option>
      </select>
      <p>Recipient</p>
      <input
        name="to"
        value=""
        type="text"
        class="form-control input-lg input-block mb-2"
      />
      <p>Amount</p>
      <input
        name="amount"
        value="0.000"
        type="text"
        class="form-control input-lg input-block mb-2"
      />
      <p>Description</p>
      <textarea
        rows="3"
        class="form-control input-lg input-block mb-4"
        placeholder="Write an optional message"
      />
    </div>
    <div slot="footer" class="actions">
      <button class="btn btn-large btn-primary" @click="open = false">
        Confirm
      </button>
      <button class="btn btn-large btn-plain" @click="open = false">
        Cancel
      </button>
    </div>
  </VueModal>
</template>

<script>
export default {
  props: ['open', 'asset'],
};
</script>