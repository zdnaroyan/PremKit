import { PL_LION_URL } from '../data/media.js'

export default function LoadingScreen() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label="Memuat arsip jersey klasik PremKit"
    >
      <div className="loader-halftone-aura" aria-hidden="true" />

      <div className="loader-stage">
        <div className="loader-emblem">
          <span className="loader-pulse-ring" aria-hidden="true" />
          <span className="loader-pulse-ring loader-pulse-ring--delayed" aria-hidden="true" />

          <svg className="loader-orbit" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient
                id="premkitOrbitGrad"
                x1="6"
                y1="60"
                x2="60"
                y2="6"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#111111" stopOpacity="0" />
                <stop offset="55%" stopColor="#111111" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#111111" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <circle className="loader-orbit-track" cx="60" cy="60" r="54" />
            <circle
              className="loader-orbit-arc"
              cx="60"
              cy="60"
              r="54"
              stroke="url(#premkitOrbitGrad)"
            />
            <circle className="loader-orbit-dot" cx="60" cy="6" r="2.4" />
          </svg>

          <div className="loader-medallion">
            <img
              className="loader-lion"
              src={PL_LION_URL}
              alt="Logo Singa Premier League"
            />
            <span className="loader-sheen" aria-hidden="true" />
          </div>
        </div>

        <div className="loader-brand">PREMKIT</div>
        <div className="loader-progress" aria-hidden="true">
          <span className="loader-progress-bar" />
        </div>
        <p className="loader-caption">Memuat arsip klasik</p>
      </div>
    </div>
  )
}
