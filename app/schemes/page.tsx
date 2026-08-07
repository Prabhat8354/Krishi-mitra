"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Landmark, CheckCircle, FileText, ExternalLink, Calendar, HelpCircle, ShieldCheck } from "lucide-react";

interface Scheme {
  id: string;
  name: string;
  hindiName: string;
  category: "Financial Support" | "Insurance" | "Loan & Credit" | "Soil & Water";
  shortDesc: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  applicationProcess: string;
  officialLink: string;
  deadline?: string;
  subsidyPercent?: string;
}

const SCHEMES_DATA: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    hindiName: "प्रधानमंत्री किसान सम्मान निधि",
    category: "Financial Support",
    shortDesc: "Direct income support of ₹6,000 per year to small and marginal farmer families across India in 3 equal installments.",
    eligibility: [
      "Small and marginal farmer landholder families",
      "Valid land ownership records in state database",
      "Aadhaar-seeded bank account"
    ],
    benefits: "₹6,000 per annum credited directly to bank account in 3 equal installments of ₹2,000 every 4 months.",
    documents: [
      "Aadhaar Card",
      "Land Ownership Documents (Khatauni / Khasra)",
      "Bank Passbook with IFSC code",
      "Mobile Number linked with Aadhaar"
    ],
    applicationProcess: "Apply online at pmkisan.gov.in or visit your nearest Common Service Centre (CSC) / Agriculture Officer.",
    officialLink: "https://pmkisan.gov.in",
    deadline: "Ongoing (e-KYC Mandatory)",
    subsidyPercent: "100% Direct Cash Transfer"
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    hindiName: "प्रधानमंत्री फसल बीमा योजना",
    category: "Insurance",
    shortDesc: "Comprehensive crop insurance cover against non-preventable natural risks from pre-sowing to post-harvest.",
    eligibility: [
      "All farmers including sharecroppers and tenant farmers growing notified crops",
      "Landholding document or tenancy agreement"
    ],
    benefits: "Full financial compensation for crop yield loss due to drought, flood, pests, hailstorm, or unseasonal rain. Low premium rates (1.5% - 2% for food crops, 5% for commercial crops).",
    documents: [
      "Land Possession Certificate / Sowing Certificate",
      "Aadhaar Card",
      "Bank Account details",
      "Crop Sowing Proof"
    ],
    applicationProcess: "Enroll through National Crop Insurance Portal (pmfby.gov.in), bank branch, or insurance agent before seasonal cutoff date.",
    officialLink: "https://pmfby.gov.in",
    deadline: "Kharif: July 31 | Rabi: Dec 31",
    subsidyPercent: "Up to 90% Premium Subsidy"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC) Loan Scheme",
    hindiName: "किसान क्रेडिट कार्ड योजना",
    category: "Loan & Credit",
    shortDesc: "Concessional institutional credit for farmers to meet cultivation expenses, post-harvest needs, and farm maintenance.",
    eligibility: [
      "All farmers - individuals / joint borrowers",
      "Tenant farmers, oral lessees & sharecroppers",
      "Self Help Groups (SHGs) or Joint Liability Groups (JLGs)"
    ],
    benefits: "Access to flexible credit at an effective interest rate of 4% per annum (with 3% prompt repayment incentive). No collateral required for loans up to ₹1.6 Lakhs.",
    documents: [
      "Application Form",
      "Identity Proof (Aadhaar / Voter ID)",
      "Land ownership / tenancy proof",
      "Passport size photographs"
    ],
    applicationProcess: "Visit any commercial bank, RRB, or Cooperative Bank branch, or apply via PM-Kisan online portal.",
    officialLink: "https://myscheme.gov.in/schemes/kcc",
    deadline: "Open All Year",
    subsidyPercent: "3% Interest Subvention"
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    hindiName: "मृदा स्वास्थ्य कार्ड योजना",
    category: "Soil & Water",
    shortDesc: "Free soil testing card providing crop-wise nutrient status and customized fertilizer dosage guidance to improve yield.",
    eligibility: [
      "All agricultural landholders in India",
      "Individual or joint farm owners"
    ],
    benefits: "Customized advisory on 12 vital soil parameters (N, P, K, pH, EC, Organic Carbon, Micronutrients) to reduce fertilizer cost by 15-20%.",
    documents: [
      "Land Khasra/Khatauni number",
      "Aadhaar Card",
      "Mobile Number"
    ],
    applicationProcess: "Soil samples collected by State Agriculture Department officers or submit sample at local Soil Testing Laboratory (STL).",
    officialLink: "https://soilhealth.dac.gov.in",
    deadline: "Cycle every 2 years (Free)",
    subsidyPercent: "100% Free Soil Testing"
  },
  {
    id: "pmksy",
    name: "PM Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
    hindiName: "प्रधानमंत्री कृषि सिंचाई योजना",
    category: "Soil & Water",
    shortDesc: "Subsidy scheme promoting Micro Irrigation (Drip & Sprinkler) to optimize water usage and boost crop productivity.",
    eligibility: [
      "Farmers of all categories with accessible land and water source",
      "Priority to small & marginal farmers, women, and SC/ST farmers"
    ],
    benefits: "55% subsidy for small/marginal farmers and 45% for other farmers for installing Drip Irrigation and Sprinkler systems.",
    documents: [
      "Land Ownership Documents",
      "Aadhaar Card",
      "Bank Passbook",
      "Quotation from authorized drip vendor"
    ],
    applicationProcess: "Apply on State Horticulture Department Portal or approach District Horticulture Officer.",
    officialLink: "https://pmksy.gov.in",
    deadline: "Open for Fiscal Year",
    subsidyPercent: "55% Drip Irrigation Subsidy"
  }
];

