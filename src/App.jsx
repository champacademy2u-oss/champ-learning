import { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const getAssetUrl = (path) => {
  if (!path) return path;
  const cleanPath = path.replace(/^(\.\/|\/)/, "");
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const WHATSAPP_LINK = `https://wa.me/601167459987?text=${encodeURIComponent('您好，我有兴趣参加【打造企业赚钱机器 Preview 课程】，想了解更多详情。')}`
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbywkS3XXyHoJLNnfcNjPo707vGsK_oYYThl8bNlCTRVEY3X6DOKrZZbXPXUf4pQQMI/exec'
const FB_GROUP_LINK = 'https://www.facebook.com/groups/champacademy'

const COURSE = {
  date: '2026年8月28日（星期五）',
  time: '8:30 PM till Late',
  venue: '线上 Zoom'
}

const STATE_OPTIONS = [
  { value: 'johor', label: '柔佛 Johor' },
  { value: 'kedah', label: '吉打 Kedah' },
  { value: 'kelantan', label: '吉兰丹 Kelantan' },
  { value: 'kuala-lumpur', label: '吉隆坡 Kuala Lumpur' },
  { value: 'labuan', label: '纳闽 Labuan' },
  { value: 'melaka', label: '马六甲 Melaka' },
  { value: 'negeri-sembilan', label: '森美兰 Negeri Sembilan' },
  { value: 'pahang', label: '彭亨 Pahang' },
  { value: 'penang', label: '槟城 Penang' },
  { value: 'perak', label: '霹雳 Perak' },
  { value: 'perlis', label: '玻璃市 Perlis' },
  { value: 'sabah', label: '沙巴 Sabah' },
  { value: 'sarawak', label: '砂拉越 Sarawak' },
  { value: 'selangor', label: '雪兰莪 Selangor' },
  { value: 'terengganu', label: '登嘉楼 Terengganu' }
]

const FAQS = [
  { q: '谁适合参与这个 Preview 课程？', a: '适合想让企业有业绩也有盈利的老板、创业者、营销负责人，以及正面对获客成本高、价格战、成交率低、复购不足或利润被成本压缩的团队。' },
  { q: '请问主讲人是 Ryan Lim 军师吗？', a: '是的，这场 Preview 课程由 Ryan Lim 军师主讲，分享如何从定位、产品价值、营销获客、成交交付到成本利润，建立企业赚钱系统。' },
  { q: '请问在哪里上课？', a: `课程通过 ${COURSE.venue} 举行，任何地区的企业主都可以在线参与。` },
  { q: '请问可以看重播吗？', a: '是否提供重播，以课程团队发送的报名确认通知为准。建议预留时间参加 Zoom 直播。' },
  { q: '请问课程几点开始？', a: `课程日期为 ${COURSE.date}，时间为 ${COURSE.time}。` },
  { q: '请问课程收费多少？', a: '本页面用于登记 Preview 课程席位；如有费用或名额安排，请以课程团队的最新确认通知为准。' },
  { q: '请问报名后，下一步要做什么？', a: `填写正确的 Email 与电话号码后，课程团队会联系您确认席位与 Zoom 参与方式。请先记下 ${COURSE.date}、${COURSE.time}。` }
]

const WHAT_TO_DO = [
  ['精准定位目标客户', '吸引高价值客户'],
  ['打造有价值的产品／服务', '解决客户痛点'],
  ['建立高效营销系统', '持续获客，稳定流量'],
  ['优化成交与交付流程', '提升客户体验，创造口碑推荐'],
  ['精细化成本与财务管理', '控制成本，提高利润率']
]

const WHAT_TO_AVOID = [
  ['盲目追求所有客户', '定位不精准，获客成本高'],
  ['产品／服务没有差异化', '陷入价格战，利润被压缩'],
  ['只做流量，不做转化', '浪费时间和金钱'],
  ['服务不到位', '客户流失，没有复购'],
  ['不控制成本', '赚到的都变成了开销']
]

function useWindowSize() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

function ImageCarousel({ images, desktopSlides = 3, autoplayDelay = 2000, hasLogoStyle = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const windowWidth = useWindowSize()
  
  let slidesPerView = desktopSlides
  if (windowWidth < 640) slidesPerView = 1
  else if (windowWidth < 1024) slidesPerView = Math.min(2, desktopSlides)

  const maxIndex = Math.max(0, images.length - slidesPerView)

  useEffect(() => {
    if (maxIndex === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, autoplayDelay)
    return () => clearInterval(timer)
  }, [maxIndex, autoplayDelay, images.length])

  return (
    <div className="relative w-full px-4 md:px-8 select-none">
      <div className="overflow-hidden w-full">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}
        >
          {images.map((img, idx) => {
            const isCoverage = hasLogoStyle && img.includes('media-coverage')
            return (
              <div 
                key={idx} 
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / slidesPerView}%` }}
              >
                <div className={`p-2 rounded-xl shadow-xl border border-amber-500/30 ${isCoverage ? 'bg-white rounded-2xl' : 'bg-slate-900/80'}`}>
                  <img 
                    src={img} 
                    alt={`Slide ${idx + 1}`} 
                    className="w-full h-auto rounded-xl object-contain max-h-[320px] mx-auto" 
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {maxIndex > 0 && (
        <>
          <button 
            type="button"
            onClick={() => setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-amber-500/50 text-amber-400 flex items-center justify-center hover:bg-black transition-colors shadow-lg"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={() => setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-amber-500/50 text-amber-400 flex items-center justify-center hover:bg-black transition-colors shadow-lg"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', state: '' })
  const [status, setStatus] = useState('idle')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.state) return
    setStatus('submitting')
    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
          name: form.name,
          email: form.email,
          phone: form.phone,
          state: form.state
        }),
      })
      
      // Save to Firebase preview_leads collection
      await addDoc(collection(db, 'preview_leads'), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        state: form.state,
        createdAt: serverTimestamp(),
        source: 'Money Machine Preview Course Landing Page'
      })

      setStatus('success')
      setShowSuccess(true)
    } catch {
      setStatus('error')
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-500/20 border-2 border-green-500">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">🎉 报名成功！</h3>
        <p className="text-gray-300">感谢您的报名，我们的顾问将在24小时内与您联系确认席位。</p>
        <a 
          href={FB_GROUP_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white transition-all hover:opacity-90 shadow-xl"
          style={{ background: '#1877F2' }}
        >
          加入 Facebook 学员群组
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">姓名 Name <span className="text-amber-400">*</span></label>
        <input
          type="text" name="name" value={form.name} onChange={handleChange} required
          placeholder="请输入您的姓名"
          className="w-full px-4 py-3 rounded-lg text-black font-bold placeholder:text-gray-500 outline-none bg-white border-2 border-slate-300 focus:border-amber-500 transition-all h-12 force-black-text"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">电子邮箱 Email <span className="text-amber-400">*</span></label>
        <input
          type="email" name="email" value={form.email} onChange={handleChange} required
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-lg text-black font-bold placeholder:text-gray-500 outline-none bg-white border-2 border-slate-300 focus:border-amber-500 transition-all h-12 force-black-text"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">联系电话 Phone <span className="text-amber-400">*</span></label>
        <input
          type="tel" name="phone" value={form.phone} onChange={handleChange} required
          placeholder="+60 12-345 6789"
          className="w-full px-4 py-3 rounded-lg text-black font-bold placeholder:text-gray-500 outline-none bg-white border-2 border-slate-300 focus:border-amber-500 transition-all h-12 force-black-text"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-1">州属 State <span className="text-amber-400">*</span></label>
        <select
          name="state" value={form.state} onChange={handleChange} required
          className="w-full px-4 py-3 rounded-lg text-black font-bold outline-none bg-white border-2 border-slate-300 focus:border-amber-500 transition-all h-12 force-black-text"
        >
          <option value="">请选择您的州属</option>
          {STATE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">提交失败，请检查网络后重试</p>
      )}
      <button
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full py-4 rounded-xl font-extrabold text-lg text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-[3px] border-yellow-200 shadow-amber-500/20 shadow-lg mt-4 cursor-pointer force-gold-btn"
      >
        {status === 'submitting' ? '提交中...' : '👉 提交 Preview 课程报名'}
      </button>
      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs text-center pt-1">
        <span>🔒 256-bit SSL 官方加密</span>
        <span>•</span>
        <span>资料严格保密</span>
      </div>
    </form>
  )
}

export default function App() {
  const [openAccordion, setOpenAccordion] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-[#0d1527] text-white font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black">
      <style>{`
        .force-black-text { color: #000000 !important; }
        .force-gold-btn { 
          background: transparent !important; 
          color: #fbbf24 !important; 
          border: 3px solid #fbbf24 !important; 
        }
      `}</style>
      
      {/* Floating WhatsApp Widget */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group border-2 border-white/20"
        title="WhatsApp 官方客服咨询"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
        </svg>
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-lg">
          💬 在线客服咨询
        </span>
      </a>

      {/* Top Banner & Announcement */}
      <header className="bg-gradient-to-r from-[#182645] via-[#101b33] to-[#182645] border-b border-amber-500/30 py-3 text-center px-4 relative z-40">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm md:text-base">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            【ChampAcademy Preview 课程】打造企业赚钱机器
          </div>
          <div className="text-gray-300 text-xs md:text-sm">
            {COURSE.date} | {COURSE.time}（{COURSE.venue}）
          </div>
        </div>
      </header>

      {/* ── 1. HERO SECTION ── */}
      <section 
        className="relative py-12 md:py-20 bg-cover bg-center border-b border-slate-800"
        style={{ backgroundImage: `linear-gradient(rgba(13, 21, 39, 0.92), rgba(13, 21, 39, 0.95)), url(${getAssetUrl("assets/hero-background-CgUbRfkl.png")})` }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-block bg-amber-400/10 border border-amber-400/40 text-amber-400 px-5 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider">
            ★ 打造 Money Machine · 企业赚钱机器 Preview 课程 ★
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            不是有业绩没盈利，
            <span className="block">而是有业绩又有盈利！</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-2">
              打造企业赚钱机器
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            战略＝战（什么该做）＋略（什么不该做）。做对战略选择，让生意自动为你赚钱。
          </p>

          {/* Official course visual supplied by the course owner */}
          <div className="max-w-3xl mx-auto my-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-black">
            <img
              src={getAssetUrl("assets/money-machine-preview-poster.png")}
              alt="打造企业赚钱机器 Preview 课程海报"
              className="w-full h-auto"
            />
          </div>

          {/* Key Metrics Counter Strip (Professional Proof Banner) */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-center">
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">9000万+</div>
              <div className="text-xs text-gray-300 font-medium">广告费实战操盘</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">100家+</div>
              <div className="text-xs text-gray-300 font-medium">行业第一</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">100万+</div>
              <div className="text-xs text-gray-300 font-medium">FB 专业版主</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">15亿</div>
              <div className="text-xs text-gray-300 font-medium">10大案例总业绩高达</div>
            </div>
          </div>

          {/* Course details */}
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-amber-500/50 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="text-2xl md:text-4xl font-extrabold text-amber-400">
              长青稳定 · 成交一次，收益一世
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-left">
              <div className="rounded-xl border border-slate-700 bg-black/30 p-4">
                <div className="text-xs text-gray-400">日期</div>
                <div className="mt-1 font-bold text-white">{COURSE.date}</div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-black/30 p-4">
                <div className="text-xs text-gray-400">时间</div>
                <div className="mt-1 font-bold text-white">{COURSE.time}</div>
              </div>
              <div className="rounded-xl border border-slate-700 bg-black/30 p-4">
                <div className="text-xs text-gray-400">地点</div>
                <div className="mt-1 font-bold text-white">{COURSE.venue}</div>
              </div>
            </div>

            <button
              onClick={openModal}
              className="w-full md:w-4/5 py-4 px-6 rounded-full font-black text-xl text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-[3px] border-yellow-200 hover:scale-105 transition-all shadow-xl shadow-amber-500/25 animate-bounce-gentle cursor-pointer force-gold-btn"
            >
              👉 立即报名 Preview 课程
            </button>
            <p className="text-xs text-amber-300/80 font-medium">建立你的赚钱系统，让企业自动化运转，业绩与利润持续增长。</p>
          </div>

        </div>
      </section>

      {/* ── 2. COURSE PREVIEW VIDEO ── */}
      <section className="py-16 md:py-20 bg-slate-950 border-b border-slate-800 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-bold tracking-wider text-amber-400">
              MONEY MACHINE 课程预览
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              先看 Ryan Lim 军师怎么说
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              用几分钟了解为什么企业不能只追求业绩，更要建立一套能够持续创造利润的赚钱系统。
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-black shadow-2xl">
            <video
              className="block w-full max-h-[80vh] bg-black object-contain"
              controls
              playsInline
              preload="metadata"
              poster={getAssetUrl("assets/money-machine-preview-poster.png")}
              aria-label="打造企业赚钱机器 Preview 课程介绍视频"
            >
              <source src={getAssetUrl("assets/money-machine-preview-video.mp4")} type="video/mp4" />
              您的浏览器暂不支持播放此视频。
            </video>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT YOU WILL LEARN (在课程里，你将会学到) ── */}
      <section 
        className="py-16 md:py-24 border-b border-slate-800 relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(10, 17, 30, 0.95), rgba(10, 17, 30, 0.95)), url(${getAssetUrl("assets/leverage-pattern-tTCXtwN8.jpg")})` }}
      >
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              战略＝战（什么该做）＋略（什么不该做）
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Preview 课程带你先看清正确选择，再把定位、价值、获客、成交、交付与利润串成一套赚钱系统。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-slate-900/80 border-2 border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl">
              <h3 className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 text-2xl font-black text-black">
                什么该做（战）✓
              </h3>
              <ul className="space-y-3 p-6 text-gray-200">
                {WHAT_TO_DO.map(([title, detail]) => (
                  <li key={title} className="rounded-xl border border-slate-700 bg-black/30 p-4">
                    <div className="font-bold text-white">{title}</div>
                    <div className="mt-1 text-sm text-gray-400">{detail}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/80 border-2 border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
              <h3 className="bg-slate-950 px-6 py-4 text-2xl font-black text-amber-400 border-b border-amber-500/30">
                什么不该做（略）✕
              </h3>
              <ul className="space-y-3 p-6 text-gray-200">
                {WHAT_TO_AVOID.map(([title, detail]) => (
                  <li key={title} className="rounded-xl border border-slate-700 bg-black/30 p-4">
                    <div className="font-bold text-white">{title}</div>
                    <div className="mt-1 text-sm text-gray-400">{detail}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INSTRUCTOR & AWARDS (Datuk Dr. Gary Chua -> Ryan Lim 荣获了) ── */}
      <section 
        className="py-16 md:py-24 border-b border-slate-800 relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(13, 21, 39, 0.95), rgba(13, 21, 39, 0.95)), url(${getAssetUrl("assets/who-should-join-bg-Cu7hM2ML.jpg")})` }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              主讲导师：Ryan Lim 军师
            </h2>
            <p className="text-xl md:text-2xl text-white font-bold">
              上市公司 Marketing 操盘手 / Marketing Director
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                🎖️ 个人荣誉与商业大奖
              </h3>
              <ul className="space-y-2 text-gray-200 text-sm md:text-base">
                <li>• 2017 最具影响力企业家奖 (MIYE)</li>
                <li>• 2018 品牌卓越商业最佳品牌之最佳营销领导奖</li>
                <li>• 2018 商海名人坊荣誉获得者</li>
                <li>• 2018 世界杰出名人榜权威认证</li>
                <li>• 2019 HIGH FLYER AWARD 卓越飞跃奖</li>
                <li>• 2023 受封商业顾问与实战营销导师勋衔</li>
              </ul>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                🚀 实战经验与操盘纪录
              </h3>
              <ul className="space-y-2 text-gray-200 text-sm md:text-base">
                <li>• 9000万+ 广告费经验</li>
                <li>• 100家+ 行业第一</li>
                <li>• 100万+ FB 专业版主</li>
                <li>• 10大成功案例，总业绩高达15亿</li>
              </ul>
            </div>
          </div>

          {/* Award Carousel */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-gray-300">【 荣誉奖项展示 】</h3>
            <ImageCarousel 
              images={[
                getAssetUrl("assets/award-new-1-C3Y2cp_f.png"),
                getAssetUrl("assets/award-new-2-BpMC7iD1.png"),
                getAssetUrl("assets/award-new-3-BTWH93N1.png"),
                getAssetUrl("assets/award-new-4-BfK9GSpp.png"),
                getAssetUrl("assets/award-new-5-B5hF7GYR.png"),
                getAssetUrl("assets/award-new-6-pgimpSB3.png"),
                getAssetUrl("assets/award-new-7-8hRPMg1x.png")
              ]} 
              desktopSlides={3} 
            />
          </div>

          {/* Experience Carousel */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-gray-300">【 操盘战绩与实战案例 】</h3>
            <ImageCarousel 
              images={[
                getAssetUrl("assets/experience-1-new-aYy-fgNY.png"),
                getAssetUrl("assets/experience-2-new-DZ2jgsRw.png"),
                getAssetUrl("assets/experience-3-CAbq5sOX.png"),
                getAssetUrl("assets/experience-4-SUVlcIyy.png"),
                getAssetUrl("assets/experience-5-Pfje2xCr.png"),
                getAssetUrl("assets/experience-6-Cq7ajyVF.png"),
                getAssetUrl("assets/experience-7-IzWGSBgF.png")
              ]} 
              desktopSlides={3} 
            />
          </div>

        </div>
      </section>

      {/* ── 4. HRDC CERTIFICATION BLOCK ── */}
      <section className="py-12 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            全马首屈一指的实战营销及商业系统商学院
          </h2>
          <p className="text-slate-600 font-semibold">
            HRDF Trainer & HRDC Claimable 官方认证品质与服务
          </p>
          <div className="flex justify-center items-center pt-2">
            <img 
              src={getAssetUrl("assets/hrdc-logo-CsenaheX.png")} 
              alt="HRDC Certified" 
              className="max-w-md h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── 5. MID-PAGE CTA BANNER ── */}
      <section className="py-12 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-black text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-4xl font-black">
            建立你的赚钱系统，让企业自动化运转
          </h2>
          <p className="text-base md:text-lg font-bold">
            做好战略选择，让业绩与利润持续增长。
          </p>
          <button 
            onClick={openModal}
            className="px-8 py-3.5 rounded-full font-black text-lg text-white bg-slate-950 hover:bg-slate-900 transition-all shadow-xl hover:scale-105 cursor-pointer"
          >
            👉 登记 Preview 课程席位
          </button>
        </div>
      </section>

      {/* ── 6. WHO SHOULD JOIN & PAIN POINTS (什么人适合参加？) ── */}
      <section 
        className="py-16 md:py-24 border-b border-slate-800 relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(10, 17, 30, 0.95), rgba(10, 17, 30, 0.95)), url(${getAssetUrl("assets/capability-1-7u4pQpTX.png")})` }}
      >
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              什么人适合参加？
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              如果你的企业正在面对以下问题，这场 Preview 课程正是为你准备的。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "客户定位不够精准，获客成本越来越高",
              "产品或服务缺少差异化，长期陷入价格战",
              "有流量却没有转化，投入时间和预算看不到回报",
              "成交与交付流程不稳定，客户没有复购与推荐",
              "营收看似增长，利润却不断被成本与开销压缩"
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl flex items-start gap-4">
                <span className="text-amber-400 text-2xl font-black">✔</span>
                <span className="text-gray-200 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Money machine system path */}
          <div className="bg-slate-950 border-2 border-amber-500/40 p-8 rounded-2xl text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-400">
              企业赚钱机器的五个关键环节
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {['精准定位', '价值产品', '营销获客', '成交交付', '成本利润'].map((item, idx) => (
                <div key={item} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-amber-400 font-extrabold text-xl">{idx + 1}</div>
                  <div className="text-gray-300 font-semibold text-sm mt-1">{item}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. STUDENT TESTIMONIALS (真实案例) ── */}
      <section className="py-16 md:py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              过往案例与实战展示
            </h2>
            <p className="text-gray-300">
              了解 Ryan Lim 军师在不同行业的营销与商业系统实战资料。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { image: getAssetUrl("assets/testimonial-new-1-Ba4DU2nx.png"), alt: "学员见证 1" },
              { image: getAssetUrl("assets/testimonial-new-2-BEDuotJW.png"), alt: "学员见证 2" },
              { image: getAssetUrl("assets/testimonial-new-3-Bg84uJL_.png"), alt: "学员见证 3" },
              { image: getAssetUrl("assets/testimonial-new-4-B1rZbWfb.png"), alt: "学员见证 4" }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-xl">
                <img src={item.image} alt={item.alt} className="w-full h-auto rounded-xl object-contain" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 8. FAQ SECTION (常见问题 FAQ) ── */}
      <section className="py-16 md:py-24 bg-[#0a111e] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              常见问题 FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center text-white font-bold text-base md:text-lg hover:text-amber-400 transition-colors"
                >
                  <span>{idx + 1}. {item.q}</span>
                  <span className="text-amber-400 text-xl font-black">{openAccordion === idx ? '−' : '+'}</span>
                </button>
                {openAccordion === idx && (
                  <div className="p-5 pt-0 text-gray-300 text-sm md:text-base border-t border-slate-800/80 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 9. COACH MESSAGE (Ryan Lim 老师的话) ── */}
      <section 
        className="py-16 md:py-24 border-b border-slate-800 relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(13, 21, 39, 0.95), rgba(13, 21, 39, 0.95)), url(${getAssetUrl("assets/media-coverage-Ce1TFezg.png")})` }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900/90 border-2 border-amber-500/40 p-8 rounded-3xl space-y-6">
            <h2 className="text-3xl font-extrabold text-amber-400 text-center">
              Ryan Lim 军师的话：
            </h2>
            <div className="space-y-4 text-gray-200 text-base md:text-lg leading-relaxed">
              <p>
                很多企业并不是没有业绩，而是有业绩却没有留下利润。问题往往不只是广告或销售技巧，而是缺少一套清楚的战略与可持续运转的系统。
              </p>
              <p>
                战略，就是清楚知道什么该做，也知道什么不该做。从精准客户、价值产品、稳定获客、成交交付，到成本与利润，每一个环节都要互相配合。
              </p>
              <p>
                这场 Preview 课程将带你看见企业赚钱机器的完整框架，帮助你开始建立长青稳定、能够自动化运转的赚钱系统。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. MEDIA COVERAGE (知名国际媒体报道) ── */}
      <section className="py-16 bg-slate-950 border-b border-slate-800 text-center px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            知名国际媒体报道
          </h2>
          <ImageCarousel 
            images={[
              getAssetUrl("assets/media-1-CS7KlS13.jpg"),
              getAssetUrl("assets/media-2-s1IZhFdT.jpg"),
              getAssetUrl("assets/media-3-C_kEueQm.jpg"),
              getAssetUrl("assets/media-coverage-Ce1TFezg.png")
            ]} 
            desktopSlides={3} 
            hasLogoStyle={true}
          />
        </div>
      </section>

      {/* ── 11. INLINE REGISTRATION SECTION ── */}
      <section id="register-section" className="py-16 md:py-24 bg-[#0d1527] px-4">
        <div className="max-w-3xl mx-auto bg-slate-900 border-2 border-amber-500/40 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-amber-400">
              填写表格 · 登记 Preview 课程席位
            </h2>
            <p className="text-gray-300 text-sm">
              {COURSE.date} · {COURSE.time} · {COURSE.venue}；课程团队会联系您确认参与方式。
            </p>
          </div>
          <RegisterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-center text-gray-400 text-xs md:text-sm border-t border-slate-800 space-y-2">
        <p className="font-bold text-white">ChampAcademy - 打造企业赚钱机器 Preview 课程</p>
        <p>Copyright © {new Date().getFullYear()} ChampAcademy. All rights reserved.</p>
        <p>
          欲知更多详情，请联系：
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-bold ml-1">
            WhatsApp 官方客服
          </a>
        </p>
      </footer>

      {/* Floating Bottom Bar (Sticky Mobile Bar) */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-amber-500/40 p-3 z-50 backdrop-blur-md flex items-center justify-between px-4 max-w-5xl mx-auto">
        <div className="hidden sm:flex flex-col">
          <span className="text-amber-400 font-extrabold text-sm">【打造企业赚钱机器】Preview 课程</span>
          <span className="text-gray-300 text-xs">{COURSE.date} · {COURSE.venue}</span>
        </div>
        <button
          onClick={openModal}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full font-black text-sm md:text-base text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-2 border-yellow-200 hover:scale-105 transition-all shadow-lg shadow-amber-500/20 cursor-pointer force-gold-btn"
        >
          👉 立即报名 Preview 课程
        </button>
      </div>

      {/* Registration Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 p-6 md:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-slate-800"
            >
              ✕
            </button>
            
            <div className="text-center space-y-2 mb-6">
              <span className="bg-amber-400/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                Preview 课程报名
              </span>
              <h3 className="text-2xl font-extrabold text-amber-400">
                登记《打造企业赚钱机器》课程席位
              </h3>
              <p className="text-gray-300 text-xs">
                请正确填写以下信息，课程团队会联系您确认席位与 Zoom 参与方式
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>
      )}

    </div>
  )
}
