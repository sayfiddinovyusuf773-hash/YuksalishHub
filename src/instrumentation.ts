export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const PING_INTERVAL = 8 * 60 * 1000; // Har 8 daqiqada
    const targetUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://yuksalishhub.onrender.com';

    // Server ishga tushgach 30 soniyadan keyin boshlash
    setTimeout(() => {
      const ping = async () => {
        try {
          const healthUrl = `${targetUrl.replace(/\/$/, '')}/api/health`;
          const res = await fetch(healthUrl);
          if (res.ok) {
            console.log(
              `[Keep-Alive] Render uyg'oq saqlandi (${new Date().toLocaleTimeString('uz-UZ')})`
            );
          }
        } catch (err) {
          // Xatolik bo'lsa server to'xtab qolmasligi uchun
          console.error('[Keep-Alive] Ping xatosi:', err);
        }
      };

      // Dastlabki chaqiruv va interval
      ping();
      setInterval(ping, PING_INTERVAL);
    }, 30 * 1000);
  }
}
