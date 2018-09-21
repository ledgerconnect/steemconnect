<template>
  <VueModal
    v-if="open"
    @close="$emit('cancel')"
    title="Cancel order"
    :locked="sending"
    class="small"
  >
    <div class="default-body">
      <div v-if="failed" class="flash flash-error mb-4">
        We couldn't cancel this order. Please try again later.
      </div>
      <Confirmation v-if="!!transactionId" :id="transactionId" />
      <span v-else>
        Are you sure you want to cancel the order <b>{{orderId}}</b>?
      </span>
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
          @click="handleCancelOrder"
        >
          {{ confirmText }}
        </button>
        <button
          class="btn btn-large btn-plain"
          :disabled="sending"
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
    orderId: {
      type: Number,
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
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
  },
  watch: {
    open: 'reset',
  },
  methods: {
    ...mapActions(['cancelLimitOrder']),
    reset() {
      this.transactionId = '';
      this.failed = false;
    },
    async handleCancelOrder() {
      this.sending = true;

      try {
        const confirmation = await this.cancelLimitOrder(this.orderId);

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
