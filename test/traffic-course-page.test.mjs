import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const appPath = new URL('../src/App.jsx', import.meta.url)
const htmlPath = new URL('../index.html', import.meta.url)
const cssPath = new URL('../src/index.css', import.meta.url)
const posterPath = new URL('../public/assets/traffic-failure-3-points.jpg', import.meta.url)

const EXPECTED = [
  '引流失败的3大重点',
  '为什么你天天发图没流量',
  '2026年10月22日（星期四）',
  '8:30 PM till Late',
  '线上 Zoom',
  'Ryan Lim',
  '找出问题根源',
  '掌握正确方法',
  '打造可持续的系统',
]

test('landing page presents the verified traffic course details', async () => {
  const app = await readFile(appPath, 'utf8')
  for (const text of EXPECTED) assert.match(app, new RegExp(text))

  assert.match(app, /traffic-failure-3-points\.jpg/)
  assert.match(app, /wa\.me\/601167459987/)
  assert.match(app, /马上报名/)
  assert.match(app, /先了解课程内容/)
})

test('page removes unrelated Enterprise Sunzi and old event details', async () => {
  const app = await readFile(appPath, 'utf8')
  const html = await readFile(htmlPath, 'utf8')
  const combined = `${app}\n${html}`

  assert.doesNotMatch(combined, /企业孙子兵法/)
  assert.doesNotMatch(combined, /RM388|RM688/)
  assert.doesNotMatch(combined, /2026年10月16日|2026年10月17日|2026年10月18日/)
  assert.doesNotMatch(combined, /2026 流量密码 2\.0/)
})

test('metadata uses the new course and supplied poster', async () => {
  const html = await readFile(htmlPath, 'utf8')
  assert.match(html, /<title>引流失败的3大重点 \| ChampAcademy<\/title>/)
  assert.match(html, /og:image[^>]+traffic-failure-3-points\.jpg/)
  assert.match(html, /og:image:width[^>]+1113/)
  assert.match(html, /og:image:height[^>]+1280/)
  assert.match(html, /2026年10月22日/)
})

test('page keeps multi-colour conversion sections and animations', async () => {
  const app = await readFile(appPath, 'utf8')
  const css = await readFile(cssPath, 'utf8')

  for (const message of [
    '你是否也遇到这些引流困局',
    '不是发得更多，而是方法要正确',
    '这场课适合谁',
    '报名之前，您可能想知道',
  ]) assert.match(app, new RegExp(message))

  assert.match(app, /bg-\[#071a2f\]/)
  assert.match(app, /bg-\[#3a0d1d\]/)
  assert.match(app, /bg-\[#f3ead7\]/)
  assert.match(css, /@keyframes poster-float/)
  assert.match(css, /@keyframes reveal-up/)
  assert.match(css, /@keyframes cta-shine/)
})

test('supplied poster is present and non-empty', async () => {
  const poster = await readFile(posterPath)
  assert.ok(poster.length > 100_000)
})
