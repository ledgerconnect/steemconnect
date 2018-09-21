<template>
  <VueModal
    v-if="open"
    @close="$emit('cancel')"
    :title="modalTitle"
    :locked="sending"
    class="small text-left"
  >
    <div class="default-body">
      <div v-if="failed" class="flash flash-error mb-4">
        Oops, something went wrong. Please try again later.
      </div>
      <Confirmation v-if="!!transactionId" :id="transactionId" />
      <span v-else v-html="modalText" />
    </div>
    <div slot="footer" class="actions">
      <button
        v-if="!!transactionId"
        @click="$emit('cancel')"
        class="btn btn-large btn-plain input-block"
      >
        Close
      </button>
      <template v-else>
        <button
          :disabled="sending"
          class="btn btn-large btn-primary"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
        <button
          :disabled="sending"
          class="btn btn-large btn-plain"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
      </template>
    </div>
  </VueModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    tab: {
      type: String,
      required: true,
    },
    amountToSell: {
      type: Object,
      required: true,
    },
    minToReceive: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sending: false,
      transactionId: '',
      failed: false,
    };
  },
  computed: {
    modalTitle() {
      return this.tab === 'buy' ? 'Buy SBD' : 'Sell SBD';
    },
    modalText() {
      if (this.tab === 'buy') {
        return this.calculateBody(this.amountToSell, this.minToReceive, 'buy');
      }

      return this.calculateBody(this.minToReceive, this.amountToSell, 'sell');
    },
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
  },
  watch: {
    open: 'reset',
  },
  methods: {
    ...mapActions(['createLimitOrder']),
    reset() {
      this.transactionId = '';
      this.failed = false;
    },
    calculateBody(from, to, text) {
      const rate = (from.amount / to.amount).toFixed(6);
      return `Are you sure you want to ${text} <b>${to.toString()}</b> for <b>${from.toString()}</b> (at ${rate} STEEM/SBD)?`;
    },
    async handleConfirm() {
      this.sending = true;

      const { amountToSell, minToReceive } = this;

      try {
        const confirmation = await this.createLimitOrder({ amountToSell, minToReceive });

        this.transactionId = confirmation.id;
        this.failed = false;
      } catch (err) {
        console.error(err);

        this.transactionId = '';
        this.failed = true;
      }

      this.sending = false;
    },
  },
};
</script>
