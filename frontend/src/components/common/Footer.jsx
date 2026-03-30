import { Link } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { IoMdShare } from "react-icons/io";
import { CiGlobe } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="mt-auto bg-[#081633] text-slate-300">
      <div className="w-full px-4 py-12 mx-auto max-w-7xl md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A7CFF] text-white">
                <img src="/public/logo-no-bg.png" alt="" />
              </span>
              <span className="text-2xl font-bold text-white">MediQueue</span>
            </div>

            <p className="mt-4 text-left max-w-[280px] text-sm leading-7 text-slate-400">
              Modernizing healthcare access through smart, efficient, and
              patient-centered digital queuing solutions.
            </p>

            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 transition rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
                aria-label="share"
              >
                <IoMdShare />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 transition rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
                aria-label="globe"
              >
                <CiGlobe />
              </button>
            </div>
          </div>

          <div className="">
            <h4 className="text-xl font-semibold text-white text-start">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 mt-4 text-sm gap-y-3">
              <div className="flex flex-col items-start gap-2">
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
                <Link to="/about" className="transition hover:text-white">
                  About Us
                </Link>
                <Link to="/contact" className="transition hover:text-white">
                  Contact
                </Link>{" "}
                <Link
                  to="/terms"
                  className="col-span-2 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </div>
              <div className="flex flex-col items-start gap-2">
                {" "}
                <Link to="/pricing" className="transition hover:text-white">
                  Pricing
                </Link>
                <Link to="/faq" className="transition hover:text-white">
                  FAQ
                </Link>
                <Link to="/privacy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white text-start">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FiMail className="mt-0.5 text-[#00B5FF]" />
                <span>hello@mediqueue.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="mt-0.5 text-[#00B5FF]" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 text-[#00B5FF]" />
                <span className="flex flex-col items-start">
                  123 Health Ave, Medical District,
                  <span>Innovation City, IN 10001</span>{" "}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 mt-10 text-xs text-center border-t border-slate-800 text-slate-500">
          <p>© 2023 MediQueue Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
