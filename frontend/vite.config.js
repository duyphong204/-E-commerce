import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './' ,
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer", "crypto-browserify", "stream-browserify"],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Nhóm tạo file PDF hóa đơn
            if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("dompurify") || id.includes("purify")) {
              return "pdf-exporter";
            }
            // Nhóm vẽ biểu đồ (Trang admin)
            if (id.includes("recharts") || id.includes("d3")) {
              return "admin-charts";
            }
            // Nhóm sliders / swipe banners
            if (id.includes("swiper")) {
              return "swiper-banners";
            }
            // SDK Thanh toán Paypal
            if (id.includes("paypal")) {
              return "paypal-payments";
            }
            // Thư viện Icons
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "ui-icons";
            }
            // React & Core State management libraries
            if (
              id.includes("react") ||
              id.includes("redux") ||
              id.includes("axios") ||
              id.includes("scheduler")
            ) {
              return "react-core";
            }
          }
        },
      },
    },
  },
});
