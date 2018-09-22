<template>
  <VueModal
    v-if="open"
    @close="$emit('cancel')"
    :locked="sending"
    title="Unfollow"
    class="small"
  >
    <div class="default-body">
      <div v-if="failed" class="flash flash-error mb-4">
        Oops, something went wrong. Please try again later.
      </div>
      <Confirmation v-if="!!transactionId" :id="transactionId" />
      <span v-else>
        Are you sure you want to stop following <b>{{ username }}</b>?
      </span>
    </div>
    <div slot="footer" class="actions">
      <button
        v-if="!!transactionId"
        class="btn btn-large btn-plain input-block"
        @click="$emit('cancel')"
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
    username: {
      type: String,
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
    confirmText() {
      if (this.sending) return 'Sending';

      return this.failed ? 'Retry' : 'Confirm';
    },
    confirmDisabled() {
      return this.sending;
    },
  },
  watch: {
    open: 'reset',
  },
  methods: {
    ...mapActions(['unfollow']),
    reset() {
      this.transactionId = '';
      this.failed = false;
    },
    async handleConfirm() {
      this.sending = true;

      try {
        const confirmation = await this.unfollow(this.username);

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
