<template>
  <v-form id="container" ref="form" :disabled="loggingIn">
    <v-text-field
      v-model="username"
      label="User"
      :rules="[rules.required]"
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="[rules.required]"
    ></v-text-field>
    <v-btn block :loading="loggingIn" @click="login">login</v-btn>
  </v-form>
</template>

<script>
import "vue-router";
import storage from "../../storage";
import { auth } from "../../apis";

export default {
  data() {
    return {
      username: "",
      password: "",
      rules: {
        required: (v) => !!v || "Required",
      },
      loggingIn: false,
    };
  },

  methods: {
    async login() {
      if (!this.$refs.form.validate()) return;
      try {
        this.loggingIn = true;
        await auth.login(this.username, this.password);
        storage.authed = true;
        this.$router.push({ name: "home" });
      } finally {
        this.loggingIn = false;
      }
    },
  },
};
</script>

<style scoped>
#container {
  margin: 10%;
}
</style>