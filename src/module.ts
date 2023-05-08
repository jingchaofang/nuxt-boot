import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";
import { NuxtPage } from "@nuxt/schema";
import { name, version } from '../package.json'

// Module options TypeScript interface definition
export interface ModuleOptions {}

const Extension = [".mobile", ".pc"];

const correctPage = (page: NuxtPage) => {
  Extension.forEach((item) => {
    page.name = page.name && page.name.replace(item, "");
    if(page.name == 'index') {
      page.path = "/"
    } else {
      page.path = page.path && page.path.replace(item, "");
    }
  });
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "boot",
  },
  defaults: {},
  hooks: {
    "pages:extend": (pages) => {
      pages.forEach((page) => {
        correctPage(page);
      });
      console.log(pages);
    },
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url);

    const postcssOptions = nuxt.options.postcss;

    postcssOptions.plugins = postcssOptions.plugins || {};

    postcssOptions.plugins["postcss-px-to-viewport-8-plugin"] = {
      unitToConvert: "px",
      viewportWidth: (file: string) => {
        let num;
        if (file.indexOf(".mobile") !== -1) {
          num = 720;
        }
        return num;
      },
      unitPrecision: 5,
      propList: ["*"],
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: [],
      landscape: false,
      landscapeUnit: "vw",
      landscapeWidth: 568,
    };

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
