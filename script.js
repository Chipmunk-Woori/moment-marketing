'use strict'


// =========================================
// HEADER SCROLL
// =========================================
const header = document.getElementById('header')

function handleHeaderScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true })
handleHeaderScroll()

// =========================================
// MOBILE MENU
// =========================================
function toggleMenu() {
  const menu = document.getElementById('mobileMenu')
  const overlay = document.getElementById('mobileOverlay')
  const isOpen = menu.classList.contains('open')

  menu.classList.toggle('open', !isOpen)
  overlay.classList.toggle('open', !isOpen)
  document.body.style.overflow = isOpen ? '' : 'hidden'
}


// =========================================
// SCROLL TO TOP
// =========================================
const scrollTopBtn = document.getElementById('scrollTop')

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300)
}, { passive: true })

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// =========================================
// STATS COUNTER
// =========================================
let statsAnimated = false

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

function animateCounters() {
  if (statsAnimated) return
  statsAnimated = true

  const items = document.querySelectorAll('.stat-item')

  items.forEach(item => {
    const target = parseInt(item.dataset.target, 10)
    const countEl = item.querySelector('.count')
    const duration = 1800
    const start = performance.now()

    function update(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.round(easeOutQuart(progress) * target)
      countEl.textContent = value.toLocaleString()
      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  })
}

// =========================================
// VIDEO MODAL
// =========================================
const VIDEO_ID = 'dQw4w9WgXcQ' // 실제 YouTube 영상 ID로 교체하세요

function openVideoModal() {
  const modal = document.getElementById('videoModal')
  const iframe = document.getElementById('videoIframe')
  iframe.src = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`
  modal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  document.addEventListener('keydown', handleVideoKeydown)
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal')
  const iframe = document.getElementById('videoIframe')
  modal.classList.add('hidden')
  iframe.src = ''
  document.body.style.overflow = ''

  document.removeEventListener('keydown', handleVideoKeydown)
}

function handleVideoOverlayClick(e) {
  if (e.target === e.currentTarget) closeVideoModal()
}

function handleVideoKeydown(e) {
  if (e.key === 'Escape') closeVideoModal()
}

// =========================================
// HERO STAT COUNTERS
// =========================================
function initHeroCounters() {
  const heroSection = document.getElementById('hero')
  if (!heroSection) return

  let animated = false

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || animated) return
      animated = true

      document.querySelectorAll('.hero-count').forEach(el => {
        const target = parseInt(el.dataset.target, 10)
        const duration = 1800
        const start = performance.now()

        function update(now) {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          el.textContent = Math.floor(target * ease).toLocaleString()
          if (progress < 1) requestAnimationFrame(update)
          else el.textContent = target.toLocaleString()
        }

        requestAnimationFrame(update)
      })

      observer.disconnect()
    },
    { threshold: 0.3 },
  )

  observer.observe(heroSection)
}

// =========================================
// SCROLL REVEAL + INTERSECTION OBSERVER
// =========================================
function initReveal() {
  const targets = document.querySelectorAll(
    '.work-card, .service-card, .about-card, .stat-item, ' +
    '.section-header, .about-text, .about-visual, ' +
    '.contact-text, .contact-form-wrapper, .info-item'
  )

  targets.forEach((el, i) => {
    el.classList.add('reveal')
    el.style.transitionDelay = `${(i % 4) * 80}ms`
  })

  const statsSection = document.querySelector('.stats-section')

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')

          if (entry.target === statsSection || statsSection.contains(entry.target)) {
            animateCounters()
          }

          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  targets.forEach(el => observer.observe(el))

  // Stats observer
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animateCounters()
          statsObserver.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    statsObserver.observe(statsSection)
  }
}

// =========================================
// CONTACT FORM
// =========================================
function submitForm(e) {
  e.preventDefault()

  const name = document.getElementById('formName').value.trim()
  const email = document.getElementById('formEmail').value.trim()
  const phone = document.getElementById('formPhone').value.trim()

  if (!name || !email || !phone) {
    alert('필수 항목을 모두 입력해주세요.')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert('올바른 이메일 주소를 입력해주세요.')
    return
  }

  const btn = e.target.querySelector('.btn-submit')
  btn.textContent = '전송 중...'
  btn.disabled = true

  // Simulate async submit
  setTimeout(() => {
    btn.textContent = '✓ 문의가 접수되었습니다'
    btn.style.background = '#22c55e'
    e.target.reset()

    setTimeout(() => {
      btn.textContent = '무료 전략 컨설팅 신청'
      btn.style.background = ''
      btn.disabled = false
    }, 3000)
  }, 1000)
}

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  initReveal()
  initHeroCounters()
})
