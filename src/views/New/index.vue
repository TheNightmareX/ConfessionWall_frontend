<template>
  <v-form id="container" ref="form" :disabled="disabled">
    <div
      v-for="[key, name, objName] in [
        [1, '你', 'sender'],
        [2, 'TA', 'receiver'],
      ]"
      :key="key"
    >
      <v-text-field
        v-model="data[objName].displayName"
        :label="`${name}的昵称`"
        :color="data[objName].sex | sexColor"
        counter="10"
        :rules="[
          (v) => !!v || '喂喂喂怎么称呼都不告诉的嘛',
          (v) => v.length <= 10 || '昵称太长啦',
        ]"
      ></v-text-field>

      <v-select
        v-model="data[objName].sex"
        :items="[
          { value: 'M', text: '大帅比' },
          { value: 'F', text: '大漂亮' },
          { value: 'X', text: '外星生物' },
        ]"
        :label="`${name}的品种`"
        :color="data[objName].sex | sexColor"
        :item-color="data[objName].sex | sexColor"
      ></v-select>
    </div>

    <div>
      <v-textarea
        class="mb-5"
        v-model="data.text"
        rows="1"
        auto-grow
        clearable
        counter="520"
        label="你想对TA说的话"
        color="accent"
        :rules="[
          (v) => !!v || '不想说点什么嘛',
          (v) => v.length <= 520 || '话太多啦',
        ]"
      >
      </v-textarea>
    </div>

    <div>
      <v-btn
        color="primary"
        block
        @click="submit"
        :loading="loading"
        :disabled="disabled"
        >{{ tooMany ? "可真够花心的" : "表白!" }}
      </v-btn>
    </div>

    <div></div>
  </v-form>
</template>

<script>
import { confessions, people } from "../../apis";
import storage from "../../storage";

export default {
  data() {
    return {
      data: {
        sender: {
          displayName: "",
          sex: "M",
        },
        receiver: {
          displayName: "",
          sex: "F",
        },
        text: "",
      },
      loading: false,
    };
  },

  computed: {
    authed() {
      return storage.authed;
    },
    tooMany() {
      return !this.authed && storage.confessionCount >= 1;
    },
    disabled() {
      return this.loading || this.tooMany;
    },
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true;
          const { sender, receiver, text } = this.data;
          await confessions.create(await this.getPersonID(sender), await this.getPersonID(receiver), text);
          storage.confessionCount++;
          this.$router.push({ name: "home" });
        } finally {
          this.loading = true;
        }
      }
    },
    async getPersonID(person) {
      let id
      try {
        id = await people.queryID(person);
      } catch {
        id = (await people.create(person)).id
      }
      return id
    },
  },

  filters: {
    sexColor(v) {
      return {
        X: "white",
        M: "blue",
        F: "purple",
      }[v];
    },
  },
};
</script>

<style scoped>
#container {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 10%;
}
</style>
