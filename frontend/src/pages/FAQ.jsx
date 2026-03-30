import { useMemo, useState } from "react";
import Footer from "../components/common/Footer";

const FAQ_DATA = [
  {
    id: "general",
    title: "General Information",
    description:
      "Essential information for patients, caregivers, and visitors using the healthcare platform.",
    faqs: [
      {
        question: "What services are available on this platform?",
        answer:
          "This platform provides access to healthcare information, appointment support, patient guidance, service overviews, billing support, and general hospital or clinic communication resources."
      },
      {
        question: "Who can use this platform?",
        answer:
          "The platform is intended for patients, caregivers, visitors, and authorized healthcare staff who need fast access to accurate healthcare service information and digital support tools."
      },
      {
        question: "Is the FAQ page a substitute for professional medical advice?",
        answer:
          "No. This FAQ page provides general guidance only. It does not replace consultation, diagnosis, or treatment from a qualified healthcare professional."
      },
      {
        question: "How do I contact the hospital or clinic directly?",
        answer:
          "You can contact the hospital or clinic through the support channels provided on the platform, including phone numbers, email addresses, contact forms, and facility location details where available."
      }
    ]
  },
  {
    id: "appointments",
    title: "Appointments & Scheduling",
    description:
      "Common questions related to booking, rescheduling, managing, and tracking appointments.",
    faqs: [
      {
        question: "How do I book an appointment?",
        answer:
          "Appointments can be booked by selecting the relevant department, preferred provider, date, and available time slot, then confirming the request through the appointment workflow."
      },
      {
        question: "Can I reschedule my appointment?",
        answer:
          "Yes. Patients can reschedule appointments depending on provider availability. The new appointment time must be confirmed before it becomes active."
      },
      {
        question: "How do I cancel an appointment?",
        answer:
          "Appointments can usually be cancelled from the patient dashboard or appointment history section. You may also contact support if cancellation assistance is needed."
      },
      {
        question: "Will I receive an appointment reminder?",
        answer:
          "Yes. Reminders may be sent by email, SMS, or in-app notification depending on the platform configuration and the patient contact details on file."
      }
    ]
  },
  {
    id: "records",
    title: "Patient Records & Privacy",
    description:
      "Guidance related to privacy, confidentiality, patient records, and access management.",
    faqs: [
      {
        question: "Is my personal health information secure?",
        answer:
          "Yes. Patient information should be protected using secure access controls, role-based permissions, authentication safeguards, and privacy-focused data handling practices."
      },
      {
        question: "Who can access my records?",
        answer:
          "Only authorized healthcare personnel and approved administrative staff with the required permissions should be able to access patient records when necessary for care or operations."
      },
      {
        question: "Can I request an update to my personal details?",
        answer:
          "Yes. Patients can request updates to non-clinical personal details such as phone number, email address, address, and emergency contact information."
      },
      {
        question: "Can I view my past visit or treatment history?",
        answer:
          "Where enabled, patients may access appointment history, visit summaries, and selected treatment information through their secure account dashboard."
      }
    ]
  },
  {
    id: "billing",
    title: "Payments & Billing",
    description:
      "Important information about invoices, payment methods, billing support, and transaction history.",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer:
          "Accepted methods may include card payments, mobile money, bank transfers, insurance-backed processing, and cash payments at approved billing points, depending on the organization."
      },
      {
        question: "Can I pay online for consultations or services?",
        answer:
          "Yes, where online payment has been enabled. Patients may be able to complete secure payments before or after a consultation or service visit."
      },
      {
        question: "How can I check my billing history?",
        answer:
          "Billing history is typically available in the patient billing section, where invoices, payment status, completed transactions, and outstanding balances can be reviewed."
      },
      {
        question: "What should I do if I notice a problem with my bill?",
        answer:
          "Contact the billing or accounts department as soon as possible with the invoice reference and a clear description of the issue so it can be reviewed promptly."
      }
    ]
  },
  {
    id: "support",
    title: "Emergency & Support",
    description:
      "Guidance for urgent care situations, technical support issues, and service feedback.",
    faqs: [
      {
        question: "What should I do in a medical emergency?",
        answer:
          "In a medical emergency, contact emergency services immediately or go directly to the nearest emergency unit. Do not rely on a general FAQ interface for urgent medical care."
      },
      {
        question: "How do I get technical support?",
        answer:
          "Technical support can be reached through the help desk, support center, or contact section of the platform. Include clear details of the issue for faster resolution."
      },
      {
        question: "What if I cannot log into my account?",
        answer:
          "Use the password reset option first. If the issue continues, contact support so your identity can be verified and access can be restored securely."
      },
      {
        question: "Can I submit feedback or complaints?",
        answer:
          "Yes. Patients and users should be able to submit feedback, complaints, and service concerns through the designated patient relations or support channels."
      }
    ]
  }
];

