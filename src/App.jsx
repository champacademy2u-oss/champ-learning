import { useState, useEffect, useRef } from 'react'

const WHATSAPP_LINK = 'https://wa.me/60123456789?text=%E6%82%A8%E5%A5%BD%EF%BC%8C%E6%88%91%E6%9C%89%E5%85%B4%E8%B6%A3%E5%8F%82%E5%8A%A0%E3%80%90%E6%97%A0%E9%99%90%E6%9D%A0%E6%9D%86%EF%BD%9CFacebook%20%E8%90%A5%E9%94%80%E8%AE%AD%E7%BB%83%E8%90%A5%E3%80%91%EF%BC%8C%E6%83%B3%E4%BA%86%E8%A7%A3%E6%9B%B4%E5%A4%9A%E8%AF%A6%E6%83%85%E3%80%82'
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbywkS3XXyHoJLNnfcNjPo707vGsK_oYYThl8bNlCTRVEY3X6DOKrZZbXPXUf4pQQMI/exec'
const FB_GROUP_LINK = 'https://www.facebook.com/groups/champacademy'
const VIDEO_SRC = 'https://video.wixstatic.com/video/0d678a_1883575fdebb45b0b15b4ca5df37e4b1/1080p/mp4/file.mp4'

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

const LESSONS = [
  { num: '课堂 01', tag: '打造赚钱机器 策略 1', title: '拆解【打造赚钱机器核心思维】：如何用同样的资源，放大 10 倍以上的结果', tag2: '学习为什么"模式 > 努力"，以及企业如何从"体力生意"进化到"杠杆生意"', locked: false },
  { num: '课堂 02', tag: '企业设计 策略 1', title: '教你如何根据公司阶段（100K / 300K / 1M / 5M+）设计适合的商业模式', tag2: '帮你找出企业卡关的原因，并制定一份初步的"增长蓝图"', locked: false },
  { num: '课堂 03', tag: 'Ad 广告/讨论调整1', title: '广告实战第一步：如何设定精准受众与预算', tag2: '学员广告案例分享 + 教练逐个点评与调整', locked: false },
  { num: '课堂 04', tag: 'Ad 广告收网 / 讨论调整 2', title: '如何通过"收网"把广告点击转化为实际成交', tag2: '教练逐个优化学员广告表现，避免无效消耗', locked: false },
  { num: '课堂 05', tag: '流量引擎策略', title: '大系统加速 - 锁定精确增长节点与闭环流量链设计', tag2: '已锁定内容 · 报名后解锁', locked: true },
  { num: '课堂 06', tag: '品牌心智占领', title: '如何让内容成为24小时自动运行的内容获客资产', tag2: '已锁定内容 · 报名后解锁', locked: true },
  { num: '课堂 07', tag: '高阶投放实战', title: '多维度混合媒介矩阵（混合图文、多组短视频、高频直营）玩法', tag2: '已锁定内容 · 报名后解锁', locked: true },
  { num: '课堂 08', tag: '团队杠杆落地', title: '构建能独立运行的获客与跟进团队系统，解放创始人时间', tag2: '已锁定内容 · 报名后解锁', locked: true },
  { num: '课堂 09', tag: '私域价值挖掘', title: '私域运营模组：如何利用低获客成本做后链路留存与裂变', tag2: '已锁定内容 · 报名后解锁', locked: true },
  { num: '课堂 10', tag: '战略落地方案', title: '打造赚钱机器 5.0 项目落地方案梳理与一对一答辩纠偏', tag2: '已锁定内容 · 报名后解锁', locked: true }
]

