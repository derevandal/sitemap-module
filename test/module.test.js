const { readFileSync } = require('fs')
const { Nuxt, Builder, Generator } = require('nuxt')
const path = require('path')
const request = require('request-promise-native')
const { gunzipSync } = require('zlib')

const config = require('./fixture/nuxt.config')

const url = path => `http://localhost:3000${path}`
const get = path => request(url(path))
const getGzip = path => request({ url: url(path), encoding: null })

describe('ssr', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await new Builder(nuxt).build()
    await nuxt.listen(3000)
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    let html = await get('/')
    expect(html).toContain('/index')
    html = await get('/sub/')
    expect(html).toContain('/sub/index')
    html = await get('/sub/sub')
    expect(html).toContain('/sub/sub')
    html = await get('/child/')
    expect(html).toContain('/child/index')
    html = await get('/child/1')
    expect(html).toContain('/child/1')
    html = await get('/1/')
    expect(html).toContain('/1/index')
    html = await get('/exclude')
    expect(html).toContain('/exclude')
  })

  test('sitemap', async () => {
    const xml = await get('/sitemap.xml')
    expect(xml).toContain('<loc>http://localhost:3000/</loc>')
    expect(xml).toContain('<loc>http://localhost:3000/sub</loc>')
    expect(xml).toContain('<loc>http://localhost:3000/sub/sub</loc>')
    expect(xml).toContain('<loc>http://localhost:3000/child</loc>')
    expect(xml).toContain('<loc>http://localhost:3000/child/1</loc>')
    expect(xml).toContain('<loc>http://localhost:3000/1/</loc>')
    expect(xml).not.toContain('<loc>http://localhost:3000/exclude</loc>')
    expect(xml).not.toContain('<loc>http://localhost:3000/filtered</loc>')
  })

  test('sitemap gzip', async () => {
    const xml = await get('/sitemap.xml')
    const gz = await getGzip('/sitemap.xml.gz')
    const sitemap = gunzipSync(gz).toString()
    expect(xml).toEqual(sitemap)
  })
})

describe('generate', () => {
  let nuxt

  beforeAll(async () => {
    nuxt = new Nuxt(config)
    const builder = new Builder(nuxt)
    const generator = new Generator(nuxt, builder)
    await generator.generate()
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('sitemap', async () => {
    const xml = readFileSync(path.resolve(__dirname, '../dist/sitemap.xml'), 'utf8')
    expect(xml).toContain('<loc>http://localhost:3000/</loc>')
  })
})
