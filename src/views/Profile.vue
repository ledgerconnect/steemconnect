<template>
  <div>
    <Header title="Profile" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <form @submit.prevent="handleSubmit" class="mb-4">
          <label>Account type</label>
          <div class="mb-2">
            <input v-model="draft.type" type="radio" value="user" id="type-user" class="mr-2" />
            <label for="type-user" class="mr-3">User</label>
            <input v-model="draft.type" type="radio" value="app" id="type-app" class="mr-2" />
            <label for="type-app" class="mr-3">Application</label>
          </div>
          <label for="name">Name</label>
          <input
            v-model.trim="draft.name"
            id="name"
            name="name"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="profile_image">Profile picture URL</label>
          <input
            v-model.trim="draft.profile_image"
            id="profile_image"
            name="profile_image"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="cover_image">Cover image URL</label>
          <input
            v-model.trim="draft.cover_image"
            id="cover_image"
            name="cover_image"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="about">About</label>
          <textarea
            v-model.trim="draft.about"
            id="about"
            name="about"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="256"
            rows="3"
          ></textarea>
          <label for="website">Website</label>
          <input
            v-model.trim="draft.website"
            id="website"
            name="website"
            type="url"
            class="form-control input-lg input-block mb-2"
            maxlength="128"
            placeholder="i.e. https://example.com"
          />
          <label for="location">Location</label>
          <input
            v-model.trim="draft.location"
            id="location"
            name="location"
            type="text"
            maxlength="64"
            class="form-control input-lg input-block mb-2"
          />
          <div v-if="draft.type === 'app'">
            <label for="redirect_uris">Redirect URIs</label>
            <textarea
              v-model.trim="draft.redirect_uris"
              id="redirect_uris"
              name="redirect_uris"
              type="text"
              class="form-control input-lg input-block mb-2"
              rows="3"
              placeholder="i.e. https://example.com/callback"
            ></textarea>
            <div>
              <legend class="mb-2 d-block">
                One URI per line. Need to have a protocol, no URL fragments, and no relative paths.
              </legend>
            </div>
            <label for="creator">Creator</label>
            <input
              v-model.trim="draft.creator"
              id="creator"
              name="creator"
              type="text"
              maxlength="16"
              class="form-control input-lg input-block mb-2"
            />
            <label>Status</label>
            <div class="mb-2">
              <input
                v-model="draft.is_public"
                type="radio"
                value="1"
                id="public-true"
                class="mr-2"
              />
              <label for="public-true" class="mr-3">Production</label>
              <input
                v-model="draft.is_public"
                type="radio"
                value="0"
                id="public-false"
                class="mr-2"
              />
              <label for="public-false" class="mr-3">Sandbox</label>
            </div>
            <label for="secret">Secret</label>
            <input
              v-model.trim="draft.secret"
              id="secret"
              name="secret"
              type="text"
              class="form-control input-lg input-block mb-2"
            />
            <div>
              <legend class="mb-2 d-block">
                Leave this field blank to keep your secret unchanged.
              </legend>
            </div>
          </div>
          <button type="submit" class="btn btn-large mb-2 mt-2">
            Continue
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { encodeOp } from 'steem-uri';
import { createHash } from 'crypto';
import { jsonParse } from '@/helpers/utils';

export default {
  data() {
    return {
      draft: {
        type: 'user',
        name: null,
        profile_image: null,
        cover_image: null,
        about: null,
        website: null,
        location: null,
        redirect_uris: null,
        creator: null,
        is_public: '0',
        secret: null,
      },
    };
  },
  computed: {
    account() {
      return this.$store.state.auth.account;
    },
    profile() {
      let profile = {};
      const metadata = jsonParse(this.account.json_metadata);
      if (metadata.profile && typeof metadata.profile === 'object') {
        // eslint-disable-next-line prefer-destructuring
        profile = metadata.profile;
      }
      return profile;
    },
  },
  mounted() {
    const { profile } = this;
    profile.is_public = profile.is_public ? '1' : '0';
    profile.redirect_uris = profile.redirect_uris ? profile.redirect_uris.join('\n') : '';
    delete profile.secret;
    this.draft = { ...this.draft, ...profile };
  },
  methods: {
    handleSubmit() {
      const draft = JSON.parse(JSON.stringify(this.draft));
      draft.is_public = draft.is_public === '1';
      if (draft.secret) {
        draft.secret = createHash('sha256')
          .update(draft.secret)
          .digest('hex');
      } else {
        delete draft.secret;
      }
      if (draft.redirect_uris) {
        draft.redirect_uris = draft.redirect_uris
          .split('\n')
          .map(uri => uri.trim())
          .filter(uri => uri);
      }
      Object.keys(draft).forEach(key => draft[key] == null && delete draft[key]);
      const profile = { ...this.profile, ...draft };

      let metadata = jsonParse(this.account.json_metadata);
      metadata = { ...metadata, profile };

      const op = [
        'account_update',
        {
          account: this.account.name,
          memo_key: this.account.memo_key,
          json_metadata: JSON.stringify(metadata),
        },
      ];
      const uri = encodeOp(op).replace('steem://', '');
      this.$router.push(uri);
    },
  },
};
</script>
