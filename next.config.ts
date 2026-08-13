import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the output-file-tracing root to this project so Next.js does not walk
  // up into an enclosing workspace/package directory when inferring it.
  outputFileTracingRoot: path.resolve(process.cwd()),
};

export default nextConfig;
