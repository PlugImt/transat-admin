import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transat - IMT Atlantique" },
    { name: "description", content: "Transat application for IMT Atlantique students" },
  ];
}

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-text-primary">
          <span role="img" aria-label="Waving hand emoji" className="mr-2">👋</span>
          Welcome to Transat
        </h1>
        <p className="text-lg text-text-primary max-w-3xl mx-auto mb-8">
          Your all-in-one platform for campus services at IMT Atlantique
        </p>
      </section>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Laundry card */}
        <div className="card">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <h2 className="card-title">Laundry</h2>
              <p className="mb-6">
                Check the status of washing machines and dryers on campus.
              </p>
            </div>
            <div className="ml-2">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/machine.png" 
                alt="Laundry icon" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <div className="text-center">
            <button className="btn-primary">Check Status</button>
          </div>
        </div>

        {/* Restaurant card */}
        <div className="card">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <h2 className="card-title">Restaurant</h2>
              <p className="mb-6">
                View today's menu and upcoming meals at the campus restaurant.
              </p>
            </div>
            <div className="ml-2">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png" 
                alt="Restaurant icon" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <div className="text-center">
            <button className="btn-primary">View Menu</button>
          </div>
        </div>

        {/* Statistics card */}
        <div className="card">
          <div className="flex items-start mb-4">
            <div className="flex-1">
              <h2 className="card-title">Statistics</h2>
              <p className="mb-6">
                View usage statistics for Transat services and API performance.
              </p>
            </div>
            <div className="ml-2">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png" 
                alt="Statistics icon" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <div className="text-center">
            <Link to="/statistics" className="btn-primary">View Statistics</Link>
          </div>
        </div>
      </div>

      {/* Coming soon section */}
      <div className="card mt-8">
        <div className="flex items-start">
          <div className="flex-1">
            <h2 className="card-title">Coming Soon</h2>
            <p>
              We're constantly working to improve Transat with new features. Stay tuned for upcoming services and enhancements!
            </p>
          </div>
          <div className="ml-2">
            <img 
              src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png" 
              alt="Coming soon icon" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
