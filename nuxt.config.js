import colors from "vuetify/es5/util/colors"
import webpack from "webpack"

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  env: {
    API_URL: process.env.API_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    TUS_URL: process.env.TUS_URL
  },

  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#004BEF" },
  /*
   ** Global CSS
   */
  css: [
    "@/assets/login.scss",
    "@/assets/users/accounts.scss",
    "@/assets/cameras/_id/local_recordings.scss",
    "@/assets/cameras/_id/details.scss",
    "@/assets/cameras/_id/sharings.scss",
    "@/assets/cameras/_id/compares.scss",
    "@/assets/cameras/_id/archives.scss"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/vuetify",
    { src: "~plugins/vimeo-player", ssr: false },
    "~/plugins/axios",
    { src: "~plugins/vue-konva", ssr: false },
    "@/plugins/google-maps",
    "@/plugins/vee-validate"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/dotenv",
    "@nuxtjs/axios"
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "jquery-ui": "jquery-ui",
        "window.jQuery": "jquery",
        _: "lodash"
      })
    ],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          // loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  },
  generate: {
    fallback: true
  }
}
