import test from "ava"
import { Nuxt, Builder } from "nuxt"
import { resolve } from "path"

// Init Nuxt.js and start listening on localhost:4000
test.before("Init Nuxt.js", async t => {
  const rootDir = resolve(__dirname, "..")
  let config = {}
  try {
    config = require(resolve(rootDir, "nuxt.config.js"))
  } catch (e) {
    config = {}
  }
  config.rootDir = rootDir // project folder
  config.dev = false // production build
  config.mode = "spa" // Isomorphic application
  const nuxt = new Nuxt(config)
  t.context.nuxt = nuxt // We keep a reference to Nuxt so we can close the server at the end of the test
  await new Builder(nuxt).build()
  nuxt.listen(4000, "localhost")
})

// Example of testing only generated html
test("Route / exits and render HTML", async t => {
  const { nuxt } = t.context
  let context = {}
  const { html } = await nuxt.renderRoute("/login", context)
  t.true(html.includes("<body data-n-head=''>"))
})

// Example of testing via DOM checking
test("Route / exists and renders HTML with CSS applied", async t => {
  const { nuxt } = t.context
  const window = await nuxt.renderAndGetWindow("http://localhost:4000/login")
  const element = window.document.querySelector(".red")
  console.log(window.$nuxt.$options.components.NuxtLoading.get())
  t.not(element, null)
  t.is(element.textContent, "Hello")
  t.is(element.className, "red")
  //t.is(window.getComputedStyle(element).color, "red")
})

// Close the Nuxt server
test.after("Closing server", t => {
  const { nuxt } = t.context
  nuxt.close()
})
