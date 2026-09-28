import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.luphuc.battu',
  appName: 'Bát Tự Lữ Phúc',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    cleartext: true,
    ...(serverUrl && serverUrl.startsWith('http') ? { url: serverUrl } : {}),
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1a2234',
  },
};

export default config;
