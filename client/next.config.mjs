

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['mi2-public.s3.amazonaws.com', `${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com`],
  },
 async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com;",
          },
          {
            key: 'Set-Cookie',
            value: 'SameSite=None; Secure',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
