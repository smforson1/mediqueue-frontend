import {
  FiCalendar,
  FiCheckCircle,
  FiSearch,
  FiShield,
  FiClock,
  FiBell,
  FiBarChart2,
  FiUsers,
} from "react-icons/fi";
import Button from "../components/common/Button";
import Footer from "../components/common/Footer";

function Service() {
  return (
    <div className="flex flex-col min-h-screen">
    <main className="flex-grow w-full bg-[#f7f9ff]">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl md:px-8 md:py-28">
        <div className="text-center">
          <span className="px-4 py-2 mb-6 text-xs font-semibold rounded-full w-fit bg-blue-50 text-primary inline-block">
            Our Services
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] text-slate-900 md:text-6xl mt-4">
            Comprehensive Healthcare
            <br />
            <span className="text-primary">Appointment Solutions</span>
          </h1>
          <p className="mt-6 max-w-[680px] mx-auto text-lg leading-8 text-slate-600 md:text-xl">
            From appointment booking to queue management, we provide everything
            you need for a seamless healthcare experience.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-white md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Service 1 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500 text-white mb-5">
                <FiCalendar className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Smart Appointment Booking
              </h3>
              <p className="text-slate-600 leading-7">
                Easily search and book appointments with your preferred doctors
                and clinics. View real-time availability and select the most
                convenient time slot for you.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Real-time availability
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Instant confirmation
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Flexible rescheduling
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500 text-white mb-5">
                <FiClock className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Live Queue Management
              </h3>
              <p className="text-slate-600 leading-7">
                Track your position in the queue in real-time. Receive updates
                on your wait time and get notified when it's your turn to see
                the doctor.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Real-time queue tracking
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Estimated wait time
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Instant notifications
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500 text-white mb-5">
                <FiBell className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Smart Notifications
              </h3>
              <p className="text-slate-600 leading-7">
                Receive timely reminders and updates about your appointments.
                Never miss an appointment again with our intelligent notification
                system.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Appointment reminders
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  SMS & Email alerts
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Customizable preferences
                </li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500 text-white mb-5">
                <FiShield className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-slate-600 leading-7">
                Your health information is protected with enterprise-grade
                security. We comply with all healthcare data protection
                regulations and standards.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  End-to-end encryption
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  HIPAA compliant
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Data privacy guaranteed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-[#f7f9ff] md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">
              Additional Features
            </h2>
            <p className="mt-4 text-base text-slate-600 md:text-lg max-w-[640px] mx-auto">
              Designed for both patients and healthcare providers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <article className="p-6 bg-white rounded-xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary mb-4">
                <FiSearch className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Advanced Search
              </h3>
              <p className="text-slate-600">
                Easily find healthcare providers near you with advanced filtering
                options.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="p-6 bg-white rounded-xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary mb-4">
                <FiBarChart2 className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Analytics & Reports
              </h3>
              <p className="text-slate-600">
                For providers: Comprehensive insights into your patient flow and
                appointment trends.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="p-6 bg-white rounded-xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-primary mb-4">
                <FiUsers className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Provider Management
              </h3>
              <p className="text-slate-600">
                Complete toolkit for managing schedules, doctors, and patient
                interactions.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-base text-blue-100 md:text-lg max-w-[640px] mx-auto">
            Join thousands of patients already using MediQueue
          </p>
          <div className="flex flex-col gap-4 mt-8 items-center justify-center sm:flex-row">
            <Button
              to="/book"
              title="Book an Appointment"
              className="px-8 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-blue-50 transition-colors"
            />
            <Button
              to="/contact"
              title="Contact Us"
              className="px-8 py-3 rounded-lg bg-transparent text-white font-semibold border border-white hover:bg-blue-600 transition-colors"
            />
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </div>
  );
}

export default Service;
