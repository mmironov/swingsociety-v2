import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Payload serves uploads from /api/media/file/* and, in production, from the
    // configured S3/blob host. Local files are read straight off disk.
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_SERVER_URL
        ? [
            {
              protocol: new URL(process.env.NEXT_PUBLIC_SERVER_URL).protocol.replace(':', ''),
              hostname: new URL(process.env.NEXT_PUBLIC_SERVER_URL).hostname,
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      // The school's Bulgarian audience knows this page as "графикът" — keep the
      // Bulgarian URL working alongside the canonical /schedule route.
      { source: '/bg/grafik', destination: '/bg/schedule', permanent: true },
      { source: '/grafik', destination: '/bg/schedule', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
