import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import type { Route } from "./+types/root";
import LanguageSelector from "./components/LanguageSelector";
import "./i18n"; // Import i18n configuration
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  
  // Set language based on browser preference
  useEffect(() => {
    // Default behavior handled by i18next-browser-languagedetector
  }, []);
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 bg-card-bg shadow-md">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="text-2xl font-bold text-text-primary flex items-center">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png"
                alt="Transat Logo" 
                className="w-8 h-8 mr-2"
              />
              {t('app.title')}
            </NavLink>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-accent font-medium" 
                        : "text-text-primary hover:text-accent transition-colors"
                    }
                  >
                    {t('nav.home')}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/restaurant" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-accent font-medium" 
                        : "text-text-primary hover:text-accent transition-colors"
                    }
                  >
                    {t('nav.restaurant')}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/statistics" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-accent font-medium" 
                        : "text-text-primary hover:text-accent transition-colors"
                    }
                  >
                    {t('nav.statistics')}
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/laundry" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-accent font-medium" 
                        : "text-text-primary hover:text-accent transition-colors"
                    }
                  >
                    {t('nav.laundry')}
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-screen-xl flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-card-bg mt-12 py-10 border-t border-accent-hover border-opacity-30">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <img 
                  src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png" 
                  alt="Transat Logo" 
                  className="w-10 h-10 object-contain"
                />
                <h3 className="text-lg font-bold ml-2 text-text-primary">{t('app.title')}</h3>
              </div>
              <p className="text-sm text-text-primary opacity-80 mb-4">
                {t('app.slogan')}
              </p>
              <div className="mt-4">
                <LanguageSelector />
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-text-primary">{t('footer.links.about')}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-primary opacity-80 hover:text-accent transition-colors text-sm">
                    {t('footer.links.about')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary opacity-80 hover:text-accent transition-colors text-sm">
                    {t('footer.links.privacy')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary opacity-80 hover:text-accent transition-colors text-sm">
                    {t('footer.links.terms')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-primary opacity-80 hover:text-accent transition-colors text-sm">
                    {t('footer.links.contact')}
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-text-primary">Contact</h3>
              <address className="not-italic text-sm">
                <p className="mb-2 text-text-primary opacity-80">IMT Atlantique</p>
                <p className="mb-2 text-text-primary opacity-80">Campus de Nantes</p>
                <p className="mb-2 text-text-primary opacity-80">4 Rue Alfred Kastler</p>
                <p className="mb-2 text-text-primary opacity-80">44300 Nantes, France</p>
              </address>
            </div>
            
            {/* Social Media */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-bold mb-4 text-text-primary">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="text-text-primary hover:text-accent transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="text-text-primary hover:text-accent transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-text-primary hover:text-accent transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-text-primary hover:text-accent transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-accent-hover border-opacity-20 text-center">
            <p className="text-text-primary opacity-70 text-sm">
              {t('footer.copyright', { year: currentYear })} <span role="img" aria-label="Sun emoji">☀️</span>
            </p>
            <p className="text-text-primary opacity-60 text-xs mt-2">
              {t('footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t('errors.unexpectedError');
  let details = "";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? t('errors.404') : "Error";
    details =
      error.status === 404
        ? t('errors.pageNotFound')
        : error.statusText || t('errors.unexpectedError');
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="pt-16 p-4 container mx-auto">
      <div className="card stats-card">
        <h1 className="card-title text-center text-3xl">{message}</h1>
        <p className="text-center mb-4">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto bg-black rounded-md mt-4">
            <code>{stack}</code>
          </pre>
        )}
        <div className="text-center mt-6">
          <NavLink to="/" className="btn-primary">
            {t('errors.returnHome')}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