export default function GovernmentSchemesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const categories = ["All", "Financial Support", "Insurance", "Loan & Credit", "Soil & Water"];

  const filteredSchemes = SCHEMES_DATA.filter((scheme) => {
    const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.hindiName.includes(searchTerm) ||
      scheme.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              Government Schemes & Agricultural Subsidies
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">Eligibility criteria, direct financial benefits & official application links</p>
          </div>
        </div>

        <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Official Subsidies
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scheme name (e.g. PM Kisan, KCC, Fasal Bima, Drip Subsidy)..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs text-gray-800"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-[20px] p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-200">
                    {scheme.category}
                  </span>
                  {scheme.subsidyPercent && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {scheme.subsidyPercent}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-gray-900">{scheme.name}</h3>
                <h4 className="text-xs font-semibold text-emerald-700 mb-2">{scheme.hindiName}</h4>
                <p className="text-gray-600 text-xs leading-relaxed mb-4">{scheme.shortDesc}</p>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Direct Benefits</span>
                  <p className="text-xs text-gray-800 font-medium">{scheme.benefits}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                {scheme.deadline && (
                  <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {scheme.deadline}
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                  >
                    View Details
                  </button>
                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition border border-gray-200/60"
                    title="Official Government Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[20px] max-w-2xl w-full p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto relative border border-gray-200">
              <button
                onClick={() => setSelectedScheme(null)}
                className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>

              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {selectedScheme.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedScheme.name}</h2>
              <h3 className="text-xs font-semibold text-emerald-700 mb-4">{selectedScheme.hindiName}</h3>

              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Eligibility Criteria
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-2">
                    {selectedScheme.eligibility.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> Required Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedScheme.documents.map((doc, idx) => (
                      <div key={idx} className="p-2.5 bg-gray-50 rounded-xl text-xs font-medium text-gray-800 border border-gray-200/60">
                        📄 {doc}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" /> Application Process
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                    {selectedScheme.applicationProcess}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <a
                  href={selectedScheme.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
                >
                  Apply on Official Government Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
