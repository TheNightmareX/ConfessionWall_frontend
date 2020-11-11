<template>
  <v-form id="container" ref="form" :disabled="disabled">
    <span
      v-for="[key, name, objName] in [
        [1, '你', 'sender'],
        [2, 'TA', 'receiver'],
      ]"
      :key="key"
    >
      <v-text-field
        v-model="data[objName].nickname"
        :label="`${name}的昵称`"
        :color="data[objName].sex | sexColor"
        counter="10"
        :rules="[
          (v) => !!v || '喂喂喂怎么称呼都不告诉的嘛',
          (v) => v.length <= 10 || '昵称太长啦',
        ]"
      ></v-text-field>

      <v-text-field
        v-model="data[objName].realname"
        :label="`${name}的姓名(不会显示)`"
        :color="data[objName].sex | sexColor"
        counter="3"
        :rules="[
          (v) => !!v || '信不过的话随便填就好啦',
          (v) => v.length <= 3 || '名字太长啦',
        ]"
      >
      </v-text-field>

      <v-select
        v-model="data[objName].sex"
        :items="[
          { value: 'm', text: '大帅比' },
          { value: 'f', text: '大漂亮' },
          { value: '', text: '外星生物' },
        ]"
        :label="`${name}的品种`"
        :color="data[objName].sex | sexColor"
        :item-color="data[objName].sex | sexColor"
      ></v-select>
    </span>

    <span>
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
    </span>

    <span>
      <v-btn
        color="primary"
        block
        @click="submit"
        :loading="loading"
        :disabled="disabled"
        >{{ tooMany ? "可真够花心的" : "表白!" }}
      </v-btn>
    </span>
  </v-form>
</template>

<script>
import { createConfession } from "../../apis";
import storage from "../../storage";

export default {
  data() {
    return {
      data: {
        sender: {
          nickname: "",
          realname: "",
          sex: "m",
        },
        receiver: {
          nickname: "",
          realname: "",
          sex: "f",
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
          await createConfession(sender, receiver, text);
          storage.confessionCount++;
          this.$router.push({ name: "home" });
        } finally {
          this.loading = true;
        }
      }
    },
  },

  filters: {
    sexColor(v) {
      return {
        "": "white",
        m: "blue",
        f: "purple",
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
  padding: 0 10% 10%;
}
</style>