const FAQS = [
  { q: '谁适合参与这个课程？', a: '如果你广告费越来越高、顾客越来越难成交，或者公司发展卡在某个阶段，这场【企业打造赚钱机器】训练营就是为你准备的。' },
  { q: '请问主讲人是 Ryan 教练吗？', a: '是的，整个 3 个月的 11 堂课都会由 Ryan 教练亲自带领，结合 9000 万广告操盘经验与 150 个行业第一案例，带你实战掌握【打造赚钱机器】。' },
  { q: '请问在哪里上课？', a: '这是一个线上课程，将通过 Zoom 举行，任何地区的企业主都可以在线参与学习。' },
  { q: '请问可以看重播吗？', a: '不会提供录影！因为课程内容涉及大量真实案例与最新策略，我们坚持保密，小班制，只对现场学员开放。' },
  { q: '请问课程几点开始？', a: '课程时间为 8:30 till Late。下一期开课时间：2026年8月20日。' },
  { q: '请问课程收费多少？', a: '课程原价 RM388。但这次特别开放优惠，Ryan教练送30位免费票🎫！马上报名获取位子（第31位开始收费）。只限100位学员，位子有限！' },
  { q: '请问报名后，下一步要做什么？', a: '只要填写正确的 Email 与电话号码，你会收到确认通知。这代表你已正式锁定名额，进入【企业打造赚钱机器】。记得把课程时间记好，务必全程出席！' }
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full px-8 select-none">
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
                <div className={`p-2 rounded-xl shadow-lg border border-[hsl(220_13%_26%)] ${isCoverage ? 'bg-white rounded-2xl' : ''}`}>
                  <img 
                    src={img} 
                    alt={`Slide ${idx + 1}`} 
                    className="w-full h-auto rounded-xl object-contain" 
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
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
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
      setStatus('success')
      setShowSuccess(true)
    } catch {
      setStatus('error')
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-green-500/20">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">报名成功！</h3>
        <p className="text-[hsl(0_0%_75%)]">感谢您的报名，我们会尽快联系您。</p>
        <p className="text-[hsl(0_0%_75%)]">请加入我们的 Facebook 群组获取更多资讯！</p>
        <a href={FB_GROUP_LINK} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:opacity-90"
          style={{ background: '#1877F2' }}>
          加入 Facebook 群组
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">姓名 <span className="text-primary">*</span></label>
        <input
          type="text" name="name" value={form.name} onChange={handleChange} required
          placeholder="请输入您的姓名"
          className="w-full px-4 py-3 rounded-md text-foreground placeholder:text-muted-foreground outline-none bg-background border border-input focus:border-primary transition-all h-12"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">电子邮箱 <span className="text-primary">*</span></label>
        <input
          type="email" name="email" value={form.email} onChange={handleChange} required
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-md text-foreground placeholder:text-muted-foreground outline-none bg-background border border-input focus:border-primary transition-all h-12"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">联系电话 <span className="text-primary">*</span></label>
        <input
          type="tel" name="phone" value={form.phone} onChange={handleChange} required
          placeholder="+60 12-345 6789"
          className="w-full px-4 py-3 rounded-md text-foreground placeholder:text-muted-foreground outline-none bg-background border border-input focus:border-primary transition-all h-12"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">州属 <span className="text-primary">*</span></label>
        <select
          name="state" value={form.state} onChange={handleChange} required
          className="w-full px-4 py-3 rounded-md text-foreground outline-none bg-background border border-input focus:border-primary transition-all h-12"
        >
          <option value="">请选择您的州属</option>
          {STATE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">提交失败，请重试</p>
      )}
      <button
        type="submit" disabled={status === 'submitting'}
        className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 mt-6"
      >
        {status === 'submitting' ? '提交中...' : '提交报名'}
      </button>
      <p className="text-muted-foreground text-xs text-center">提交后，我们的团队会在24小时内与您联系</p>
      <p className="text-muted-foreground text-xs text-center font-bold">
        如果有任何疑问，请联系{' '}
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline text-accent">WhatsApp</a>
      </p>
    </form>
  )
}

