// File: client/src/pages/LandingPage.jsx

import React from "react";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="h-screen overflow-y-auto bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpg" alt="EduSync Logo" className="w-8 h-8 rounded-full" />
              <span className="ml-3 text-xl font-bold text-gray-900">
                EduSync
              </span>
            </Link>
            <div>
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Login / Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="flex items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Smart Timetable & Automated Attendance
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create conflict-free schedules in seconds and log attendance
                  automatically across web and mobile. Role-based dashboards
                  keep everyone in sync.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                    Constraint Engine
                  </span>
                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                    Automated Attendance
                  </span>
                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                    Smart Alerts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to run schedules at scale
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Fast to set up. Flexible to customize.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Timetable Generator
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Auto-resolve constraints: teacher availability, room capacity,
                  non-overlaps.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Automated Attendance
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Routine-synced tracking during scheduled sessions.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Role-Based Dashboards
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Faculty, Admin/HoD, and Student views.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Smart Alerts
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Low attendance and anomaly notifications with toasts.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Manual Overrides
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Adjust scheduled sessions with quick edits.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold leading-7 text-gray-900">
                  Mobile Ready
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-600">
                  Capacitor-powered iOS & Android support.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <img src="/logo.jpg" alt="EduSync Logo" className="w-6 h-6 rounded-full" />
                <span className="ml-2 text-xl font-bold">EduSync</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                A project by{" "}
                <span className="font-semibold text-gray-200">CogniCode</span>,
                dedicated to simplifying academic administration through
                intelligent software solutions.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Developed By
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Koushiki Bose</li>
                <li>Ishan Mukherjee</li>
                <li>Akash Karmakar</li>
                <li>Rajat Mondal</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-blue-400 transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} EduSync by CogniCode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;