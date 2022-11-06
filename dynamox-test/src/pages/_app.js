import "swiper/css";
import "swiper/css/pagination";
import "src/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Raleway } from "@next/font/google";
import Swiper, { Navigation, Pagination } from "swiper";

const raleway = Raleway({
  weight: ["400", "500", "700"],
});

function MyApp({ Component, pageProps }) {
  new Swiper(".swiper", {
    modules: [Navigation, Pagination],
    allowTouchMove: false,
  });
  return (
    <main className={`${raleway.className}`}>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={8000} />
    </main>
  );
}

export default MyApp;
