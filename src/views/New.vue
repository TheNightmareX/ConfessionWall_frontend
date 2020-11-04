<template>
  <div>
    <v-form id="form" ref="form">
      <div
        class="mb-3"
        v-for="[id, name, objName] in [
          [1, '你', 'sender'],
          [2, 'TA', 'receiver'],
        ]"
        :key="id"
      >
        <v-text-field
          v-model="data[objName].nickname"
          :label="`${name}的昵称`"
          :color="colorMapping[data[objName].sex]"
          counter="10"
          :rules="[
            (v) => !!v || '此项必填',
            (v) => v.length <= 10 || '至多十个字符',
          ]"
        ></v-text-field>
        <v-text-field
          v-model="data[objName].realname"
          :label="`${name}的姓名(不会显示)`"
          :color="colorMapping[data[objName].sex]"
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
          :color="colorMapping[data[objName].sex]"
          :item-color="colorMapping[data[objName].sex]"
        ></v-select>
      </div>

      <v-textarea
        class="mb-10"
        v-model="data.text"
        rows="1"
        auto-grow
        clearable
        label="我要对TA说:"
        color="orange"
        :rules="[(v) => !!v || '此项必填']"
      >
      </v-textarea>

      <v-btn color="primary" block @click="submit" :disabled="disabled">
        表白!
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { createConfession } from "../apis/index";

const sexMapping = {
  ...{ m: "男", f: "女", "": "保密" },
  ...{ 男: "m", 女: "f", 保密: "" },
};

export default {
  data() {
    return {
      colorMapping: {
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
        try {
          this.disabled = true;
          const { sender, receiver, text } = this.data;
          sender.sex = sexMapping[sender.sex];
          receiver.sex = sexMapping[receiver.sex];
          await createConfession(sender, receiver, text);
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