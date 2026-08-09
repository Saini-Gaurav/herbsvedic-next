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
  "Get 15% Off Upto Rs.1500",
  "Free Goodies on First order after Consultation",
  "Discounts on bulk Ordering",
  "Not sure where to start? Take a Quiz now",
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

  // Close search/menu on an outside click - same logic as before, just typed properly (event.target as Node) since TypeScript needs to know what kind of thing `.contains()` is being asked to check.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live search, now pointed at product-service directly - and using the REAL query params /products already supports (?search=...) instead of fetching every product and filtering in the browser, which is what the old code did.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearchLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`${PRODUCT_API}/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
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

  function isActive(href: string) {
    return pathname === href;
  }

  const navLinkClass = (href: string) =>
    `${isActive(href) ? "border-b-2 border-[#6E7F51]" : ""}`;

  return (
    <>
      <div className="w-full bg-[#6E7F51] py-[2px] text-white text-sm font-medium fixed top-0 left-0 z-[9999] overflow-hidden whitespace-nowrap">
        <div className="inline-block whitespace-nowrap animate-marquee">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-2 mr-6 align-middle">
              <FaHandPointRight className="text-white h-[15px] w-[15px] flex-shrink-0" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      <header className="w-full shadow-md fixed top-[28px] left-0 bg-white z-50">
        <div className="w-full flex items-center justify-between px-4 py-2 md:px-10">
          <Link href="/">
            <img src="/mainlogo.png" alt="Herbsvedic Logo" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 text-md font-poppins">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <Link href="/shop" className={navLinkClass("/shop")}>Shop</Link>
            <Link href="/consult" className={navLinkClass("/consult")}>Consult</Link>
            <Link href="/about-us" className={navLinkClass("/about-us")}>About Us</Link>
            <Link href="/blog" className={navLinkClass("/blog")}>Blogs</Link>
            <Link href="/contact" className={navLinkClass("/contact")}>Contact Us</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <button onClick={() => setIsSearchOpen(true)} aria-label="Open search">
                <FiSearch size={22} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 -top-1 z-[1000] bg-white shadow-lg border rounded-full w-64 px-3 py-1.5 flex items-center">
                  <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search products..."
                      className="flex-1 text-sm focus:outline-none bg-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
                      <FiX size={18} />
                    </button>
                  </form>
                </div>
              )}

              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute right-0 top-[48px] w-72 bg-white shadow-lg border rounded-lg max-h-80 overflow-y-auto z-[999]">
                  {isSearchLoading ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-gray-500">No products found for &quot;{searchQuery}&quot;</div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="flex items-center p-3 hover:bg-gray-50 border-b"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded mr-3 object-cover" />
                          <div>
                            <div className="font-medium text-sm line-clamp-1">{product.name}</div>
                            <div className="text-sm text-gray-600">₹{product.price}</div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        className="block p-3 text-center text-sm font-medium text-[#6E7F51] hover:bg-gray-50"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        View all results
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button onClick={openCart} className="relative cursor-pointer">
              <FiShoppingCart size={22} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </button>

            {user ? (
              <button onClick={() => logout()} className="border border-black px-4 py-2 rounded-sm text-sm font-semibold hover:bg-black hover:text-white transition">
                Logout
              </button>
            ) : (
              <Link href="/login" className="border border-black px-4 py-2 rounded-sm text-sm font-semibold hover:bg-black hover:text-white transition">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={openCart} className="relative">
              <FiShoppingCart size={24} />
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {isMenuOpen && (
              <div ref={menuRef} className="absolute top-full right-0 mt-4 w-64 bg-white shadow-lg rounded-b-lg z-50 p-4">
                <ul className="flex flex-col space-y-4">
                  <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                  <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>
                  <li><Link href="/consult" onClick={() => setIsMenuOpen(false)}>Consult</Link></li>
                  <li><Link href="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                  <li><Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                  <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
                  <li>
                    {user ? (
                      <button onClick={() => { logout(); setIsMenuOpen(false); }} className="border border-black px-3 py-2 rounded text-sm font-semibold">
                        Logout
                      </button>
                    ) : (
                      <Link href="/login" onClick={() => setIsMenuOpen(false)} className="border border-black px-3 py-2 rounded text-sm font-semibold inline-block">
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; display: inline-block; }
      `}</style>
    </>
  );
}