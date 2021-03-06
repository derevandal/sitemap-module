# Sitemap Module
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/sitemap/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/sitemap)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/sitemap.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/sitemap)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/sitemap-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/sitemap-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/sitemap-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/sitemap-module)
[![Dependencies](https://david-dm.org/nuxt-community/sitemap-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/sitemap-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Automatically generate or serve dynamic [sitemap.xml](https://www.sitemaps.org/protocol.html) for Nuxt.js projects!

[📖 **Release Notes**](./CHANGELOG.md)

Module based on the awesome [sitemap](https://github.com/ekalinin/sitemap.js) package ❤️

## Setup
- Add `@nuxtjs/sitemap` dependency using yarn or npm to your project
- Add `@nuxtjs/sitemap` module to `nuxt.config.js`
```js
  modules: [
   '@nuxtjs/sitemap'
  ]
````
- Add additional options to `sitemap` section of `nuxt.config.js` to override defaults
```js
  sitemap: {
    path: '/sitemap.xml',
    hostname: 'https://example.com',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: [
      '/secret',
      '/admin/**'
    ],
    routes: [
      '/page/1',
      {
        url: '/page/2',
        changefreq: 'daily',
        priority: 1,
        lastmodISO: '2017-06-30T13:30:00.000Z'
      }
    ]
  }
```

## Options

### `exclude`
The `exclude` parameter is an array of [glob patterns](https://github.com/isaacs/minimatch#features) to exclude static routes from the generated sitemap.

### `routes`
The `routes` parameter follows the same way than the `generate` [configuration](https://nuxtjs.org/api/configuration-generate).
   
See as well the [routes](#routes-1) examples below.

### `path`
- Default: `/sitemap.xml`

Where serve/generate sitemap file

### `hostname`
- Default: 
  - `hostname()` for generate mode
  - Dynamically based on request url for middleware mode

This values is **mandatory** for generation sitemap file, and you should explicitly provide it for generate mode.

### `generate`
- Default: `false`

Generates static sitemap file during build/generate instead of serving using middleware.

### `cacheTime`
- Default: `1000 * 60 * 15` (15 Minutes)

Defines how frequently should sitemap **routes** being updated.
This option is only effective when `generate` is `false`.
Please note that after each invalidation, `routes` will be evaluated again. (See [routes](#routes-1) section)

### `filter`
- Default: `undefined`

If `filter` option is set as a function,  all routes will be filtered through it.

Example:

`nuxt.config.js`
```js
module.exports = {
  sitemap: {
    filter ({ routes, options }){
      if (options.hostname === 'example.com') {
        return routes.filter(route => route.locale === 'en')
      }
      return routes.filter(route => route.locale === 'fr')
    }
  }
}
```

Example² (add trailing slash in each route):
```js
module.exports = {
  sitemap: {
    filter ({ routes }) {
      return routes.map(route => route.url = `${route.url}/`)
    }
  }
}
```

### `gzip`
- Default: `false`

Enable the creation of the `.xml.gz` sitemap compressed with gzip.

## Routes

Dynamic routes are ignored by the sitemap module.

Example:

```
-| pages/
---| index.vue
---| users/
-----| _id.vue
```

If you want the module to add routes with dynamic params, you need to set an array of dynamic routes.

We add routes for `/users/:id` in `nuxt.config.js`:

```js
  sitemap: {
    routes: [
      '/users/1',
      '/users/2',
      '/users/3'
    ]
  }
```

### Function which returns a Promise

`nuxt.config.js`
```js
const axios = require('axios')

module.exports = {
  sitemap: {
    routes () {
      return axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => res.data.map(user =>  '/users/' + user.username))
    }
  }
}
```

### Function with a callback

`nuxt.config.js`
```js
const axios = require('axios')

module.exports = {
  sitemap: {
    routes (callback) {
      axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        let routes = res.data.map(user => '/users/' + user.username)
        callback(null, routes)
      })
      .catch(callback)
    }
  }
}
```

## License

[MIT License](./LICENSE)

### Contributors
- [Nicolas PENNEC](https://github.com/NicoPennec)
- [Pooya Parsa](https://github.com/pi0)
