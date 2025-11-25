import "../styles/globals.css";
import { useEffect, useState, createContext } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import CategoryMenu from "../components/CategoryMenu";
import Footer from "../components/Footer";
import { saveCartForUser, subscribeToCart } from "../lib/cart";

export const AuthContext = createContext({ user: null });

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubCart = null;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // migrate localStorage cart (if exists)
        try {
          const local = localStorage.getItem("ecocart_cart");
          if (local) {
            const parsed = JSON.parse(local);
            if (parsed?.items?.length) {
              await saveCartForUser(u.uid, parsed);
              localStorage.removeItem("ecocart_cart");
            }
          }
        } catch (e) {
          console.error("cart migrate", e);
        }

        // subscribe to Firestore cart
        unsubCart = subscribeToCart(u.uid, (data) => {
          setCart(data || { items: [] });
        });
      } else {
        // if logged out, stop subscribe and keep local cart
        if (unsubCart) {
          unsubCart();
          unsubCart = null;
        }
        const local = localStorage.getItem("ecocart_cart");
        setCart(local ? JSON.parse(local) : { items: [] });
      }
    });
    return () => {
      unsub();
      if (unsubCart) unsubCart();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, cart, setCart, loading }}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <CategoryMenu />
        <main className="container py-8 flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}
