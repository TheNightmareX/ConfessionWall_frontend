<template>
  <div>
    <v-form id="form" ref="form">
      <div
        class="mb-10"
        v-for="[id, name, objName] in [
          [1, '你', 'sender'],
          [2, 'TA', 'receiver'],
        ]"
        :key="id"
      >
        <v-text-field
          v-model="data[objName].nickname"
          :label="`${name}的昵称`"
          :color="colorMap[data[objName].sex]"
          counter="10"
          :rules="[
            (v) => !!v || '此项必填',
            (v) => v.length <= 10 || '至多十个字符',
          ]"
        ></v-text-field>
        <v-text-field
          v-model="data[objName].realname"
          :label="`${name}的姓名(不会显示)`"
          :color="colorMap[data[objName].sex]"
          counter="3"
          :rules="[
            (v) => !!v || '此项必填',
            (v) => v.length <= 3 || '至多三个字符',
          ]"
        >
        </v-text-field>

        <v-select
          v-model="data[objName].sex"
          :items="sexChoices"
          :label="`${name}的性别`"
          :color="colorMap[data[objName].sex]"
        ></v-select>
      </div>

      <v-textarea
        class="mb-10"
        v-model="data.text"
        rows="1"
        auto-grow
        clearable
        label="我要对TA说："
        color="orange"
        :rules="[(v) => !!v || '此项必填']"
      >
      </v-textarea>

      <v-btn color="primary" block @click="submit" :disabled="disabled"
        >表白!</v-btn
      >
    </v-form>
  </div>
</template>

<script>
import { createConfession } from "../apis";

const sexMap = {
  ...{ m: "男", f: "女", "": "保密" },
  ...{ 男: "m", 女: "f", 保密: "" },
};

export default {
  name: "New",

  data() {
    return {
      colorMap: {
        保密: "white",
        男: "blue",
        女: "purple",
      },
      sexChoices: ["男", "女", "保密"],
      data: {
        sender: {
          nickname: "",
          realname: "",
          sex: "男",
        },
        receiver: {
          nickname: "",
          realname: "",
          sex: "女",
        },
        text: "",
      },
      disabled: false,
    };
  },

  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.disabled = true;
        try {
          await createConfession({
            sender: {
              nickname: this.data.sender.nickname,
              realname: this.data.sender.realname,
              sex: sexMap[this.data.sender.sex],
            },
            receiver: {
              nickname: this.data.receiver.nickname,
              realname: this.data.receiver.realname,
              sex: sexMap[this.data.receiver.sex],
            },
            text: this.data.text,
          });
          this.disabled = false;
          this.$router.push({ name: "home" });
        } catch {
          this.disabled = false;
        }
      }
    },
  },
};
</script>

<style scoped>
#form {
  margin: 30px 10%;
}
</style>