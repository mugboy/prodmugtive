import "@/styles/styles.scss";
import type { AppProps } from "next/app";
import * as bootstrap from "bootstrap";
import { useEffect } from "react";


export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", "light");
    return () => {
      document.body.removeAttribute("data-bs-theme");
    };
  }, []);
  return <Component {...pageProps} />;
}