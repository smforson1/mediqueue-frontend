import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { useState } from "react";
import Footer from "../components/common/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
    <main className="flex-grow w-full bg-[#f7f9ff]">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl md:px-8 md:py-28">
        <div className="text-center">
          <span className="px-4 py-2 mb-6 text-xs font-semibold rounded-full w-fit bg-blue-50 text-primary inline-block">
            Get in Touch
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] text-slate-900 md:text-6xl mt-4">
            Contact
            <br />
            <span className="text-primary">MediQueue</span>
          </h1>
          <p className="mt-6 max-w-[680px] mx-auto text-lg leading-8 text-slate-600 md:text-xl">
            Have questions or need support? We'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary flex-shrink-0">
                    <FiMail className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-600 mt-1">support@mediqueue.com</p>
                    <p className="text-sm text-slate-500">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary flex-shrink-0">
                    <FiPhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p className="text-slate-600 mt-1">+1 (555) 123-4567</p>
                    <p className="text-sm text-slate-500">
                      Monday - Friday, 9AM - 6PM
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary flex-shrink-0">
                    <FiMapPin className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p className="text-slate-600 mt-1">
                      123 Healthcare Avenue
                      <br />
                      Medical City, MC 12345
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary flex-shrink-0">
                    <FiClock className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Business Hours
                    </h3>
                    <p className="text-slate-600 mt-1">
                      Monday - Friday: 9AM - 6PM
                      <br />
                      Saturday: 10AM - 4PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Send Message
                </button>

                {submitted && (
                  <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    ✓ Thank you! We've received your message and will get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#f7f9ff] md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center md:text-5xl">
            Visit Us
          </h2>
          <div className="rounded-2xl overflow-hidden border border-slate-200 h-96 bg-slate-200">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              title="MediQueue Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
              style={{ border: 0, filter: "grayscale(100%)" }}
            />
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </div>
  );
}

export default Contact;
