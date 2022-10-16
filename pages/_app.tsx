import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Footer from "../components/footer/footer";
import { GlobalStyle } from "../GlobalStyles";
import { ShoppingCartProvider } from "../context/shoppingCart.js";
import Navbar from "../components/navbar/navbar";
import { AnimatePresence } from "framer-motion";
// import { Route, Switch, BrowserRouter } from "react-router-dom";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ShoppingCartProvider>
        <UserProvider>
          <main
            style={{
              paddingBottom: "15vmin ",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <AnimatePresence>
              <Component {...pageProps} />
            </AnimatePresence>
          </main>
          <Footer />
        </UserProvider>
        <GlobalStyle />
      </ShoppingCartProvider>
    </>
  );
}

export default MyApp;
