import React from "react";
import { Settings, MessageSquare, BookOpen, HelpCircle, Mail, Phone } from "lucide-react";

interface MaintenanceModeProps {
  title?: string;
  message?: string;
}

export default function MaintenanceMode({
  title = "Site Under Maintenance",
  message = "We're currently performing scheduled maintenance to improve your experience. Please check back soon."
}: MaintenanceModeProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 text-center relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 opacity-40"></div>

          <div className="relative z-10">
            {/* Status indicator */}
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4 sm:mb-6 md:mb-8 shadow-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
              {title}
            </h1>

            {/* Message */}
            <p className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-full mx-auto px-4 sm:px-6">
              {message}
            </p>

            {/* What to do section */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 mb-4 sm:mb-6 md:mb-8 lg:mb-10 mx-1 sm:mx-2 md:mx-0">
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-center">While you wait:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-white rounded-md sm:rounded-lg p-3 sm:p-4 border border-slate-100 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">Stay Updated</p>
                    <p className="text-xs text-slate-600 leading-relaxed hidden sm:block">Follow our social media for real-time updates</p>
                  </div>
                </div>

                <div className="bg-white rounded-md sm:rounded-lg p-3 sm:p-4 border border-slate-100 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">Review Courses</p>
                    <p className="text-xs text-slate-600 leading-relaxed hidden sm:block">Study your enrolled courses offline</p>
                  </div>
                </div>

                <div className="bg-white rounded-md sm:rounded-lg p-3 sm:p-4 border border-slate-100 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
                  <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-50 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">Prepare Questions</p>
                    <p className="text-xs text-slate-600 leading-relaxed hidden sm:block">Get ready for your next class session</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact information */}
            <div className="mb-4 sm:mb-6 md:mb-8 mx-1 sm:mx-2 md:mx-0">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-2 sm:mb-3 md:mb-4 text-center sm:text-left">
                Need immediate assistance?
              </h3>
              <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                <a
                  href="mailto:support@octavenepal.com"
                  className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800 transition-all duration-200 group"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="truncate">support@octavenepal.com</span>
                </a>
                <a
                  href="tel:+977-1-234567"
                  className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 w-full bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-md sm:rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-medium text-green-700 hover:text-green-800 transition-all duration-200 group"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>+977-1-234567</span>
                </a>
              </div>
            </div>

            {/* Social media */}
            <div className="mb-4 sm:mb-6 md:mb-8 mx-1 sm:mx-2 md:mx-0">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-2 sm:mb-3 md:mb-4 text-center">
                Follow us for updates:
              </h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-3 max-w-full">
                  <a
                    href="#"
                    className="group flex items-center justify-center p-2 sm:p-3 rounded-md sm:rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    aria-label="Facebook"
                  >
                    <img
                      src="/images/social-medias/facebook.png"
                      alt="Facebook"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </a>
                  <a
                    href="#"
                    className="group flex items-center justify-center p-2 sm:p-3 rounded-md sm:rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    aria-label="Twitter"
                  >
                    <img
                      src="/images/social-medias/twitter.png"
                      alt="Twitter"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </a>
                  <a
                    href="#"
                    className="group flex items-center justify-center p-2 sm:p-3 rounded-md sm:rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    aria-label="LinkedIn"
                  >
                    <img
                      src="/images/social-medias/linkedin.png"
                      alt="LinkedIn"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </a>
                  <a
                    href="#"
                    className="group flex items-center justify-center p-2 sm:p-3 rounded-md sm:rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    aria-label="Instagram"
                  >
                    <img
                      src="/images/social-medias/instagram.png"
                      alt="Instagram"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </a>
                  <a
                    href="#"
                    className="group flex items-center justify-center p-2 sm:p-3 rounded-md sm:rounded-lg hover:bg-slate-100 transition-all duration-200 hover:scale-105"
                    aria-label="YouTube"
                  >
                    <img
                      src="/images/social-medias/youtube.png"
                      alt="YouTube"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 sm:pt-4 md:pt-6 border-t border-slate-200">
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center px-4 sm:px-6">
                Thank you for your patience! We appreciate your understanding and will have everything back to normal soon.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-4 md:-right-4 lg:-top-6 lg:-right-6 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-5 md:-left-5 lg:-bottom-6 lg:-left-6 w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl"></div>
    </div>
  );
}
