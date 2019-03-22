<template>
  <div>
    <Header title="Profile" />
    <div class="p-4 after-header">
      <div class="container-sm mx-auto">
        <form @submit.prevent="handleSubmit" class="mb-4">
          <label>Account type</label>
          <div class="mb-2">
            <input v-model="type" type="radio" value="user" id="type-user" class="mr-2" checked />
            <label for="type-user" class="mr-3">User</label>
            <input v-model="type" type="radio" value="app" id="type-app" class="mr-2" />
            <label for="type-app" class="mr-3">Application</label>
          </div>
          <label for="name">Name</label>
          <input
            v-model.trim="name"
            id="name"
            name="name"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="image">Profile picture URL</label>
          <input
            v-model.trim="image"
            id="image"
            name="image"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="cover">Cover image URL</label>
          <input
            v-model.trim="cover"
            id="cover"
            name="cover"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="64"
          />
          <label for="about">About</label>
          <textarea
            v-model.trim="about"
            id="about"
            name="about"
            type="text"
            class="form-control input-lg input-block mb-2"
            maxlength="256"
            rows="3"
          ></textarea>
          <label for="website">Website</label>
          <input
            v-model.trim="website"
            id="website"
            name="website"
            type="url"
            class="form-control input-lg input-block mb-2"
            maxlength="128"
          />
          <label for="location">Location</label>
          <input
            v-model.trim="location"
            id="location"
            name="location"
            type="text"
            maxlength="64"
            class="form-control input-lg input-block mb-2"
          />
          <div v-if="type === 'app'">
            <label for="redirectUris">Redirect URIs</label>
            <textarea
              v-model.trim="redirectUris"
              id="redirectUris"
              name="redirectUris"
              type="text"
              class="form-control input-lg input-block mb-2"
              rows="3"
            ></textarea>
            <label for="creator">Creator</label>
            <input
              v-model.trim="creator"
              id="creator"
              name="creator"
              type="text"
              maxlength="16"
              class="form-control input-lg input-block mb-2"
            />
            <label>Status</label>
            <div class="mb-2">
              <input v-model="isPublic" type="radio" value="1" id="public-true" class="mr-2" checked />
              <label for="public-true" class="mr-3">Production</label>
              <input v-model="isPublic" type="radio" value="0" id="public-false" class="mr-2" />
              <label for="public-false" class="mr-3">Sandbox</label>
            </div>
            <label for="secret">Secret</label>
            <input
              v-model.trim="secret"
              id="secret"
              name="secret"
              type="text"
              class="form-control input-lg input-block mb-2"
            />
            <div>
              <legend class="mb-2 d-block">Leave this field blank to keep your secret unchanged.</legend>
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
export default {
  data() {
    return {
      type: 'user',
      name: null,
      image: null,
      cover: null,
      about: null,
      website: null,
      location: null,
      redirectUris: null,
      creator: null,
      isPublic: 0,
      secret: null,
    };
  },
  methods: {
    handleSubmit() {
      alert('OK');
    },
  },
};
</script>