const CATEGORY_META = {
  all: {
    label: "All Questions",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200"
  },
  general: {
    label: "General",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200"
  },
  appointments: {
    label: "Appointments",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200"
  },
  records: {
    label: "Privacy",
    badgeClass: "bg-cyan-100 text-cyan-700 border-cyan-200"
  },
  billing: {
    label: "Billing",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200"
  },
  support: {
    label: "Support",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  default: {
    label: "FAQ",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200"
  }
};

const QUICK_LINKS = [
  { label: "General Help", icon: InfoIcon, category: "general" },
  { label: "Appointments", icon: CalendarIcon, category: "appointments" },
  { label: "Privacy & Records", icon: ShieldIcon, category: "records" },
  { label: "Billing", icon: MoneyIcon, category: "billing" },
  { label: "Emergency Support", icon: SupportIcon, category: "support" }
];

function getCategoryMeta(categoryId) {
  return CATEGORY_META[categoryId] || CATEGORY_META.default;
}

function flattenFaqs(categories) {
  return categories.flatMap((category) =>
    category.faqs.map((faq) => ({
      ...faq,
      categoryId: category.id,
      categoryTitle: category.title,
      categoryDescription: category.description
    }))
  );
}

function filterFaqs(faqs, searchTerm, activeCategory) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return faqs.filter((faq) => {
    const categoryMatch = activeCategory === "all" || faq.categoryId === activeCategory;
    const textMatch =
      normalizedSearch.length === 0 ||
      faq.question.toLowerCase().includes(normalizedSearch) ||
      faq.answer.toLowerCase().includes(normalizedSearch) ||
      faq.categoryTitle.toLowerCase().includes(normalizedSearch);

    return categoryMatch && textMatch;
  });
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20L16.65 16.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10V16" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3V7M8 3V7M3 10H21" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M12 3L19 6V11C19 16 15.5 19.5 12 21C8.5 19.5 5 16 5 11V6L12 3Z" strokeLinejoin="round" />
      <path d="M9.5 12.5L11 14L14.5 10.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M7 12H7.01M17 12H17.01" strokeLinecap="round" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M5 12A7 7 0 0 1 19 12V17A2 2 0 0 1 17 19H15" strokeLinecap="round" />
      <rect x="3" y="11" width="4" height="6" rx="2" />
      <rect x="17" y="11" width="4" height="6" rx="2" />
      <path d="M12 19H15" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ open = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroSection({ totalCategories, totalQuestions }) {
  return (
    <header className="relative overflow-hidden bg-blue-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_25%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-50 backdrop-blur-sm">
              Professional Healthcare Help Center
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions for Patients and Visitors
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              A comprehensive, professional, and searchable FAQ experience designed for clarity, trust, and accessibility in medical interfaces.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
                Contact Support
              </button>
              <button className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                Book Appointment
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">FAQ Overview</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Quickly browse the most common support topics patients and visitors usually need.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-100">Categories</p>
                <p className="mt-2 text-2xl font-semibold">{totalCategories}</p>
                <p className="mt-1 text-sm text-blue-100">General, appointments, privacy, billing, and support</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-100">Questions</p>
                <p className="mt-2 text-2xl font-semibold">{totalQuestions}</p>
                <p className="mt-1 text-sm text-blue-100">Comprehensive answers across essential patient concerns</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-blue-100">Most Asked Topics</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/95">
                  <span className="rounded-xl bg-white/10 px-3 py-2">Booking appointments</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">Medical records</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">Billing support</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">Emergency guidance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function CategoryButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-blue-700 bg-blue-700 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
      }`}
    >
      {label}
    </button>
  );
}

function SearchFilterSection({
  searchTerm,
  activeCategory,
  visibleCategories,
  resultsCount,
  onSearchChange,
  onCategoryChange,
  onReset
}) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-sm lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Search and filter the full FAQ library</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            Search by question, answer, or category to find the right guidance quickly.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {resultsCount} result{resultsCount === 1 ? "" : "s"} found
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by question, answer, or category..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={onReset}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          Reset Filters
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {visibleCategories.map((categoryId) => {
          const meta = getCategoryMeta(categoryId);

          return (
            <CategoryButton
              key={categoryId}
              active={activeCategory === categoryId}
              onClick={() => onCategoryChange(categoryId)}
              label={meta.label}
            />
          );
        })}
      </div>
    </section>
  );
}

function QuickAccessSection({ onCategoryChange }) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quick access sections</h2>
          <p className="mt-1 text-sm text-slate-600">Jump directly to the most important support areas.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;

          return (
            <button
              key={link.label}
              onClick={() => onCategoryChange(link.category)}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-700">
                <Icon />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{link.label}</h3>
              <p className="mt-2 text-sm text-slate-600">Filter the FAQ collection to this support area.</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FAQCard({ item, categoryTitle, badgeClass }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
      >
        <div>
          <div className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {categoryTitle}
          </div>
          <h3 className="text-base font-semibold leading-7 text-slate-900">{item.question}</h3>
        </div>
        <div className="mt-1 shrink-0 rounded-full bg-slate-100 p-2 text-slate-600">
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-red-700">No matching FAQs found</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700">
        Try adjusting your search keywords or switch back to a broader category filter.
      </p>
    </div>
  );
}

function FAQResultsSection({ filteredFaqs }) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">FAQ Results</h2>
          <p className="mt-1 text-sm text-slate-600">
            Showing professionally grouped questions with a clean medical-style card layout.
          </p>
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredFaqs.map((faq) => {
            const meta = getCategoryMeta(faq.categoryId);

            return (
              <FAQCard
                key={`${faq.categoryId}-${faq.question}`}
                item={faq}
                categoryTitle={faq.categoryTitle}
                badgeClass={meta.badgeClass}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const allFaqs = useMemo(() => flattenFaqs(FAQ_DATA), []);
  const visibleCategories = useMemo(() => ["all", ...FAQ_DATA.map((category) => category.id)], []);
  const filteredFaqs = useMemo(() => filterFaqs(allFaqs, searchTerm, activeCategory), [allFaqs, searchTerm, activeCategory]);

  const totalQuestionCount = allFaqs.length;
  const totalCategoryCount = FAQ_DATA.length;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <HeroSection totalCategories={totalCategoryCount} totalQuestions={totalQuestionCount} />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <SearchFilterSection
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          visibleCategories={visibleCategories}
          resultsCount={filteredFaqs.length}
          onSearchChange={setSearchTerm}
          onCategoryChange={setActiveCategory}
          onReset={() => {
            setSearchTerm("");
            setActiveCategory("all");
          }}
        />

        <QuickAccessSection onCategoryChange={setActiveCategory} />
        <FAQResultsSection filteredFaqs={filteredFaqs} />
      </main>

      <Footer />
    </div>
  );
}