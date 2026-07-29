import { useState, useEffect } from 'react'
import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const getAssetUrl = (path) => {
  if (!path) return path;
  const cleanPath = path.replace(/^(\.\/|\/)/, "");
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const WHATSAPP_LINK = 'https://wa.me/60123456789?text=%E6%82%A8%E5%A5%BD%EF%BC%8C%E6%88%91%E6%9C%89%E5%85%B4%E8%B6%A3%E5%8F%82%E5%8A%A0%E3%80%90%E4%BC%81%E4%B8%9A%E6%89%93%E9%80%A0%E8%B5%9A%E9%92%B1%E6%9C%BA%E5%99%A8%E3%80%91%EF%BC%8C%E6%83%B3%E4%BA%86%E8%A7%A3%E6%9B%B4%E5%A4%9A%E8%AF%A6%E6%83%85%E3%80%82'
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

const FAQS = [
  { q: '谁适合参与这个课程？', a: '如果你广告费越来越高、顾客越来越难成交，或者公司发展卡在某个阶段，这场【企业打造赚钱机器】训练营就是为你准备的。' },
  { q: '请问主讲人是 Ryan 教练吗？', a: '是的，整个 3 个月的 11 堂课都会由 Ryan 教练亲自带领，结合 9000 万广告操盘经验与 150 个行业第一案例，带你实战掌握【打造赚钱机器】。' },
  { q: '请问在哪里上课？', a: '这是一个线上课程，将通过 Zoom 举行，任何地区的企业主都可以在线参与学习。' },
  { q: '请问可以看重播吗？', a: '不会提供录影！因为课程内容涉及大量真实案例与最新策略，我们坚持保密，小班制，只对现场学员开放。' },
  { q: '请问课程几点开始？', a: '课程时间为 8:30 till Late。下一期开课时间：2026年8月20日。' },
  { q: '请问课程收费多少？', a: '课程原价 RM388。但这次特别开放优惠，Ryan教练送30位免费票🎫！马上报名获取位子（第31位开始收费）。只限100位学员，位子有限！' },
  { q: '请问报名后，下一步要做什么？', a: '只要填写正确的 Email 与电话号码，你会收到确认通知。这代表你已正式锁定名额，进入【企业打造赚钱机器】。记得把课程时间记好，务必全程出席！' }
]

const SOCIAL_PROOFS = [
  { name: 'Tan 先生', location: '雪兰莪', time: '1分钟前' },
  { name: '陈总', location: '吉隆坡', time: '2分钟前' },
  { name: 'Lim 女士', location: '槟城', time: '4分钟前' },
  { name: 'Wong 总', location: '柔佛', time: '5分钟前' },
  { name: '张老板', location: '霹雳', time: '7分钟前' }
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

function SocialProofToast() {
  const [currentProof, setCurrentProof] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showRandomToast = () => {
      const randomItem = SOCIAL_PROOFS[Math.floor(Math.random() * SOCIAL_PROOFS.length)]
      setCurrentProof(randomItem)
      setVisible(true)
      setTimeout(() => setVisible(false), 4500)
    }

    const initialTimer = setTimeout(showRandomToast, 3000)
    const interval = setInterval(showRandomToast, 12000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  if (!currentProof || !visible) return null

  return (
    <div className="fixed bottom-20 left-4 z-50 animate-fade-in-up">
      <div className="bg-slate-900/95 border border-amber-500/50 text-white p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold text-lg shrink-0">
          ⚡
        </div>
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-amber-300">
            来自 <span className="text-white">{currentProof.location}</span> 的 <span className="text-white">{currentProof.name}</span>
          </p>
          <p className="text-gray-300">刚刚抢购了免费门票！</p>
          <span className="text-[10px] text-amber-400/80 font-medium">{currentProof.time}</span>
        </div>
      </div>
    </div>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 my-3 text-white">
      <div className="flex flex-col items-center bg-black/60 border border-amber-500/40 px-3 py-2 rounded-lg min-w-[60px]">
        <span className="text-xl md:text-3xl font-black text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-gray-300 uppercase font-semibold">Hours</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-amber-400">:</span>
      <div className="flex flex-col items-center bg-black/60 border border-amber-500/40 px-3 py-2 rounded-lg min-w-[60px]">
        <span className="text-xl md:text-3xl font-black text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-gray-300 uppercase font-semibold">Minutes</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-amber-400">:</span>
      <div className="flex flex-col items-center bg-black/60 border border-amber-500/40 px-3 py-2 rounded-lg min-w-[60px]">
        <span className="text-xl md:text-3xl font-black text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[10px] md:text-xs text-gray-300 uppercase font-semibold">Seconds</span>
      </div>
    </div>
  )
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
        source: 'Champ Learning Landing Page'
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
        {status === 'submitting' ? '提交中...' : '👉 立即抢购免费门票 (价值RM388)'}
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
          background: linear-gradient(to right, #fbbf24, #facc15, #f59e0b) !important; 
          color: #000000 !important; 
          border: 3px solid #fef08a !important; 
        }
      `}</style>
      
      {/* Social Proof Toast */}
      <SocialProofToast />

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
            【ChampAcademy 官方特惠】送出 30 张免费限量名额！
          </div>
          <div className="text-gray-300 text-xs md:text-sm">
            开课日期：<span className="text-white font-semibold">2026年8月20日</span> | 8:30 PM till Late (Zoom Live)
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
            ★ 全马首屈一指实战企业营销训练营 ★
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            只需要3个月，让你的企业拥有一套
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-2">
              「流量 × 成交 × 复购 × 裂变」自动赚钱系统
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            不靠砸大钱打广告，不靠团队拼命加加班！教你用策略与杠杆模式打造自动盈利机器。
          </p>

          {/* Video or Instructor Highlight */}
          <div className="max-w-3xl mx-auto my-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-black">
            <video 
              className="w-full rounded-2xl" 
              controls 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          </div>

          {/* Key Metrics Counter Strip (Professional Proof Banner) */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-center">
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">90,000,000+</div>
              <div className="text-xs text-gray-300 font-medium">广告费实战操盘</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">150+</div>
              <div className="text-xs text-gray-300 font-medium">行业第一成功案例</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">99.4%</div>
              <div className="text-xs text-gray-300 font-medium">学员好评满度</div>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
              <div className="text-xl md:text-2xl font-black text-amber-400">100%</div>
              <div className="text-xs text-gray-300 font-medium">HRDC 官方可报销</div>
            </div>
          </div>

          {/* Pricing Box - Styled after SmartFinancing SF template price banner */}
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-amber-500/50 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="text-gray-400 text-lg font-semibold">
              课程原价：<strike className="text-red-400 text-xl font-bold">RM 388</strike>
            </div>
            <div className="text-2xl md:text-4xl font-extrabold text-amber-400">
              🎁 现在特惠：首30位学员免费参与！
            </div>
            
            <CountdownTimer />

            <button
              onClick={openModal}
              className="w-full md:w-4/5 py-4 px-6 rounded-full font-black text-xl text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-[3px] border-yellow-200 hover:scale-105 transition-all shadow-xl shadow-amber-500/25 animate-bounce-gentle cursor-pointer force-gold-btn"
            >
              👉 立即抢购免费门票
            </button>
            <p className="text-xs text-amber-300/80 font-medium">【一旦超过30位指定人数，课程将恢复原价 RM 388】</p>
          </div>

        </div>
      </section>

      {/* ── 2. WHAT YOU WILL LEARN (在课程里，你将会学到) ── */}
      <section 
        className="py-16 md:py-24 border-b border-slate-800 relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(10, 17, 30, 0.95), rgba(10, 17, 30, 0.95)), url(${getAssetUrl("assets/leverage-pattern-tTCXtwN8.jpg")})` }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-amber-400 border-l-4 border-amber-400 pl-4">
                在课程里，你将会学到：
              </h2>
              
              <ul className="space-y-4 text-base md:text-lg text-gray-200">
                {[
                  "如何拆解【打造赚钱机器核心思维】：用同等资源放大10倍结果",
                  "如何根据公司阶段（100K / 300K / 1M / 5M+）设计商业模式",
                  "如何设定精准受众与预算，避免无效广告消耗",
                  "如何通过“收网”把广告点击转化为实际成交与高复购",
                  "如何锁定精确增长节点与闭环流量链设计",
                  "如何打造24小时自动运行的内容获客资产",
                  "如何操作多维度混合媒介矩阵（混合图文、多组短视频、高频直营）",
                  "如何构建能独立运行的获客与跟进团队系统，解放创始人时间"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-2xl shrink-0">💡</span>
                    <span className="font-semibold pt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
                <img 
                  src={getAssetUrl("assets/hero-instructor-updated-D8zo6JTK.png")} 
                  alt="Ryan Lim 教练" 
                  className="w-full h-auto object-cover max-w-md"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 p-4 text-center">
                  <span className="text-amber-400 font-extrabold text-lg">主讲导师：Ryan Lim 教练</span>
                  <p className="text-gray-300 text-xs">百家领头企业最信赖 FB 营销军师</p>
                </div>
              </div>
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
              Ryan Lim 教练 荣获了
            </h2>
            <p className="text-xl md:text-2xl text-white font-bold">
              🏆 9次 国际奖项得主（6次由国家总统/首相亲颁）
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
                <li>• 操盘超过 9000万 广告费实战经验</li>
                <li>• 拥有百万粉丝专页官方版主与运营者</li>
                <li>• 帮助超过 100+ 企业实现 100K - 5M+ 业绩突破</li>
                <li>• 唯一获美国知名国际媒体专题报道的营销专家</li>
                <li>• HRDF 认证培训师 & HRDC Claimable 官方资格</li>
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
            原价 <strike className="opacity-75">RM 388</strike> ，现在只需免费报名！
          </h2>
          <p className="text-base md:text-lg font-bold">
            只限前30位免费名额，先到先得！
          </p>
          <button 
            onClick={openModal}
            className="px-8 py-3.5 rounded-full font-black text-lg text-white bg-slate-950 hover:bg-slate-900 transition-all shadow-xl hover:scale-105 cursor-pointer"
          >
            👉 抢先预订免费名额
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
              如果你符合以下任何一种情况，这场训练营将为你带来突破性的改变！
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "企业老板 / 创业者：想突破现阶段瓶颈，让生意进入新增长曲线",
              "中小企业 SME：广告费越来越高，成交越来越低，急需一套可复制的杠杆模式",
              "营销 / 销售主管：想掌握一套系统化战略，带领团队高效执行",
              "已有专页 / 广告经验者：想从“会投广告”升级到“能整合系统、放大结果”"
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl flex items-start gap-4">
                <span className="text-amber-400 text-2xl font-black">✔</span>
                <span className="text-gray-200 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* 海陆空 System Box */}
          <div className="bg-slate-950 border-2 border-amber-500/40 p-8 rounded-2xl text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-amber-400">
              掌握“海·陆·空”全方位增长引擎
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-extrabold text-xl">空</div>
                <div className="text-gray-300 font-semibold text-sm">线上精准流量</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-extrabold text-xl">陆</div>
                <div className="text-gray-300 font-semibold text-sm">内容品牌心智</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-extrabold text-xl">海</div>
                <div className="text-gray-300 font-semibold text-sm">高效成交系统</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. STUDENT TESTIMONIALS (真实案例) ── */}
      <section className="py-16 md:py-24 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-amber-400">
              真实学员见证 & 成功案例
            </h2>
            <p className="text-gray-300">
              看来自不同行业的企业主如何通过“打造赚钱机器”实现数倍业绩暴增！
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
              Ryan Lim 导师的话：
            </h2>
            <div className="space-y-4 text-gray-200 text-base md:text-lg leading-relaxed">
              <p>
                在现今的时代里，很多企业老板想要透过商业系统与FB营销改变现状、突破瓶颈。但往往却因为没有找到正确的策略，导致广告费越来越贵、客户成交越来越难等困扰。
              </p>
              <p>
                其实，做生意并不需要盲目靠蛮力！只需要懂得运用对的系统和布局来进行有效的放大。因此，为了帮助更多企业主能懂得实战营销知识，做对的系统，Ryan Lim 导师创办了 ChampAcademy 平台。
              </p>
              <p>
                他整合了超过 9000万 广告费操盘实战经验，巧妙地将其转化为独一无二的【企业打造赚钱机器】系统，让更多人在商业增长之旅中占据绝对优势！
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
              填写表格 · 抢占 30 位免费名额
            </h2>
            <p className="text-gray-300 text-sm">
              只需填写正确资料，我们的课程团队会在 24 小时内确认您的席位
            </p>
          </div>
          <RegisterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-center text-gray-400 text-xs md:text-sm border-t border-slate-800 space-y-2">
        <p className="font-bold text-white">ChampAcademy - 企业打造赚钱机器</p>
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
          <span className="text-amber-400 font-extrabold text-sm">【企业打造赚钱机器】训练营</span>
          <span className="text-gray-300 text-xs">首30位免费名额倒数中</span>
        </div>
        <button
          onClick={openModal}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full font-black text-sm md:text-base text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-2 border-yellow-200 hover:scale-105 transition-all shadow-lg shadow-amber-500/20 cursor-pointer force-gold-btn"
        >
          👉 立即抢购免费门票 (RM0)
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
                限时特惠
              </span>
              <h3 className="text-2xl font-extrabold text-amber-400">
                抢占《企业打造赚钱机器》免费名额
              </h3>
              <p className="text-gray-300 text-xs">
                请正确填写以下信息，席位确认后将发送 Zoom 直播链接至您的 Email
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>
      )}

    </div>
  )
}
