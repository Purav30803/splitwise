import withPWA from 'next-pwa';

const nextConfig = {
  // Your Next.js config options go here
//   reactStrictMode: true,
};

export default withPWA(nextConfig, {
  dest: 'public',
  register: true,
  skipWaiting: true,
  // disable: process.env.NODE_ENV === 'development',
});
