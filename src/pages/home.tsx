import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

export default function Home() {
  // avoid hydration errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Example: set theme based on client logic
    // setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by not rendering themed div until client mounts
    return null;
  }





  return (
    <h1>im testing tabs without app router :)</h1>
  );
}