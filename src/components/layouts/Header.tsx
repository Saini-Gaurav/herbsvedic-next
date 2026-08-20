"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaHandPointRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL; 
const PRODUCT_API = process.env.NEXT_PUBLIC_API_URL;

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ANNOUNCEMENTS = [
  "Free Shipping On Orders Above ₹999",
  "Rooted In Tradition, Made For Today",
  "Consult Our Ayurvedic Experts",
  "New: Kumkumadi Face Oil",
];

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const { cart, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      )
        setIsSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `${PRODUCT_API}/products?search=${encodeURIComponent(searchQuery)}&limit=5`,
        );
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  }

  const isActive = (href: string) => pathname === href;
  const navLinkClass = (href: string) =>
    `pb-1 border-b-2 transition-colors ${isActive(href) ? "border-turmeric text-bark" : "border-transparent text-bark/70 hover:text-bark"}`;

  return (
    <>
      <div className="w-full bg-ink h-8 flex items-center text-sand text-xs font-body tracking-wide fixed top-0 left-0 z-9999 overflow-hidden whitespace-nowrap">
        <div className="inline-block whitespace-nowrap animate-marquee">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map(
            (text, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mr-8 align-middle uppercase"
              >
                <FaHandPointRight className="text-turmeric h-3 w-3 shrink-0" />
                <span>{text}</span>
              </span>
            ),
          )}
        </div>
      </div>

      <header className="w-full fixed top-8 left-0 bg-sand/95 backdrop-blur-sm border-b border-bark/10 z-50">
        <div className="h-16 w-full flex items-center justify-between px-4 py-3 md:px-10">
          <Link
            href="/"
            className="font-display text-2xl text-canopy tracking-tight"
          >
            Herbsvedic
          </Link>

          <nav className="hidden md:flex flex-1 justify-center items-center space-x-8 text-sm font-body">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/shop" className={navLinkClass("/shop")}>
              Shop
            </Link>
            <Link href="/consult" className={navLinkClass("/consult")}>
              Consult
            </Link>
            <Link href="/about-us" className={navLinkClass("/about-us")}>
              About Us
            </Link>
            <Link href="/blog" className={navLinkClass("/blog")}>
              Blogs
            </Link>
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="text-bark/70 hover:text-bark transition relative z-10"
              >
                <FiSearch size={20} />
              </button>

              {/* The pill - anchored at the icon's own vertical center, grows
      LEFTWARD from the icon since it's right-0 and its width animates
      from 0 up to a cap. Staying in the same row as the nav links on
      purpose, per your call - w-56 keeps it narrow enough that it
      shouldn't reach "Contact Us" on most screen widths, but worth
      checking your narrowest md: breakpoint and shrinking this further
      if it still touches. */}
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-sand shadow-lg border border-bark/10 rounded-full flex items-center overflow-hidden transition-all duration-300 ease-out ${
                  isSearchOpen
                    ? "w-56 px-4 py-2 opacity-100"
                    : "w-0 px-0 py-2 opacity-0 pointer-events-none"
                }`}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center w-full"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 text-sm font-body focus:outline-none bg-transparent placeholder:text-bark/40 min-w-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Close search"
                    className="text-bark/50 shrink-0 ml-1"
                  >
                    <FiX size={16} />
                  </button>
                </form>
              </div>

              {/* Results dropdown - appears BELOW the pill only (top-full relative
      to this same small wrapper), not below the whole header. Anchored
      right-0 so it lines up under the pill's right edge. */}
              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-sand shadow-xl border border-bark/10 rounded-xl max-h-80 overflow-y-auto z-999">
                  {isSearchLoading ? (
                    <div className="p-4 text-center text-bark/50 font-body text-sm">
                      Searching...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-bark/50 font-body text-sm">
                      No products found for &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center p-3 hover:bg-canopy/5 border-b border-bark/5"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg mr-3 object-cover"
                          />
                          <div>
                            <div className="font-body font-medium text-sm text-bark line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-sm text-canopy font-body">
                              ₹{product.price}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        className="block p-3 text-center text-sm font-body tracking-wide uppercase text-canopy hover:bg-canopy/5"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        View all results
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={openCart}
              className="relative text-bark/70 hover:text-bark transition"
              aria-label="Open cart"
            >
              <FiShoppingCart size={20} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-turmeric text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {isLoading ? (
              // Don't show Login/Logout until we know the session state.
              <div className="w-20 h-9 rounded-full bg-bark/10 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => logout()}
                className="border border-canopy text-canopy px-5 py-2 rounded-full text-sm font-body tracking-wide uppercase hover:bg-canopy hover:text-sand transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="border border-canopy text-canopy px-5 py-2 rounded-full text-sm font-body tracking-wide uppercase hover:bg-canopy hover:text-sand transition"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={openCart}
              className="relative text-bark"
              aria-label="Open cart"
            >
              <FiShoppingCart size={22} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-turmeric text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-bark"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div
              ref={menuRef}
              className={`absolute top-full right-0 mt-0 w-64 bg-sand shadow-xl rounded-bl-2xl z-50 p-5 border border-bark/10 transition-all duration-300 origin-top-right ${
                isMenuOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ul className="flex flex-col space-y-4 font-body text-sm">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consult"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    Consult
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-bark"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  {isLoading ? (
                    <div className="w-16 h-7 rounded-full bg-bark/10 animate-pulse" />
                  ) : user ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="border border-canopy text-canopy px-4 py-1.5 rounded-full text-xs uppercase tracking-wide"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="border border-canopy text-canopy px-4 py-1.5 rounded-full text-xs uppercase tracking-wide inline-block"
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
          display: inline-block;
        }
      `}</style>
    </>
  );
}
