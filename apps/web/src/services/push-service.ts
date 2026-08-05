'use client';

export class PushNotificationService {
  private static watcherId: number | null = null;

  public static async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    const permission = await Notification.requestPermission();
    return permission;
  }

  public static sendLocalNotification(title: string, options?: NotificationOptions) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
  }

  public static startLocationWatcher(onLocationChange?: (coords: { lat: number; lng: number }) => void) {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      if (this.watcherId !== null) return;

      this.watcherId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (onLocationChange) onLocationChange(coords);
        },
        (err) => {
          console.warn('Geolocation access declined or unavailable:', err.message);
        },
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 15000 }
      );
    }
  }

  public static stopLocationWatcher() {
    if (typeof window !== 'undefined' && 'geolocation' in navigator && this.watcherId !== null) {
      navigator.geolocation.clearWatch(this.watcherId);
      this.watcherId = null;
    }
  }
}
