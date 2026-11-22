import { ExternalLink } from 'lucide-react'
import Header from '../components/Header.jsx'
import { PL_LION_URL } from '../data/media.js'

const REPOSITORY_URL = 'https://github.com/zdnaroyan/PremKit.git'

export default function About({ clubsCount, apiLive }) {
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
