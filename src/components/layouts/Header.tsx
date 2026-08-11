"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaHandPointRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const PRODUCT_API = process.env.NEXT_PUBLIC_PRODUCT_API_URL;

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
  const { user, logout } = useAuth();
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
                className="text-bark/70 hover:text-bark transition"
              >
                <FiSearch size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 -top-1 z-1000 bg-sand shadow-lg border border-bark/10 rounded-full w-64 px-4 py-2 flex items-center">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center w-full"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search products..."
                      className="flex-1 text-sm font-body focus:outline-none bg-transparent placeholder:text-bark/40"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      aria-label="Close search"
                      className="text-bark/50"
                    >
                      <FiX size={16} />
                    </button>
                  </form>
                </div>
              )}

              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute right-0 top-13 w-72 bg-sand shadow-xl border border-bark/10 rounded-xl max-h-80 overflow-y-auto z-999">
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

            {user ? (
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
                  {user ? (
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
