import { FiAward, FiUsers, FiTrendingUp, FiTarget } from "react-icons/fi";
import Footer from "../components/common/Footer";

function About() {
  return (
    <div className="flex flex-col min-h-screen">
    <main className="flex-grow w-full bg-[#f7f9ff]">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl md:px-8 md:py-28">
        <div className="text-center">
          <span className="px-4 py-2 mb-6 text-xs font-semibold rounded-full w-fit bg-blue-50 text-primary inline-block">
            About MediQueue
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.02em] text-slate-900 md:text-6xl mt-4">
            Revolutionizing Healthcare
            <br />
            <span className="text-primary">Appointment Management</span>
          </h1>
          <p className="mt-6 max-w-[680px] mx-auto text-lg leading-8 text-slate-600 md:text-xl">
            MediQueue is transforming the way patients and healthcare providers
            interact. Our mission is to eliminate long wait times and make
            healthcare more accessible and convenient for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Mission */}
            <div>
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mb-5">
                <FiTarget className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Mission
              </h2>
              <p className="text-base leading-8 text-slate-600">
                To provide an innovative, user-friendly digital solution that
                streamlines healthcare appointment bookings, reduces patient
                waiting times, and improves the overall healthcare experience
                for both patients and medical professionals.
              </p>
            </div>

            {/* Vision */}
            <div>
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mb-5">
                <FiAward className="text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Vision
              </h2>
              <p className="text-base leading-8 text-slate-600">
                To become the leading digital healthcare platform in the region,
                making quality healthcare accessible to everyone through
                intelligent queuing and appointment management technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#f7f9ff] md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-base text-slate-600 md:text-lg max-w-[640px] mx-auto">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <article className="text-center bg-white p-6 rounded-xl">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mx-auto mb-4">
                <FiUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Patient-Centric
              </h3>
              <p className="text-slate-600">
                We prioritize the patient experience in every decision we make.
              </p>
            </article>

            <article className="text-center bg-white p-6 rounded-xl">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mx-auto mb-4">
                <FiTrendingUp className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Innovation</h3>
              <p className="text-slate-600">
                We continuously innovate to provide cutting-edge solutions.
              </p>
            </article>

            <article className="text-center bg-white p-6 rounded-xl">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mx-auto mb-4">
                <FiAward className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Excellence</h3>
              <p className="text-slate-600">
                We strive for excellence in every aspect of our service.
              </p>
            </article>

            <article className="text-center bg-white p-6 rounded-xl">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-primary mx-auto mb-4">
                <FiTarget className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Integrity</h3>
              <p className="text-slate-600">
                We operate with transparency and uphold the highest ethical standards.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white md:py-24">
        <div className="w-full px-4 mx-auto max-w-7xl md:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">10K+</p>
              <p className="mt-2 text-base text-slate-600 md:text-lg">
                Active Patients
              </p>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">500+</p>
              <p className="mt-2 text-base text-slate-600 md:text-lg">
                Healthcare Partners
              </p>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">50K+</p>
              <p className="mt-2 text-base text-slate-600 md:text-lg">
                Appointments Booked
              </p>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">95%</p>
              <p className="mt-2 text-base text-slate-600 md:text-lg">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </div>
  );
}

export default About;
