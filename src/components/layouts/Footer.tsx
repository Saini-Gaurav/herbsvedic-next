"use client";

import { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // NOTE: there is no notification-service in this backend yet - thenewsletter-subscribe endpoint this used to call doesn't exist.Faking success here would be worse than being honest about it -wire this up for real once that service exists.
    setTimeout(() => {
      alert("Newsletter signup isn't connected yet - coming soon!");
      setLoading(false);
    }, 500);
  }

  return (
    <footer className="bg-[#7A8F65] text-white pt-12 pb-6 px-4 sm:px-8 md:px-16 text-[15px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-10">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Stay in Touch</h4>
          <p className="text-base font-medium">SUBSCRIBE TO OUR NEWSLETTER</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-2.5 pr-14 rounded-lg border border-white bg-transparent placeholder-white text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-0.5 top-1/2 -translate-y-1/2 px-4 py-2 font-bold">
              {loading ? <ClipLoader color="white" size={16} /> : "→"}
            </button>
          </form>

          <div className="flex space-x-4 text-xl mt-3">
            <a href="https://www.instagram.com/herbsvedic_wellness/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61579217054707" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.linkedin.com/company/herbsvedicwellness/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">Quicklinks</h4>
          <ul className="space-y-1">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/consult">Consult</Link></li>
            <li><Link href="/about-us">About Us</Link></li>
            <li><Link href="/blog">Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">Our Products</h4>
          <ul className="space-y-1">
            <li>Super food</li>
            <li>Actocid Syrup</li>
            <li>Gynaure Syrup</li>
            <li>Livcare Syrup</li>
            <li>Gutcare</li>
          </ul>
        </div>

        <div>
          <img src="/herbslogo.png" alt="Company Logo" className="h-20 mb-3" />
          <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
          <div className="flex items-center gap-2 mb-1"><FaEnvelope /><span>support@herbsvedicwellness.com</span></div>
          <div className="flex items-center gap-2 mb-3"><FaPhoneAlt /><span>6901308316</span></div>
          <h4 className="font-semibold text-lg mb-1">Address</h4>
          <p>Shop no.1, Rudaram Tower<br />Station Road, Sikar (Raj)<br />332001, India</p>
        </div>
      </div>

      <div className="border-t border-white/30 mt-10 pt-4 text-center text-sm flex flex-wrap justify-center gap-5">
        <Link href="/return-refund-policy">Return &amp; Refund Policy</Link>
        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/shipping-policy">Shipping Policy</Link>
        <span className="w-full text-center mt-3 text-xs">© 2025 Herbsvedic Wellness</span>
      </div>
    </footer>
  );
}