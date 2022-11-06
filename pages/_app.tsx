import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Footer from "../components/footer/footer";
import { GlobalStyle } from "../GlobalStyles";
import { ShoppingCartProvider } from "../context/shoppingCart.js";
import Navbar from "../components/navbar/navbar";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <ShoppingCartProvider>
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
          <GlobalStyle />
        </ShoppingCartProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
