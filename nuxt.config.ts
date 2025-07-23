// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    appId: "venus",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxt/eslint", "@compodium/nuxt", "nuxt-auth-utils", "@vueuse/nuxt"],
    css: ["~/assets/css/main.css"],
    compatibilityDate: "2025-07-16",
    nitro: {
        experimental: {
            websocket: true,
        },
    },
    ssr: false,
    routeRules: {
        "/": { prerender: true },
    },
    alias: {
        "#types": "/types",
    },
    features: {
        devLogs: true,
    },
    runtimeConfig: {
        session: {
            password: process.env.NUXT_SESSION_PASSWORD || "",
            maxAge: 60 * 60 * 24 * 7,
            cookie: {
                sameSite: "lax",
                httpOnly: true,
                path: "/",
            },
        },
    },
});