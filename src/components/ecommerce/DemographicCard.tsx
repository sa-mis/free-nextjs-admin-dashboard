"use client";
import React from "react";
import CountryMap from "./CountryMap";
import { useState } from "react";

export default function DemographicCard() {
  const [selectedCountry, setSelectedCountry] = useState("United States");

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Slovakia",
    "Slovenia",
    "Croatia",
    "Serbia",
    "Bulgaria",
    "Romania",
    "Greece",
    "Turkey",
    "Ukraine",
    "Belarus",
    "Lithuania",
    "Latvia",
    "Estonia",
    "Iceland",
    "Ireland",
    "Portugal",
    "Luxembourg",
    "Malta",
    "Cyprus",
    "Monaco",
    "Liechtenstein",
    "San Marino",
    "Vatican City",
    "Andorra",
    "Albania",
    "North Macedonia",
    "Bosnia and Herzegovina",
    "Montenegro",
    "Kosovo",
    "Moldova",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Kazakhstan",
    "Uzbekistan",
    "Turkmenistan",
    "Kyrgyzstan",
    "Tajikistan",
    "Afghanistan",
    "Pakistan",
    "India",
    "Nepal",
    "Bhutan",
    "Bangladesh",
    "Sri Lanka",
    "Maldives",
    "Myanmar",
    "Thailand",
    "Laos",
    "Cambodia",
    "Vietnam",
    "Malaysia",
    "Singapore",
    "Brunei",
    "Philippines",
    "Indonesia",
    "East Timor",
    "Papua New Guinea",
    "Australia",
    "New Zealand",
    "Fiji",
    "Vanuatu",
    "New Caledonia",
    "Solomon Islands",
    "Kiribati",
    "Tuvalu",
    "Nauru",
    "Palau",
    "Micronesia",
    "Marshall Islands",
    "Samoa",
    "Tonga",
    "Cook Islands",
    "Niue",
    "Tokelau",
    "American Samoa",
    "Guam",
    "Northern Mariana Islands",
    "Federated States of Micronesia",
    "Marshall Islands",
    "Palau",
    "Nauru",
    "Tuvalu",
    "Kiribati",
    "Solomon Islands",
    "Vanuatu",
    "New Caledonia",
    "Fiji",
    "New Zealand",
    "Australia",
    "Papua New Guinea",
    "East Timor",
    "Indonesia",
    "Philippines",
    "Brunei",
    "Singapore",
    "Malaysia",
    "Vietnam",
    "Cambodia",
    "Laos",
    "Thailand",
    "Myanmar",
    "Maldives",
    "Sri Lanka",
    "Bangladesh",
    "Bhutan",
    "Nepal",
    "India",
    "Pakistan",
    "Afghanistan",
    "Tajikistan",
    "Kyrgyzstan",
    "Turkmenistan",
    "Uzbekistan",
    "Kazakhstan",
    "Azerbaijan",
    "Armenia",
    "Georgia",
    "Moldova",
    "Kosovo",
    "Montenegro",
    "Bosnia and Herzegovina",
    "North Macedonia",
    "Albania",
    "Andorra",
    "Vatican City",
    "San Marino",
    "Liechtenstein",
    "Monaco",
    "Cyprus",
    "Malta",
    "Luxembourg",
    "Portugal",
    "Ireland",
    "Iceland",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Belarus",
    "Ukraine",
    "Turkey",
    "Greece",
    "Romania",
    "Bulgaria",
    "Serbia",
    "Croatia",
    "Slovenia",
    "Slovakia",
    "Hungary",
    "Czech Republic",
    "Poland",
    "Finland",
    "Denmark",
    "Norway",
    "Sweden",
    "Austria",
    "Switzerland",
    "Belgium",
    "Netherlands",
    "Spain",
    "Italy",
    "France",
    "Germany",
    "Australia",
    "Canada",
    "United Kingdom",
    "United States",
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Demographics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you've set for each month
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              width={40}
              height={40}
              src="/images/user/user-01.jpg"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {selectedCountry}
            </span>
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              Most visited country
            </span>
          </div>
        </div>

        <CountryMap />
      </div>
    </div>
  );
}
