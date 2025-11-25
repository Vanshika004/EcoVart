// import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import AnimatedCounter from "../components/AnimatedCounter";
import { products } from "../data/products";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* <NavBar /> */}

      {/* Hero */}
      <section className="hero">
        <div
          className="hero-image"
          style={{ backgroundImage: "url('/images/bottle.svg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
          <div className="container relative z-10 flex flex-col justify-center h-full py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Think Sustainable · Shop Sustainable
            </h1>
            <p className="mt-4 text-lg text-white/90 max-w-2xl">
              Curated sustainable and upcycled goods for a conscious lifestyle.
            </p>
            <div className="mt-6">
              <a
                href="/shop"
                className="bg-primary text-white px-6 py-3 rounded-md shadow-lg"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div className="flex gap-4 overflow-x-auto py-4">
          {[
            { label: "Upcycled", icon: "♻️" },
            { label: "Organic", icon: "🌾" },
            { label: "Handcrafted", icon: "👐" },
            { label: "Zero-Waste", icon: "🚫🗑️" },
            { label: "Vegan", icon: "🥦" },
          ].map((c) => (
            <div key={c.label} className="category-pill mr-3">
              <div className="text-xl">{c.icon}</div>
              <div>
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-gray-600">Conscious choice</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">
              Most Loved Earthy Collection
            </h2>
            <p className="text-sm text-gray-600">
              Handpicked favorites from sustainable brands.
            </p>
          </div>
          <div className="text-sm text-gray-500">See all</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Impact stats */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              <AnimatedCounter value={10000} />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Carbon Neutral Products
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              <AnimatedCounter value={100} />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Plastic-Free Packaging Brands
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              <AnimatedCounter value={250} />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Verified Sustainable Brands
            </div>
          </div>
        </div>
      </section>

      {/* Subscription promo */}
      <section className="container">
        <div className="bg-primary text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-lg">
              Get 10% off on your next purchase
            </div>
            <div className="text-sm text-white/90">
              Subscribe for updates and exclusive offers.
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              aria-label="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-md text-gray-800"
            />
            <button className="bg-white text-primary px-4 py-2 rounded-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer moved to global component (components/Footer.jsx) */}
    </div>
  );
}
