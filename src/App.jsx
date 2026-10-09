const getAssetUrl = (path) => {
  const cleanPath = path.replace(/^(\.\/|\/)/, '')
  return `${import.meta.env.BASE_URL}${cleanPath}`
}

const WHATSAPP_LINK = `https://wa.me/601167459987?text=${encodeURIComponent('您好，我要报名《引流失败的3大重点》Zoom线上课程。')}`
const ENQUIRY_LINK = `https://wa.me/601167459987?text=${encodeURIComponent('您好，我想先了解《引流失败的3大重点》课程内容。')}`

const PAIN_POINTS = [
  ['内容发了很多', '每天持续更新，浏览、互动和询问仍然没有明显起色。'],
  ['不知道问题在哪', '是内容、受众、平台还是方法？没有诊断就只能不断试错。'],
  ['流量无法成交', '有曝光却没有形成询问，营销投入难以连接实际结果。'],
  ['执行难以持续', '偶尔出现效果，却没有一套团队可以长期重复的系统。'],
]

const LEARNING_POINTS = [
  {
    number: '01',
    title: '找出问题根源',
    subtitle: '为什么内容没人看？',
    detail: '从内容方向、目标受众与传播方式着手，辨认真正影响流量的环节，停止没有方向地重复发布。',
  },
  {
    number: '02',
    title: '掌握正确方法',
    subtitle: '让内容带来精准流量',
    detail: '让内容主题、讯息与行动指引更清楚，使对的人更容易看见、理解并进一步询问。',
  },
  {
    number: '03',
    title: '打造可持续的系统',
    subtitle: '从流量到成交',
    detail: '把内容、流量、询问与销售连接成一条可持续优化的路径，而不是只追求单次爆量。',
  },
]

const FAQS = [
  ['这堂课适合完全没有营销经验的人吗？', '课程从“为什么内容没人看”开始拆解，适合需要重新梳理引流方法的企业主、创业者和营销团队。'],
  ['课程由谁主讲？', '课程由 Ryan Lim 军师主讲。海报资料显示其为数间上市公司的 Marketing 操盘手／Marketing Director。'],
  ['课程什么时候进行？', '2026年10月22日（星期四），晚上8:30开始，线上 Zoom 进行。'],
  ['如何报名？', '点击“马上报名”后，通过 Champ Academy 官方 WhatsApp 提交报名意向，团队会协助确认后续安排。'],
]

