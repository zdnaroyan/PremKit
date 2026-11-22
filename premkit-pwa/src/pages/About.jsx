import { useState } from 'react'
import { Check, Download, ExternalLink, Laptop, Smartphone, Tablet } from 'lucide-react'
import Header from '../components/Header.jsx'
import { PL_LION_URL } from '../data/media.js'
import { usePwaInstall } from '../hooks/usePwaInstall.js'

const REPOSITORY_URL = 'https://github.com/zdnaroyan/PremKit.git'

function getManualInstallSteps({ isIOS, isAndroid, isMacSafari }) {
  if (isIOS) {
    return {
      title: 'Cara Install di iPhone / iPad (Safari)',
      steps: [
        'Ketuk tombol Bagikan (ikon kotak dengan panah ke atas) di bilah Safari.',
        'Gulir ke bawah lalu pilih "Tambahkan ke Layar Utama" (Add to Home Screen).',
        'Ketuk "Tambah" di pojok kanan atas untuk memasang PremKit.',
      ],
    }
  }
  if (isAndroid) {
    return {
      title: 'Cara Install di HP / Tablet Android',
      steps: [
        'Ketuk menu titik tiga (⋮) di pojok kanan atas browser (Chrome / Edge).',
        'Pilih "Install aplikasi" atau "Tambahkan ke Layar Utama".',
        'Konfirmasi pemasangan agar PremKit muncul seperti aplikasi native.',
      ],
    }
  }
  if (isMacSafari) {
    return {
      title: 'Cara Install di Mac (Safari)',
      steps: [
        'Klik menu "File" di bilah menu atas Safari.',
        'Pilih "Add to Dock..." (Tambahkan ke Dock).',
        'Klik "Add" untuk memasang PremKit sebagai aplikasi desktop.',
      ],
    }
  }
  return {
    title: 'Cara Install di Laptop / Desktop',
    steps: [
      'Klik ikon Install (ikon layar dengan panah ke bawah) di sisi kanan address bar Chrome atau Edge.',
      'Atau buka menu browser (⋮ / ⋯) lalu pilih "Install PremKit" / "Aplikasi → Install situs ini sebagai aplikasi".',
      'Konfirmasi pemasangan agar PremKit bisa dibuka langsung dari desktop.',
    ],
  }
}

export default function About({ clubsCount, apiLive }) {
  const { canPrompt, isInstalled, installing, promptInstall, isIOS, isAndroid, isMacSafari } =
    usePwaInstall()
  const [showGuide, setShowGuide] = useState(false)
  const [installNote, setInstallNote] = useState('')

  const manualGuide = getManualInstallSteps({ isIOS, isAndroid, isMacSafari })

  const handleInstallClick = async () => {
    setInstallNote('')
    if (canPrompt) {
      const result = await promptInstall()
      if (result.outcome === 'dismissed') {
        setInstallNote('Instalasi dibatalkan. Anda dapat memasang kapan saja melalui tombol ini.')
      }
      return
    }
    setShowGuide((prev) => !prev)
  }

  return (
    <div className="view-enter">
      <Header />
      <div className="content-container about-container">
        <section className="about-hero">
          <div className="about-badge-box">
            <img src={PL_LION_URL} alt="Logo Singa Premier League" />
          </div>
          <div className="brand-wordmark" style={{ fontSize: '24px', marginBottom: '8px' }}>
            PREMKIT
          </div>
          <p className="sheet-copy" style={{ maxWidth: '380px', margin: '0 auto' }}>
            Arsip digital non-jual-beli yang mengkurasi jersey klasik terbaik dari sebelas klub Premier League.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-label">Profil Pengembang</h2>
          <div className="about-rows">
            <div className="about-row">
              <span className="about-row-k">Nama</span>
              <span className="about-row-v">Zaidan Ali Arroyan</span>
            </div>
            <div className="about-row">
              <span className="about-row-k">NIM</span>
              <span className="about-row-v">21120124140117</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-label">Instalasi Aplikasi</h2>
          <div className="about-install-card">
            <div className="about-install-head">
              <div>
                <div className="about-install-title">Pasang PremKit di Perangkat</div>
                <p className="about-install-desc">
                  Buka lebih cepat dari layar utama dan tetap dapat diakses saat offline.
                </p>
              </div>
              <div className="about-device-chips" aria-label="Mendukung HP, Tablet, dan Laptop">
                <span className="about-device-chip">
                  <Smartphone size={12} strokeWidth={1.8} aria-hidden="true" />
                  <span>HP</span>
                </span>
                <span className="about-device-chip">
                  <Tablet size={12} strokeWidth={1.8} aria-hidden="true" />
                  <span>Tablet</span>
                </span>
                <span className="about-device-chip">
                  <Laptop size={12} strokeWidth={1.8} aria-hidden="true" />
                  <span>Laptop</span>
                </span>
              </div>
            </div>

            {isInstalled ? (
              <div className="about-installed-badge" role="status">
                <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                <span>Aplikasi Sudah Terpasang</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="black-pill-btn about-install-btn"
                  onClick={handleInstallClick}
                  disabled={installing}
                >
                  <Download size={15} strokeWidth={2} aria-hidden="true" />
                  <span>
                    {installing
                      ? 'MEMPROSES INSTALASI...'
                      : canPrompt
                        ? 'INSTALL APLIKASI'
                        : showGuide
                          ? 'TUTUP PANDUAN INSTALL'
                          : 'INSTALL APLIKASI'}
                  </span>
                </button>

                {installNote && <p className="about-install-note">{installNote}</p>}

                {showGuide && (
                  <div className="about-install-guide">
                    <div className="about-install-guide-title">{manualGuide.title}</div>
                    <ol className="about-install-steps">
                      {manualGuide.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-label">Repositori GitHub</h2>
          <div className="about-rows">
            <div className="about-row about-row--link">
              <span className="about-row-k">Utama</span>
              <a
                className="about-row-link"
                href={REPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{REPOSITORY_URL}</span>
                <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-label">Tentang Aplikasi</h2>
          <div className="about-rows">
            <div className="about-row">
              <span className="about-row-k">Status API</span>
              <span className="about-row-v">
                {apiLive ? 'Terhubung · premkit-api.vercel.app' : 'Mode Cache Offline Aktif'}
              </span>
            </div>
            <div className="about-row">
              <span className="about-row-k">Jumlah Klub</span>
              <span className="about-row-v">{clubsCount} Klub Premier League</span>
            </div>
            <div className="about-row">
              <span className="about-row-k">Koleksi</span>
              <span className="about-row-v">1 Jersey Terbaik per Klub</span>
            </div>
            <div className="about-row">
              <span className="about-row-k">Tujuan Aplikasi</span>
              <span className="about-row-v">Katalog Pameran · Non-Jual-Beli</span>
            </div>
            <div className="about-row">
              <span className="about-row-k">Teknologi</span>
              <span className="about-row-v">React Vite PWA · Express · Supabase</span>
            </div>
            <div className="about-row">
              <span className="about-row-k">Hosting</span>
              <span className="about-row-v">Vercel</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
