<template>
  <div class="p-4">
    <h1>Settings</h1>
    <form class="container-sm mx-0 mb-4">
      <p>Language</p>
      <select value="en" class="form-select input-block mb-2">
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      <p>Session timeout in</p>
      <select value="5" class="form-select input-block mb-2">
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
        <option value="20">20 minutes</option>
        <option value="40">40 minutes</option>
        <option value="60">1 hour</option>
      </select>
      <p>Theme</p>
      <select value="white" class="form-select input-block mb-2">
        <option value="white">White</option>
        <option value="black">Black</option>
      </select>
      <p>Node address</p>
      <input
        name="to"
        value="https://api.steemit.com"
        type="text"
        class="form-control input-lg input-block mb-2"
      />
    </form>
  </div>
</template>
