/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['mi2-public.s3.amazonaws.com', `${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com`],
  },
};

export default nextConfig;