function ActionButton({ secondary = false, className = '', children }) {
  return (
    <a
      href={secondary ? ENQUIRY_LINK : WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`${secondary ? 'border-2 border-emerald-400/60 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20' : 'cta-shine bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-black shadow-2xl shadow-amber-500/25 hover:-translate-y-1'} inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-black transition ${className}`}
    >
      {children}
    </a>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05070d] text-stone-100 selection:bg-amber-400 selection:text-black">
      <header className="border-b border-amber-400/25 bg-black/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <div className="font-black tracking-[0.22em] text-amber-400">CHAMP ACADEMY</div>
          <div className="text-xs font-semibold text-stone-300 sm:text-sm">22/10/2026 · 8:30 PM till Late · 线上 Zoom</div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-amber-500/20 bg-[#071a2f]">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,#1d4f73_0%,#071a2f_42%,#05070d_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(245,158,11,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="glow-orb absolute -left-28 top-16 -z-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="glow-orb animation-delay-2 absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="mx-auto grid min-w-0 max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[0.92fr_1.08fr] md:py-20">
            <div className="reveal-up order-2 space-y-6 text-center md:order-1 md:text-left">
              <div className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-black tracking-[0.2em] text-amber-300">流量不是运气，而是方法</div>
              <div className="space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-300">Ryan Lim 军师主讲</p>
                <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">引流失败的<span className="text-amber-400">3</span>大重点</h1>
                <p className="text-xl font-black text-amber-400 sm:text-3xl">为什么你天天发图没流量？</p>
              </div>
              <p className="mx-auto max-w-2xl text-base leading-8 text-slate-300 md:mx-0 md:text-lg">找出内容没人看的问题根源，掌握正确方法，并建立从内容、流量到成交的可持续系统。</p>

              <div className="grid gap-3 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-sky-300/20 bg-black/30 p-4 backdrop-blur">
                  <div className="text-xs font-bold text-slate-500">日期</div>
                  <div className="mt-1 font-black text-white">2026年10月22日（星期四）</div>
                </div>
                <div className="rounded-2xl border border-sky-300/20 bg-black/30 p-4 backdrop-blur">
                  <div className="text-xs font-bold text-slate-500">时间与形式</div>
                  <div className="mt-1 font-black text-white">8:30 PM till Late · 线上 Zoom</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
                <ActionButton className="w-full sm:w-auto">马上报名</ActionButton>
                <ActionButton secondary className="w-full sm:w-auto">先了解课程内容</ActionButton>
              </div>
              <p className="text-xs text-slate-500">报名后由 Champ Academy 团队联系确认上课安排。</p>
            </div>

            <div className="hero-poster order-1 mx-auto w-full min-w-0 max-w-[560px] md:order-2">
              <div className="w-full max-w-full overflow-hidden rounded-[2rem] border border-amber-400/35 bg-black/50 p-3 shadow-2xl shadow-sky-950/60">
                <img src={getAssetUrl('assets/traffic-failure-3-points.jpg')} alt="引流失败的3大重点课程海报" className="h-auto w-full rounded-[1.4rem]" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-red-900/10 bg-[#f3ead7] px-4 py-16 text-slate-900 md:py-24">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl" />
          <div className="relative mx-auto max-w-6xl">
            <div className="reveal-up mx-auto max-w-3xl text-center">
              <p className="text-sm font-black tracking-[0.22em] text-red-800">内容一直发，结果却没有来</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">你是否也遇到这些引流困局？</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">没有先找出问题，投入更多时间和内容，只会让团队更忙，却不一定更接近客户。</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PAIN_POINTS.map(([title, detail], index) => (
                <article key={title} className={`reveal-up stagger-${index + 1} rounded-3xl border border-red-900/10 bg-white/80 p-6 shadow-lg shadow-red-950/5`}>
                  <div className="text-xs font-black tracking-widest text-red-800">0{index + 1}</div>
                  <h3 className="mt-3 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-cyan-500/15 bg-gradient-to-br from-[#082f49] via-[#0b3b4f] to-[#102a43] px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black tracking-[0.22em] text-cyan-300">从盲目发布，到有方向的引流</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">不是发得更多，而是方法要正确</h2>
              <p className="mt-5 text-lg leading-8 text-cyan-50/75">课程围绕三个关键环节，帮助您先诊断，再改善，最后形成可以持续优化的路径。</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {LEARNING_POINTS.map((item, index) => (
                <article key={item.title} className={`reveal-up stagger-${index + 1} rounded-3xl border border-cyan-300/20 bg-white/10 p-7 shadow-xl backdrop-blur`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 text-lg font-black text-amber-400">{item.number}</div>
                  <h3 className="mt-6 text-2xl font-black text-white">{item.title}</h3>
                  <p className="mt-2 font-bold text-amber-300">{item.subtitle}</p>
                  <p className="mt-4 leading-7 text-cyan-50/70">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-blue-300/15 bg-[#071a2f] px-4 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="reveal-up rounded-[2rem] border border-amber-400/25 bg-gradient-to-br from-amber-400/15 to-sky-400/10 p-8">
              <p className="text-sm font-black tracking-[0.22em] text-amber-400">主讲人简介</p>
              <h2 className="mt-3 text-4xl font-black text-white">Ryan Lim 军师</h2>
              <p className="mt-3 text-lg font-bold text-sky-200">数间上市公司 Marketing 操盘手／Marketing Director</p>
              <p className="mt-6 leading-8 text-slate-300">以营销实战经验，带您从内容为什么没人看开始，重新理解流量、销售与结果之间的连接。</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['9000万+', '广告费经验'],
                ['100家+', '行业第一'],
                ['100万+', 'FB专业版主'],
              ].map(([number, label], index) => (
                <div key={label} className={`reveal-up stagger-${index + 1} rounded-3xl border border-sky-300/20 bg-gradient-to-b from-sky-950 to-indigo-950 p-7 text-center shadow-xl`}>
                  <div className="text-3xl font-black text-amber-400">{number}</div>
                  <div className="mt-2 font-bold text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-rose-300/15 bg-[#3a0d1d] bg-[radial-gradient(circle_at_center,#7f1d1d_0%,#3a0d1d_52%,#17060d_100%)] px-4 py-16 md:py-24">
          <div className="reveal-up mx-auto max-w-4xl rounded-[2rem] border-2 border-amber-400/45 bg-black/40 p-7 text-center shadow-2xl shadow-red-950/60 backdrop-blur md:p-12">
            <p className="text-sm font-black tracking-[0.24em] text-amber-400">线上 Zoom 专题课</p>
            <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">把“没流量”变成可以诊断的问题</h2>
            <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
              {[
                ['日期', '22/10/2026'],
                ['时间', '8:30 PM till Late'],
                ['地点', '线上 Zoom'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-rose-200/15 bg-black/30 p-4">
                  <div className="text-xs font-bold text-rose-200/60">{label}</div>
                  <div className="mt-1 font-black text-white">{value}</div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-7 max-w-2xl leading-7 text-rose-50/75">课程将在10月22日进行。建议尽早提交报名意向，让团队为您确认参与安排。</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ActionButton className="w-full sm:w-auto">马上报名</ActionButton>
              <ActionButton secondary className="w-full sm:w-auto">先了解课程内容</ActionButton>
            </div>
          </div>
        </section>

        <section className="border-b border-emerald-900/15 bg-[#f3ead7] px-4 py-16 text-slate-900 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-black tracking-[0.22em] text-emerald-800">这场课适合谁</p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">适合需要把内容连接到业务结果的人</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ['企业主／创业者', '希望了解为什么持续发内容仍然没有稳定流量和询问。'],
                ['Marketing 团队', '需要建立更清楚的内容方向、引流方法和转化路径。'],
                ['销售／内容负责人', '希望让内容不只被看见，也更有效地连接后续询问与成交。'],
              ].map(([title, detail], index) => (
                <article key={title} className={`reveal-up stagger-${index + 1} rounded-3xl border border-emerald-900/10 bg-white/75 p-7 shadow-lg`}>
                  <div className="text-3xl">{['◎', '◈', '↗'][index]}</div>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0f172a] via-[#132f37] to-[#06352d] px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-black tracking-[0.22em] text-amber-400">FAQ</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">报名之前，您可能想知道</h2>
            </div>
            <div className="mt-10 space-y-4">
              {FAQS.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-amber-500/20 bg-black/45 p-5 open:border-amber-400/45">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-black text-white marker:hidden">{question}</summary>
                  <p className="mt-4 border-t border-amber-500/15 pt-4 leading-7 text-stone-300">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-500/20 bg-black px-4 py-10 text-center text-sm text-stone-500">
        <p className="font-black text-stone-200">Champ Academy · 引流失败的3大重点</p>
        <p className="mt-2">Copyright © {new Date().getFullYear()} Champ Academy. All rights reserved.</p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-400/35 bg-black/90 p-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <div className="font-black text-white">《引流失败的3大重点》线上课程</div>
            <div className="text-xs text-stone-400">22/10/2026 · 8:30 PM · Zoom</div>
          </div>
          <ActionButton className="w-full py-3 text-base sm:ml-auto sm:w-auto">马上报名</ActionButton>
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}
