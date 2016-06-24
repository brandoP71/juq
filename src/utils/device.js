import MobileDetect from 'mobile-detect';

/**
 * detect
 */
export function detect() {
  window.__DEVICE__ = new MobileDetect(window.navigator.userAgent);  // eslint-disable-line
}

/**
 * isMobile
 * return
 */
export function isMobile() {
  return window.__DEVICE__.mobile() && !window.__DEVICE__.tablet();  // eslint-disable-line
}

/**
 * isTablet
 * return
 */

export function isTablet() {
  return window.__DEVICE__.mobile() && window.__DEVICE__.tablet();  // eslint-disable-line
}

/**
 * isDesktop
 * return
 */

export function isDesktop() {
  return !window.__DEVICE__.mobile() && !window.__DEVICE__.tablet();  // eslint-disable-line
}
