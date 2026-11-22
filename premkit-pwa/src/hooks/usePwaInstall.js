import { useCallback, useEffect, useState } from 'react'

// Module-level store ensures beforeinstallprompt is captured immediately at app boot
let deferredPromptEvent = null
let installedFlag = false
const subscribers = new Set()

function detectStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: window-controls-overlay)').matches ||
    window.navigator?.standalone === true
  )
}

function detectPlatform() {
  if (typeof navigator === 'undefined') {
    return { isIOS: false, isAndroid: false, isMacSafari: false }
  }
  const ua = navigator.userAgent || ''
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /android/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios|edg|opr|samsungbrowser/i.test(ua)
  const isMacSafari = !isIOS && isSafari && /macintosh/i.test(ua)
  return { isIOS, isAndroid, isMacSafari }
}

function notify() {
  subscribers.forEach((fn) => fn())
}

if (typeof window !== 'undefined') {
  installedFlag = detectStandalone()

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPromptEvent = e
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPromptEvent = null
    installedFlag = true
    notify()
  })

  const standaloneMedia = window.matchMedia?.('(display-mode: standalone)')
  standaloneMedia?.addEventListener?.('change', (e) => {
    if (e.matches) {
      deferredPromptEvent = null
      installedFlag = true
      notify()
    }
  })
}

export function usePwaInstall() {
  const [, setTick] = useState(0)
  const [installing, setInstalling] = useState(false)
  const [platform] = useState(() => detectPlatform())

  useEffect(() => {
    const listener = () => setTick((n) => n + 1)
    subscribers.add(listener)
    return () => {
      subscribers.delete(listener)
    }
  }, [])

  const isInstalled = installedFlag || detectStandalone()
  const canPrompt = Boolean(deferredPromptEvent) && !isInstalled

  const promptInstall = useCallback(async () => {
    if (!deferredPromptEvent) return { outcome: 'unavailable' }
    setInstalling(true)
    try {
      await deferredPromptEvent.prompt()
      const choice = await deferredPromptEvent.userChoice
      deferredPromptEvent = null
      if (choice?.outcome === 'accepted') {
        installedFlag = true
      }
      notify()
      return { outcome: choice?.outcome || 'dismissed' }
    } catch (_) {
      return { outcome: 'error' }
    } finally {
      setInstalling(false)
    }
  }, [])

  return {
    canPrompt,
    isInstalled,
    installing,
    promptInstall,
    ...platform,
  }
}
