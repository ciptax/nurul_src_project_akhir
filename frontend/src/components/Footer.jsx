import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Payment Methods Section */}
        <div className="flex flex-col space-y-4">
          <h5 className="text-2xl font-semibold">Metode Pembayaran</h5>
          <div className="grid grid-cols-3 gap-4">
            <img
              src="src/assets/items/dana.png"
              alt="Dana"
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
            />
            <img
              src="src/assets/items/pypal1.png"
              alt="Paypal"
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
            />
            <img
              src="src/assets/items/gopay.png"
              alt="Gopay"
              className="w-12 h-12 object-contain hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* Customer Service Section */}
        <div className="flex flex-col space-y-4">
          <h5 className="text-2xl font-semibold">Kritik Dan Saran</h5>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/contact"
                className="hover:text-yellow-400 transition-colors"
              >
                Berikan Ulasan
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-yellow-400 transition-colors"
              >
                Pertanyaan Umum
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-yellow-400 transition-colors"
              >
                Kebijakan Privasi
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="flex flex-col space-y-4">
          <h5 className="text-2xl font-semibold">Ikuti Kami</h5>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-800 text-3xl hover:text-blue-500 transition-transform transform hover:scale-125"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-gray-800 text-3xl hover:text-pink-500 transition-transform transform hover:scale-125"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="text-gray-800 text-3xl hover:text-blue-400 transition-transform transform hover:scale-125"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-800 text-3xl hover:text-red-600 transition-transform transform hover:scale-125"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="text-gray-800 text-3xl hover:text-red-700 transition-transform transform hover:scale-125"
            >
              <FaPinterest />
            </a>
          </div>
        </div>
        {/* Newsletter Section */}
        <div className="flex flex-col space-y-4">
          <h5 className="text-2xl font-semibold">Berlangganan</h5>
          <p className="text-sm leading-relaxed">
            Dapatkan informasi terbaru dan penawaran eksklusif langsung di email
            Anda!
          </p>
          <form className="flex flex-col space-y-2">
            <button className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all">
              Berlangganan
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-gray-800 text-center">
        <p>© 2024 Toko Nurul SRC. All Rights Reserved.</p>
        <p>
          <strong>Lokasi Toko:</strong>{" "}
          <a
            href="https://maps.app.goo.gl/aEDsW4RV3VkzrGJX6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:underline"
          >
            Klik di sini untuk melihat di Google Maps
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
