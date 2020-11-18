import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple,
        secondary: colors.orange,
        accent: colors.deepOrange,
        error: colors.deepOrange,
      },
    },
  },
});
