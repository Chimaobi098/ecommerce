// import { UserProvider } from "@auth0/nextjs-auth0";
// import type { AppProps } from "next/app";
// import Footer from "../components/footer/footer";
// import { GlobalStyle } from "../GlobalStyles";
// import { ShoppingCartProvider } from "../context/shoppingCart";
// import Navbar from "../components/navbar/navbar";
// import { AnimatePresence } from "framer-motion";
// import Script from "next/script";
// import { SanityUIDProvider } from "../context/sanityUserId";
// import { useRouter } from "next/router";
// import "../global.css";
// import { ShippingDataProvider } from "../context/shippingContext";
// import { Router, Routes, Route } from "react-router";
// import CheckoutPage from "../components/Checkout/checkoutPage";
// import { userInfo } from "os";
// //import Productcheckout from "./productcheckout";
// import { useEffect } from "react";
// // import { useUser } from "@auth0/nextjs-auth0";
// //MIXPANEL
// import { initMixpanel, trackPageView } from "../lib/mixpanelClient";
// import mixpanel from "mixpanel-browser";

// function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();
//   // const { user, isLoading } = useUser();

//   useEffect(() => {
//     //referral stuff

//     const urlParams = new URLSearchParams(window.location.search);
//     const referredBy = urlParams.get("ref");
//     if (referredBy) {
//       localStorage.setItem("referredBy", referredBy);
//     }
//     console.log("ref code is, ", referredBy);

//     //MIXPANEL
//     initMixpanel(); // Initialize Mixpanel

//     const handleRouteChange = (url: any) => {
//       trackPageView(url); // Track pageviews
//     };

//     // Track page views on route change
//     router.events.on("routeChangeComplete", handleRouteChange);

//     return () => {
//       router.events.off("routeChangeComplete", handleRouteChange);
//     };
//   }, [router.events]);
//   //end

//   const hideFooterOnCheckout = router.pathname == "/Itemcheckout";
//   const hideOnAddressbook = router.pathname == "/Addressbook";

//   return (
//     <>
//       <Script id="google-tag-manager" strategy="afterInteractive">
//         {`
//             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','GTM-PCK8Q8M');
//             `}
//       </Script>
//       <UserProvider>
//         <SanityUIDProvider>
//           <ShippingDataProvider>
//             <ShoppingCartProvider>
//               <main
//                 style={{
//                   paddingBottom: "15vmin",
//                   height: "100%",
//                   overflow: "hidden",
//                   position: "relative",
//                 }}
//               >
//                 <AnimatePresence>
//                   <Component {...pageProps} key={router.pathname} />
//                 </AnimatePresence>
//               </main>
//               {!hideFooterOnCheckout && <Footer />}{" "}
//               {/* COnditionally render the footer */}
//               {/* {!hideOnAddressbook && <CheckoutPage  />} */}
//               <GlobalStyle />
//             </ShoppingCartProvider>
//           </ShippingDataProvider>
//         </SanityUIDProvider>
//       </UserProvider>
//     </>
//   );
// }

// export default MyApp;

// pages/_app.tsx
import { UserProvider, useUser } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Footer from "../components/footer/footer";
import { GlobalStyle } from "../GlobalStyles";
import { ShoppingCartProvider } from "../context/shoppingCart";
import Navbar from "../components/navbar/navbar";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { SanityUIDProvider } from "../context/sanityUserId";
import { useRouter } from "next/router";
import "../global.css";
import { ShippingDataProvider } from "../context/shippingContext";
import { useEffect } from "react";
import { initMixpanel, trackPageView } from "../lib/mixpanelClient";
import mixpanel from "mixpanel-browser";

function AuthTrackingWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user?.email) {
      if (typeof user.email === "string") {
        mixpanel.identify(user.email);
        mixpanel.track("User Logged In", {
          email: user.email,
        });
        mixpanel.people.set({
          $email: user.email,
          $name: user.name || "",
          $created: new Date(user.updated_at || Date.now()).toISOString(), // make sure it's a proper ISO string
        });
      } else {
        console.warn("Mixpanel: invalid user.email", user.email);
      }

      // mixpanel.identify(user.email);

      // mixpanel.track("User Logged In", {
      //   email: user.email,
      // });

      // mixpanel.people.set({
      //   $email: user.email,
      //   $name: user.name || "",
      //   $created: new Date(user.updated_at || Date.now()).toISOString(), // make sure it's a proper ISO string
      // });
    }
  }, [user, isLoading]);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const hideFooterOnCheckout = router.pathname === "/Itemcheckout";
  const hideOnAddressbook = router.pathname === "/Addressbook";

  useEffect(() => {
    // initMixpanel();

    const urlParams = new URLSearchParams(window.location.search);
    const referredBy = urlParams.get("ref");
    if (referredBy) {
      localStorage.setItem("referredBy", referredBy);
    }

    const handleRouteChange = (url: string) => {
      // trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PCK8Q8M');
        `}
      </Script>

      <UserProvider>
        <SanityUIDProvider>
          <ShippingDataProvider>
            <ShoppingCartProvider>
              <AuthTrackingWrapper>
                <main
                  style={{
                    // paddingBottom: "15vmin",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <AnimatePresence>
                    <Component {...pageProps} key={router.pathname} />
                  </AnimatePresence>
                </main>
                {!hideFooterOnCheckout && <Footer />}
                <GlobalStyle />
              </AuthTrackingWrapper>
            </ShoppingCartProvider>
          </ShippingDataProvider>
        </SanityUIDProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
