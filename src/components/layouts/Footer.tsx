"use client";

import { useState } from "react";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import RootDivider from "@/components/ui/RootDivider";

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
    setTimeout(() => {
      alert("Newsletter signup isn't connected yet - coming soon!");
      setLoading(false);
    }, 500);
  }

  return (
    <footer className="bg-ink text-sand pt-14 pb-6 px-4 sm:px-8 md:px-16 text-[15px] font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-10">
        <div className="space-y-4">
          <h4 className="font-display text-xl text-turmeric">Stay in Touch</h4>
          <p className="text-sm tracking-wide uppercase text-sand/70">Subscribe to our newsletter</p>
          <form onSubmit={handleSubmit} className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-2.5 pr-14 rounded-full border border-sand/30 bg-transparent placeholder-sand/40 text-sm focus:outline-none focus:border-turmeric transition"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-turmeric text-ink font-bold">
              {loading ? <ClipLoader color="#1F2A1C" size={14} /> : "→"}
            </button>
          </form>

          <div className="flex space-x-4 text-lg mt-3 text-sand/70">
            <a href="https://www.instagram.com/herbsvedic_wellness/" target="_blank" rel="noopener noreferrer" className="hover:text-turmeric transition"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61579217054707" target="_blank" rel="noopener noreferrer" className="hover:text-turmeric transition"><FaFacebookF /></a>
            <a href="https://www.linkedin.com/company/herbsvedicwellness/" target="_blank" rel="noopener noreferrer" className="hover:text-turmeric transition"><FaLinkedinIn /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl text-turmeric mb-3">Quicklinks</h4>
          <ul className="space-y-2 text-sand/80">
            <li><Link href="/" className="hover:text-sand transition">Home</Link></li>
            <li><Link href="/shop" className="hover:text-sand transition">Shop</Link></li>
            <li><Link href="/consult" className="hover:text-sand transition">Consult</Link></li>
            <li><Link href="/about-us" className="hover:text-sand transition">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-sand transition">Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-turmeric mb-3">Our Products</h4>
          <ul className="space-y-2 text-sand/80">
            <li>Super food</li>
            <li>Actocid Syrup</li>
            <li>Gynaure Syrup</li>
            <li>Livcare Syrup</li>
            <li>Gutcare</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl text-turmeric mb-3">Contact Us</h4>
          <div className="flex items-center gap-2 mb-2 text-sand/80"><FaEnvelope className="text-turmeric" /><span>support@herbsvedicwellness.com</span></div>
          <div className="flex items-center gap-2 mb-4 text-sand/80"><FaPhoneAlt className="text-turmeric" /><span>6901308316</span></div>
          <h4 className="font-display text-lg text-turmeric mb-1">Address</h4>
          <p className="text-sand/80">Shop no.1, Rudaram Tower<br />Station Road, Sikar (Raj)<br />332001, India</p>
        </div>
      </div>

      <RootDivider className="mt-10" />

      <div className="pt-2 text-center text-xs flex flex-wrap justify-center gap-5 text-sand/60">
        <Link href="/return-refund-policy" className="hover:text-sand transition">Return &amp; Refund Policy</Link>
        <Link href="/terms-and-conditions" className="hover:text-sand transition">Terms &amp; Conditions</Link>
        <Link href="/privacy-policy" className="hover:text-sand transition">Privacy Policy</Link>
        <Link href="/shipping-policy" className="hover:text-sand transition">Shipping Policy</Link>
        <span className="w-full text-center mt-2">© 2025 Herbsvedic Wellness</span>
      </div>
    </footer>
  );
}