import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        loading: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/login.html'),
        signup: resolve(__dirname, 'src/signup.html'),
        home: resolve(__dirname, 'src/home.html'),
        product: resolve(__dirname, 'src/product.html'),
        profile: resolve(__dirname, 'src/profile.html'),
        stalk: resolve(__dirname, 'src/stalk.html'),
        wishlist: resolve(__dirname, 'src/wishlist.html'),
        notification: resolve(__dirname, 'src/notification.html'),
        search: resolve(__dirname, 'src/search.html'),
        account: resolve(__dirname, 'src/account.html'),
        about: resolve(__dirname, 'src/about.html'),
        contact: resolve(__dirname, 'src/contact.html'),
      }
    }
  },
});