export default function App() {
  const [openAccordion, setOpenAccordion] = useState(null)

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      
      {/* ── 1. FLOATING ALERT BANNER ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 bg-accent/95 backdrop-blur-md text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          限时报名中
        </div>
      </div>

      {/* ── 2. HERO SECTION ── */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(./assets/hero-background-CgUbRfkl.png)' }}
        />
        
        <div className="relative z-10 container px-4 py-12 md:py-20 max-w-4xl mx-auto text-center space-y-6 md:space-y-8 pt-8">
          <div className="flex flex-col items-center">
            <img 
              src="./assets/hero-instructor-updated-D8zo6JTK.png" 
              alt="Louis Loh" 
              className="max-w-sm md:max-w-xl w-full mb-4 object-contain" 
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary-foreground leading-tight">
            企业打造
            <span className="block text-accent mt-2">赚钱机器</span>
          </h1>

          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium max-w-2xl mx-auto">
            只需要3个月，让你的企业拥有一套
            <br />
            <span className="text-accent font-bold">「流量 × 成交 × 复购 × 裂变」自动赚钱系统</span>
          </p>

          <div className="max-w-3xl mx-auto">
            <video 
              className="w-full rounded-lg shadow-2xl" 
              controls 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-primary-foreground/90">
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">20/08/2026</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">8:30 till Late</span>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <img src="./assets/zoom-logo-updated-DjpWGTsc.png" alt="Zoom" className="h-6" />
              <span className="text-primary-foreground font-semibold text-lg">线上</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ABOUT SECTION ── */}
      <section 
        id="about" 
        className="relative py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/90"
      >
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: 'url(./assets/leverage-pattern-tTCXtwN8.jpg)' }}
        />
        
        <div className="relative z-10 container px-4 max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground">
              什么是<span className="text-accent">打造赚钱机器？</span>
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
              <span className="block text-2xl md:text-3xl">
                在过去十年中，Ryan 教练通过其创新的<span className="text-yellow-500 font-bold">打造赚钱机器模式</span>，成功助力超过<span className="text-yellow-500 font-bold">100家企业</span>实现业绩的<span className="text-yellow-500 font-bold">数倍至百倍增长</span>。
              </span>
              <span className="block mt-4 text-2xl md:text-3xl">
                就是建立一套能够<span className="text-yellow-500 font-bold">持续引流、稳定成交、高效运营、不断复购与裂变</span>的商业系统，让企业<span className="text-yellow-500 font-bold">不再依赖老板</span>，而是依靠系统<span className="text-yellow-500 font-bold">持续创造利润</span>。
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 max-w-xl mx-auto">
            
            {/* Card Avoid */}
            <div className="flex flex-col items-center gap-4 bg-destructive/20 backdrop-blur-sm border border-destructive/30 p-6 rounded-lg w-full">
              <img 
                src="./assets/avoid-1-B_jCDA1J.png" 
                alt="不靠蛮力拼命增长" 
                className="w-80 h-80 rounded-lg object-cover" 
              />
              {["不靠蛮力拼命增长", "不靠砸广告换短暂结果", "不靠运气等市场红利"].map((n, r) => (
                <span key={r} className="text-yellow-500 font-bold text-center text-2xl">{n}</span>
              ))}
            </div>

            {/* Card Benefit */}
            <div className="flex flex-col items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm border border-accent/30 p-6 rounded-lg w-full">
              <img 
                src="./assets/benefit-1-Cxe8rXEd.png" 
                alt="靠策略，让努力有方向" 
                className="w-80 h-80 rounded-lg object-cover" 
              />
              {["靠策略，让努力有方向", "靠系统，让成果可复制", "靠模式，让生意能放大"].map((n, r) => (
                <span key={r} className="text-yellow-500 font-bold text-center text-2xl">{n}</span>
              ))}
            </div>
            
          </div>

          {/* Pricing Highlight block */}
          <div className="space-y-6">
            <div className="text-primary-foreground font-bold leading-relaxed space-y-2">
              <span className="block text-2xl line-through opacity-70">原价RM388</span>
              <span className="block text-3xl md:text-4xl text-yellow-500 font-extrabold mt-2">
                Ryan教练送30位免费票🎫
              </span>
            </div>
            <div className="text-accent font-bold mt-4 space-y-2">
              <span className="block text-2xl md:text-3xl text-white">
                马上报名获取位子 （第31位开始收费）
              </span>
              <span className="block text-3xl md:text-4xl text-yellow-400 font-black mt-2">
                只限100位学员，位子有限！
              </span>
            </div>
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>

        </div>
      </section>

      {/* ── 4. OK SECTION: 能解决什么 ── */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/90">
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: 'url(./assets/capability-1-7u4pQpTX.png)' }}
        />
        
        <div className="relative z-10 container px-4 max-w-4xl mx-auto space-y-12">
          
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-8">
              【打造赚钱机器】能解决什么？
            </h2>
            <p className="text-xl md:text-2xl text-yellow-500 font-bold mb-6 text-left">
              很多企业老板都会陷入这样的困惑：
            </p>
            <div className="space-y-4 mb-8 text-left">
              {[
                "到底现在该先打品牌，还是先跑量？",
                `公司做到了 100K、300K、1M、5M+，
每个阶段的打法到底该怎么选？`,
                `平台越做越多，广告、内容、社交、销售交织在一起，
却越来越累、越来越乱。`
              ].map((n, r) => (
                <div key={r} className="flex items-start gap-3">
                  <span className="text-primary text-xl mt-1">●</span>
                  <p className="text-lg md:text-xl text-primary-foreground leading-relaxed">{n}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6 mb-8 text-left">
              <p className="text-lg md:text-xl text-primary-foreground leading-relaxed font-medium">
                其实，关键不在于你做得多，而在于你能不能整合出属于自己的<span className="text-yellow-500 font-bold">"海·陆·空"</span>布局——
              </p>
              
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 my-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '空', sub: '线上流量' },
                    { label: '陆', sub: '内容品牌' },
                    { label: '海', sub: '成交系统' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 text-center border border-yellow-500/30">
                      <div className="text-yellow-500 font-bold text-xl mb-2">{item.label}</div>
                      <div className="text-primary-foreground font-semibold">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-primary-foreground font-semibold mt-4 text-2xl md:text-3xl">
                  三者合一，形成一个<br className="md:hidden" />
                  <span className="text-yellow-500">可复制的增长引擎</span>
                </p>
              </div>

              <p className="text-lg md:text-xl text-primary-foreground leading-relaxed font-medium">
                当你真正学会<span className="text-yellow-500 font-bold">"打造赚钱机器"</span>的逻辑，
              </p>
              <p className="text-lg md:text-xl text-primary-foreground leading-relaxed font-medium">
                你会发现，<span className="text-yellow-500">策略、工具与团队的力量可以彼此叠加</span>——
              </p>

              <div className="space-y-4 my-6">
                {[
                  { label: "广告", highlight: "放大结果的起点", text: "不再只是花钱的地方，而是" },
                  { label: "内容", highlight: "自动成交的资产", text: "不再只是曝光，而是" },
                  { label: "团队", highlight: "能独立产出的系统", text: "不再只是执行，而是" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="text-lg md:text-xl text-primary-foreground leading-relaxed">
                      <span className="font-bold text-yellow-500 mr-2">{item.label}</span>
                      {item.text}
                      <span className="text-yellow-500 font-semibold">{item.highlight}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-accent/20 border-2 border-yellow-500 rounded-2xl p-6 text-center mt-8">
                <p className="text-xl md:text-2xl text-primary-foreground font-bold leading-relaxed">
                  那一刻，你的企业就真正进入了<br />
                  <span className="text-3xl text-amber-400 md:text-5xl">"越做越轻松、越做越大"</span>
                  <br />
                  的杠杆循环。
                </p>
              </div>
            </div>

            {/* Learn capabilities block */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12 border border-primary/20 mt-12 text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6 text-center">
                学会【打造赚钱机器】你就拥有：
              </h3>
              
              <div className="flex flex-col items-center gap-8 max-w-xl mx-auto">
                {[
                  { text: "看懂趋势的判断力", image: "./assets/capability-1-7u4pQpTX.png" },
                  { text: "找出关键问题的洞察力", image: "./assets/capability-2-BJq1KBdl.png" },
                  { text: "制定并落地增长方案的底气", image: "./assets/capability-3-Dy69MBie.png" }
                ].map((n, r) => (
                  <div key={r} className="flex flex-col items-center gap-4 w-full">
                    <img 
                      src={n.image} 
                      alt={n.text} 
                      className="w-80 h-80 rounded-lg object-cover" 
                    />
                    {r === 2 ? (
                      <p className="text-yellow-500 font-bold text-center text-2xl">
                        制定并落地<br className="md:hidden" />增长方案的底气
                      </p>
                    ) : (
                      <p className="text-yellow-500 font-bold text-center text-2xl">{n.text}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-center pt-8 border-t border-primary/20 mt-8 text-primary-foreground">
                <p className="text-lg">当别人</p>
                <p className="text-lg font-bold text-red-400">还在抱怨广告贵、顾客难成交，</p>
                <p className="text-lg">你已经</p>
                <p className="text-lg font-bold text-green-400">能看清局势、快速复制、持续增长！</p>
                <p className="text-xl md:text-3xl font-black mt-4 text-yellow-500">
                  这就是【打造赚钱机器】的价值！
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all animate-bounce-gentle"
              >
                我要报名
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. PAIN POINTS SECTION ── */}
      <section 
        className="relative py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/90"
      >
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center"
          style={{ backgroundImage: 'url(./assets/leverage-pattern-tTCXtwN8.jpg)' }}
        />
        
        <div className="container px-4 relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-6">
              你是否面对<span className="text-red-500">这些疑问？</span>
            </h2>
          </div>

          <div className="space-y-4 mb-12">
            {[
              "你是不是也发现，广告费越花越多，效果却始终不稳定？",
              "明明产品不错，却总觉得客户越来越难成交?",
              "生意卡在某个阶段，营业额就是上不去？",
              "面对越来越多的平台，你反而不知道该把力气放在哪",
              "每天忙着经营，却始终感觉品牌存在感不够强",
              "团队越做越累，方向却越来越模糊",
              "竞争对手似乎总是比你快半步、狠一步"
            ].map((text, idx) => (
              <div 
                key={idx} 
                className="bg-primary-foreground/10 backdrop-blur-sm border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg md:text-xl text-primary-foreground font-medium pt-2">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/20 backdrop-blur-sm border-2 border-primary/30 p-8 md:p-12 rounded-2xl text-center">
            <p className="text-xl md:text-2xl text-primary-foreground mb-4">
              <span className="block sm:inline">如果这些正是你现在的状态，</span>
              <span className="block sm:inline">那答案很可能是：</span>
            </p>
            <p className="text-2xl md:text-3xl text-accent font-black">你缺的不是努力，而是——</p>
            <p className="text-4xl text-primary-foreground font-black mt-4 md:text-5xl">【打造赚钱机器】</p>
            <p className="text-4xl text-primary-foreground font-black mt-2 md:text-5xl">营销战略！</p>
            
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. TARGET AUDIENCE (WHO SHOULD JOIN) ── */}
      <section 
        className="py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src="./assets/who-should-join-bg-Cu7hM2ML.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/85" />
        </div>
        
        <div className="container px-4 relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              <span className="text-white">谁应该</span>
              <span className="text-primary">参加？</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "企业老板 / 创业者",
                desc: "想突破现阶段瓶颈，让生意进入新增长曲线",
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              {
                title: "中小企业 SME",
                desc: "广告费越来越高，成交越来越低，需要一套可复制的杠杆模式",
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: "营销 / 销售主管",
                desc: "想掌握一套系统化战略，带领团队执行，不再盲目乱打",
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                )
              },
              {
                title: "已有专页 / 广告经验者",
                desc: '想从"会投广告"升级到"能整合系统、放大结果"',
                icon: (
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )
              }
            ].map((t, idx) => (
              <div 
                key={idx} 
                className="bg-card border-2 border-border hover:border-primary p-6 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  {t.icon}
                </div>
                <h3 className="font-bold text-foreground mb-3 text-2xl">{t.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. CURRICULUM SECTION ── */}
      <section 
        className="py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/90"
      >
        <div className="container px-4 max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-block bg-accent/90 text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              课程大纲
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mb-4">
              企业打造赚钱机器 训练营
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              系统性课程，线上直播
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {LESSONS.map((lesson) => {
              const isLocked = lesson.locked
              return (
                <div 
                  key={lesson.num} 
                  className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ${
                    isLocked 
                      ? 'border border-[hsl(220_13%_22%)] opacity-70 bg-gradient-to-br from-secondary/50 to-secondary/30' 
                      : 'border border-[hsl(220_13%_26%)] bg-[hsl(220_13%_18%)] hover:border-[hsl(43_96%_56%)] hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                        isLocked 
                          ? 'bg-neutral-800 text-neutral-500' 
                          : 'bg-[hsl(0_72%_51%)]/15 text-[hsl(0_72%_51%)]'
                      }`}
                    >
                      {lesson.num}
                    </div>
                    
                    <div className={`flex-1 ${isLocked ? 'blur-[1.5px]' : ''}`}>
                      <span 
                        className={`text-xs font-bold tracking-wider uppercase px-2 py-1 rounded-full mb-2 inline-block ${
                          isLocked 
                            ? 'bg-neutral-800 text-neutral-500' 
                            : 'bg-[hsl(43_96%_56%)]/15 text-[hsl(43_96%_56%)]'
                        }`}
                      >
                        {lesson.tag}
                      </span>
                      <h3 className={`font-bold mt-2 leading-snug text-lg ${isLocked ? 'text-neutral-500' : 'text-white'}`}>
                        {lesson.title}
                      </h3>
                      {lesson.tag2 && (
                        <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                          {lesson.tag2}
                        </p>
                      )}
                    </div>
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 bg-neutral-950/65 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-[hsl(43_96%_56%)]" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-neutral-400 font-bold block">锁定内容 · 报名解锁</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Yellow clickable lock banner */}
          <div 
            className="mt-12 mb-6 text-center cursor-pointer" 
            onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="inline-block bg-[hsl(43_96%_56%)]/20 border-2 border-[hsl(43_96%_56%)] px-8 py-4 rounded-xl hover:scale-105 transition-all">
              <div className="text-2xl md:text-3xl font-black text-[hsl(43_96%_56%)]">
                🔒点击报名，解锁更多内容
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS SECTION ── */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container px-4 max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full text-xl md:text-2xl font-bold mb-4">
              真实案例
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto">
            {[
              { image: "./assets/testimonial-new-1-Ba4DU2nx.png", alt: "学员见证 - 综合成功案例展示" },
              { image: "./assets/testimonial-new-2-BEDuotJW.png", alt: "学员见证 - ROI提升成功案例" },
              { image: "./assets/testimonial-new-3-Bg84uJL_.png", alt: "学员见证 - 800%业绩增长" },
              { image: "./assets/testimonial-new-4-B1rZbWfb.png", alt: "学员见证 - 600%销售提升" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden hover:scale-[1.01] transition-transform duration-300"
              >
                <img src={item.image} alt={item.alt} className="w-full h-auto block" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>

        </div>
      </section>

      {/* ── 9. COACH CREDENTIALS SECTION ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-secondary/90">
        <div className="container px-4 max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight">
              百家领头企业<br />
              最信赖FB军师<br />
              <span className="text-accent">Ryan Lim 教练</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <img 
                src="./assets/hero-instructor-updated-D8zo6JTK.png" 
                alt="Ryan Lim - Marketing Director" 
                className="w-full h-auto rounded-2xl shadow-2xl border border-[hsl(220_13%_26%)]" 
              />
            </div>
          </div>

          {/* Awards carousel */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground">
              <span className="text-accent">9次</span> 国际奖项得主
              <span className="block text-xl md:text-2xl mt-2 text-primary-foreground/90">（6次由国家总统首相颁发）</span>
            </h2>
            <ImageCarousel 
              images={[
                './assets/award-new-1-C3Y2cp_f.png',
                './assets/award-new-2-BpMC7iD1.png',
                './assets/award-new-3-BTWH93N1.png',
                './assets/award-new-4-BfK9GSpp.png',
                './assets/award-new-5-B5hF7GYR.png',
                './assets/award-new-6-pgimpSB3.png',
                './assets/award-new-7-8hRPMg1x.png'
              ]} 
              desktopSlides={3} 
            />
          </div>

          {/* Experience carousel */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight">
              超过 <span className="text-accent">9000万</span> 广告费经验<br />
              <span className="text-accent">百万</span> 专页的版主
            </h2>
            <ImageCarousel 
              images={[
                './assets/experience-1-new-aYy-fgNY.png',
                './assets/experience-2-new-DZ2jgsRw.png',
                './assets/experience-3-CAbq5sOX.png',
                './assets/experience-4-SUVlcIyy.png',
                './assets/experience-5-Pfje2xCr.png',
                './assets/experience-6-Cq7ajyVF.png',
                './assets/experience-7-IzWGSBgF.png',
                './assets/experience-8-BKA8DXfR.png',
                './assets/experience-9-BDn9UQ1d.png',
                './assets/experience-10-DoycUaE0.png'
              ]} 
              desktopSlides={3} 
            />
          </div>

          {/* Media coverage carousel */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight">
              <span className="text-accent">世界第一</span> 被美国报导的营销专家
            </h2>
            <ImageCarousel 
              images={[
                './assets/media-1-CS7KlS13.jpg',
                './assets/media-2-s1IZhFdT.jpg',
                './assets/media-3-C_kEueQm.jpg',
                './assets/media-coverage-Ce1TFezg.png'
              ]} 
              desktopSlides={3} 
              hasLogoStyle={true}
            />

            {/* HRDC Certified badges */}
            <div className="w-full max-w-2xl mx-auto mt-8 text-center space-y-4">
              <img 
                src="./assets/hrdc-logo-CsenaheX.png" 
                alt="HRDC Certified" 
                className="w-full max-w-md h-auto mx-auto object-contain bg-white/5 p-4 rounded-xl border border-white/10" 
              />
              <h3 className="text-3xl text-primary-foreground mt-4 font-bold">
                HRDF Trainer & HRDC Claimable
              </h3>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ SECTION ── */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url(./assets/faq-bg-BdueriB7.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="container max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4">常见问题 FAQ</h2>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-background border border-input rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                  className="w-full text-left text-lg font-semibold hover:no-underline py-6 flex justify-between items-center text-foreground hover:text-accent transition-colors"
                >
                  <span>{idx + 1}. {item.q}</span>
                  <svg className={`w-5 h-5 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === idx && (
                  <div className="text-muted-foreground pb-6 leading-relaxed border-t border-input pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => document.getElementById("register-section")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg animate-bounce-gentle"
            >
              我要报名
            </button>
          </div>
        </div>
      </section>

      {/* ── 11. REGISTRATION FORM SECTION ── */}
      <section id="register-section" className="py-16 md:py-24 bg-background">
        <div className="container px-4 max-w-5xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              立即报名 <span className="text-primary block mt-2">开启增长之路</span>
            </h2>
            <p className="text-xl text-muted-foreground">只需3个月，让你的企业拥有一套「流量 × 成交 × 复购 × 裂变」自动赚钱系统</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left column */}
            <div className="space-y-4 text-left">
              <h3 className="text-2xl font-bold text-foreground mb-6">课程包含：</h3>
              
              {["自动赚钱系统", "「流量 × 成交 × 复购 × 裂变」", "实战案例分析", "AI工具应用指导"].map((w, h) => (
                <div key={h} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg text-foreground">{w}</span>
                </div>
              ))}

              <div className="mt-8 p-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-xl">
                <div className="space-y-3 text-primary-foreground">
                  <p className="text-lg">
                    <span className="font-bold">课程时间：</span>8:30 till Late
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">上课方式：</span>线上 Zoom
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">课程日期：</span>20/08/2026
                  </p>
                  <p className="text-2xl font-black text-accent mt-4 animate-pulse">
                    名额有限，先到先得！
                  </p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="bg-card border-2 border-border p-8 rounded-2xl shadow-lg text-left">
              <h3 className="text-2xl font-bold text-foreground mb-6">填写报名表</h3>
              <RegisterForm />
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground text-sm border-t border-border bg-card">
        <p className="font-bold text-foreground text-base mb-2">企业打造赚钱机器</p>
        <p>© {new Date().getFullYear()} ChampAcademy. All rights reserved.</p>
        <p className="mt-2">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">联系 WhatsApp</a>
        </p>
      </footer>

    </div>
  )
}
