import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
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
  return (
    <div className="min-h-screen">
      <header className="py-4 px-6 bg-card-bg shadow-md">
        <div className="container mx-auto max-w-screen-xl px-4">
          <div className="flex justify-between items-center">
            <NavLink to="/" className="text-2xl font-bold text-text-primary flex items-center">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png"
                alt="Transat Logo" 
                className="w-8 h-8 mr-2"
              />
              Transat
            </NavLink>
            <nav>
              <ul className="flex space-x-6">
                {/*<li>*/}
                {/*  <NavLink */}
                {/*    to="/restaurant" */}
                {/*    className={({ isActive }) => */}
                {/*      isActive */}
                {/*        ? "text-accent font-medium" */}
                {/*        : "text-text-primary hover:text-accent transition-colors"*/}
                {/*    }*/}
                {/*  >*/}
                {/*    Restaurant*/}
                {/*  </NavLink>*/}
                {/*</li>*/}
                <li>
                  <NavLink 
                    to="/statistics" 
                    className={({ isActive }) => 
                      isActive 
                        ? "text-accent font-medium" 
                        : "text-text-primary hover:text-accent transition-colors"
                    }
                  >
                    Statistics
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-screen-xl">
        <Outlet />
      </main>
      
      <footer className="py-6 bg-card-bg mt-12">
        <div className="container mx-auto px-4 max-w-screen-xl text-center">
          <div className="flex justify-center items-center mb-4">
            <img 
              src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/untitled111_i5s.png" 
              alt="Transat Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <p className="text-text-primary">© 2025 Transat - IMT Atlantique <span role="img" aria-label="Sun emoji">☀️</span></p>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
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
            Return Home
          </NavLink>
        </div>
      </div>
    </div>
  );
}
