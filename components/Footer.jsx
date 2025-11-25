// Professional footer for EcoVart
export default function Footer() {
  return (
    <footer className="bg-[#12372A] text-white w-full m-0">
      <div className="w-full text-center py-3 text-sm font-medium transition-all">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer hover:underline"
          aria-label="Back to top"
        >
          Back to top
        </button>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        <div>
          <h4 className="font-bold mb-4 text-lg">Get to Know Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/about"
                className="hover:text-orange-300 transition-colors"
              >
                About EcoVart
              </a>
            </li>
            <li>
              <a
                href="/careers"
                className="hover:text-orange-300 transition-colors"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="/press"
                className="hover:text-orange-300 transition-colors"
              >
                Press Releases
              </a>
            </li>
            <li>
              <a
                href="/science"
                className="hover:text-orange-300 transition-colors"
              >
                Eco Science
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg">Connect with Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-300 transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-300 transition-colors"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-300 transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg">Make Money with Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/sell"
                className="hover:text-orange-300 transition-colors"
              >
                Sell on EcoVart
              </a>
            </li>
            <li>
              <a
                href="/sell/accelerator"
                className="hover:text-orange-300 transition-colors"
              >
                Eco Accelerator
              </a>
            </li>
            <li>
              <a
                href="/sell/brand"
                className="hover:text-orange-300 transition-colors"
              >
                Build Your Brand
              </a>
            </li>
            <li>
              <a
                href="/sell/global"
                className="hover:text-orange-300 transition-colors"
              >
                Global Selling
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-lg">Let Us Help You</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/profile"
                className="hover:text-orange-300 transition-colors"
              >
                Your Account
              </a>
            </li>
            <li>
              <a
                href="/help/returns"
                className="hover:text-orange-300 transition-colors"
              >
                Returns Centre
              </a>
            </li>
            <li>
              <a
                href="/help"
                className="hover:text-orange-300 transition-colors"
              >
                Help
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 py-6">
        <span className="font-bold text-lg tracking-tight">
          eco<span className="text-orange-400">Vart</span>
        </span>
        <div className="flex gap-2">
          <button className="bg-[#0f2b1f] px-3 py-1 rounded text-white text-sm flex items-center gap-1">
            <span>🌐</span> English
          </button>
          <button className="bg-[#0f2b1f] px-3 py-1 rounded text-white text-sm flex items-center gap-1">
            <span>🇮🇳</span> India
          </button>
        </div>
      </div>
    </footer>
  );
}
