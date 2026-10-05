export function getDeviceFingerprint(): string {
  if (typeof window === "undefined") return "";

  const storageKey = "_siwes_device_id";
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    // Generate a unique token combining random seed and browser environment parameters
    const seed = Math.random().toString(36).substring(2, 15);
    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    const navInfo = navigator.userAgent;
    deviceId = btoa(`${seed}-${screenInfo}-${navInfo.slice(0, 30)}`);
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}