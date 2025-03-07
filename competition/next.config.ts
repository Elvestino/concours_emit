import { middleware } from "@/app/middleware";
import type { NextConfig } from "next";

module.exports = {
  /* config options here */
  output: 'standalone',
  experimental: {

  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
