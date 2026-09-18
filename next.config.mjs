/** @type {import('next').NextConfig} */

// GitHub Pages project sites are served from /<repo>, so every asset and route
// needs that prefix. Set NEXT_PUBLIC_BASE_PATH in CI to the repository name.
// A user/org site (<user>.github.io) or a custom domain leaves it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  // Pinned explicitly: there's an unrelated package-lock.json in $HOME that
  // otherwise makes Turbopack's root inference ambiguous and noisy.
  turbopack: { root: import.meta.dirname },
  // Static hosting has no request-time image service.
  images: { unoptimized: true },
  // Emits /about/index.html rather than /about.html, which is what GitHub Pages
  // resolves correctly without a server rewrite.
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
