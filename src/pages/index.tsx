import { useEffect, useRef, useState } from "react";
import Head from "next/head";

function parseJwt(token?: string) {
  if (!token) {
    console.error("Invalid token passed to parseJwt:", token);
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = "";

  try {
    jsonPayload = decodeURIComponent(
      atob(base64)
        .split("") // <-- This split
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    console.error("Error decoding JWT payload:", e);
    return null;
  }

  return JSON.parse(jsonPayload);
}
// Extend the global window object
declare global {
  interface Window {
    google?: any;
    login_info?: LoginInfo;
  }

  interface LoginInfo {
    // typeof login credentials for compiler help

    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    picture: string;
    sub: string;
  }
  
}

export default function Home() {
  const buttonDivRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    // Poll for Google API to load (max ~2s)
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        setGoogleReady(true);
        clearInterval(interval);
      }
      if (tries > 20) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!googleReady || !buttonDivRef.current) return;

    window.google.accounts.id.initialize({
      client_id: "1036876865738-af2j3g381tqcgrhfg30ucivlv9g5kv79.apps.googleusercontent.com",
      callback: handleCredentialResponse,
      context: "signup",
      ux_mode: "popup",
      login_uri: "https://prodmugtive.mugboy.dev/api/signin",
      auto_prompt: false
    });

    window.google.accounts.id.renderButton(buttonDivRef.current, {
      theme: "filled_blue",
      size: "large",
      shape: "pill",
      text: "signin_with",
      logo_alignment: "left",
      type: "standard"
    });

    window.google.accounts.id.cancel();
    window.google.accounts.id.disableAutoSelect();
  }, [googleReady]);

  function handleCredentialResponse(response: any) {
    console.log("response.credential:", response.credential);
    window.login_info = parseJwt(response.credential);
    console.log("handleCredentialResponse called!", response);

    const changeMeNow = document.getElementById("change-me-now");
    if (changeMeNow) {
      changeMeNow.innerHTML = `
      <div align="center">
        <h1>An Apology</h1>
        <p>I'm sorry ${window.login_info?.given_name}, but you're too mischevous for my liking.<br>
        So I can't do anything about it. :(</p>

        <footer>404 too mischevous</footer>
      </div>
    `
    }

  }

  return (
    <div id="change-me-now">
      <Head>
        <title>Sign in to Prodmugtive</title>
      </Head>

      <div className="card center" style={{ width: "18rem" }}>
        <div className="card-body">
          <h3 className="card-title">ProdMUGtive <i className="bi bi-cup-hot"></i></h3>
          <p className="card-text">
            Hello, this is ProdMUGtive! Since I'm going back to work, I thought of some good tools for a project! Now, if you'll excuse me, you will probably need an account!
          </p>

          {/* Google Sign-In button container */}
          <div ref={buttonDivRef} id="googleSignInDiv" />
        </div>
      </div>
    </div>
  );
}
