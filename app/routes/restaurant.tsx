import { useState, useEffect } from "react";
import type { Route, MenuItem, MenuResponse, ProcessedMenuData } from "./+types/restaurant";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Restaurant - Transat" },
    { name: "description", content: "View today's menu at the campus restaurant" },
  ];
}

// Define API base URL
const API_BASE_URL = "https://transat.destimt.fr";

// Define meal categories with icons and colors
const categoryInfo: Record<string, { title: string, icon: string, color: string, mealtime: 'lunch' | 'dinner' }> = {
  "grilladesMidi": { 
    title: "Grillades",
    icon: "🍖", 
    color: "#b91c1c", // red
    mealtime: 'lunch'
  },
  "migrateurs": { 
    title: "Migrateurs",
    icon: "🌍", 
    color: "#6366f1", // indigo
    mealtime: 'lunch'
  },
  "cibo": { 
    title: "Végétarien",
    icon: "🥦", 
    color: "#16a34a", // green
    mealtime: 'lunch'
  },
  "accompMidi": { 
    title: "Accompagnements",
    icon: "🥔", 
    color: "#a16207", // amber
    mealtime: 'lunch'
  },
  "grilladesSoir": { 
    title: "Grillades",
    icon: "🥩", 
    color: "#9f1239", // rose
    mealtime: 'dinner'
  },
  "accompSoir": { 
    title: "Accompagnements",
    icon: "🍚", 
    color: "#854d0e", // yellow
    mealtime: 'dinner'
  }
};

// Animation delay utility
const getAnimationDelay = (index: number) => {
  return `${index * 0.05}s`;
};

// Group menu items by category within each mealtime
interface GroupedMenu {
  lunch: {
    [category: string]: {
      items: string[];
      title: string;
      icon: string;
      color: string;
    };
  };
  dinner: {
    [category: string]: {
      items: string[];
      title: string;
      icon: string;
      color: string;
    };
  };
  date: string;
}

// Function to process the API response into a grouped format
const processMenuData = (menuResponse: MenuResponse): GroupedMenu => {
  const result: GroupedMenu = {
    lunch: {},
    dinner: {},
    date: menuResponse.updatedDate || new Date().toISOString()
  };
  
  // Process each category
  Object.entries(menuResponse).forEach(([category, dishes]) => {
    // Skip the updatedDate entry
    if (category === 'updatedDate') return;
    
    // Check if this is a valid category and has items
    if (categoryInfo[category] && Array.isArray(dishes) && dishes.length > 0) {
      const { title, icon, color, mealtime } = categoryInfo[category];
      
      // Add to appropriate mealtime group
      result[mealtime][category] = {
        items: dishes,
        title,
        icon,
        color
      };
    }
  });
  
  return result;
};

// Skeleton loaders for different sections
const LoadingSkeleton = () => (
  <div className="card stats-card mb-8">
    <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
      {/* Title skeleton */}
      <div className="flex items-center mb-6">
        <div className="skeleton-loader w-10 h-10 rounded-full mr-3"></div>
        <div className="skeleton-loader h-8 w-48"></div>
      </div>
      
      {/* Mealtime selector skeleton */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="skeleton-loader h-10 w-32 rounded-full"></div>
        <div className="skeleton-loader h-10 w-32 rounded-full"></div>
      </div>
      
      {/* Category blocks skeleton */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="mb-8 skeleton-loader p-4 rounded-lg"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <div className="flex items-center mb-4">
            <div className="skeleton-loader w-8 h-8 rounded-full mr-2"></div>
            <div className="skeleton-loader h-6 w-48"></div>
          </div>
          
          {/* Menu items skeleton */}
          <div className="pl-10">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="skeleton-loader h-4 w-3/4 mb-3"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Restaurant() {
  const [menuData, setMenuData] = useState<GroupedMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMealtime, setSelectedMealtime] = useState<'lunch' | 'dinner'>('lunch');

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Accept": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the menu data
        const processedData = processMenuData(data);
        
        setMenuData(processedData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(`Failed to fetch menu: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    fetchMenu();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Count items in current mealtime
  const getCurrentMealtimeItemCount = () => {
    if (!menuData) return 0;
    
    const categories = Object.values(menuData[selectedMealtime]);
    return categories.reduce((sum, category) => sum + category.items.length, 0);
  };

  return (
    <div>
      <h1 className="section-title flex items-center justify-center">
        <img 
          src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png" 
          alt="Restaurant icon" 
          className="w-12 h-12 mr-3"
        />
        Today's Menu
      </h1>
      
      {menuData && (
        <p className="text-center mb-8 text-text-primary opacity-80">
          Menu for {formatDate(menuData.date)}
        </p>
      )}
      
      {/* Error display */}
      {error && (
        <div className="card stats-card bg-red-900 text-white mb-8">
          <h2 className="card-title">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading skeleton */}
      {loading && <LoadingSkeleton />}
      
      {/* Menu display */}
      {!loading && menuData && (
        <div>
          {/* Mealtime selector */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center border-2 ${
                selectedMealtime === 'lunch'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-transparent text-text-primary border-accent-hover hover:bg-accent hover:text-white'
              }`}
              onClick={() => setSelectedMealtime('lunch')}
            >
              <span className="mr-2">☀️</span>
              Lunch
            </button>
            <button
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center border-2 ${
                selectedMealtime === 'dinner'
                  ? 'bg-accent text-white border-accent'
                  : 'bg-transparent text-text-primary border-accent-hover hover:bg-accent hover:text-white'
              }`}
              onClick={() => setSelectedMealtime('dinner')}
            >
              <span className="mr-2">🌙</span>
              Dinner
            </button>
          </div>
          
          {/* Menu categories */}
          {Object.keys(menuData[selectedMealtime]).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(menuData[selectedMealtime]).map(([categoryKey, category], index) => (
                <div 
                  key={categoryKey}
                  className="card stats-card animate-fadeIn"
                  style={{ 
                    animationDelay: getAnimationDelay(index),
                    borderLeft: `4px solid ${category.color}`
                  }}
                >
                  <div className="flex items-center mb-4">
                    <span 
                      className="w-10 h-10 flex items-center justify-center rounded-full mr-3 text-xl"
                      style={{ backgroundColor: `${category.color}30` }}
                    >
                      {category.icon}
                    </span>
                    <h2 className="card-title mb-0">{category.title}</h2>
                    {categoryKey === 'cibo' && (
                      <span className="ml-2 px-2 py-1 bg-green-900 text-green-100 text-xs rounded-full">
                        Végétarien
                      </span>
                    )}
                  </div>
                  
                  <div className="pl-12 space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="animate-fadeIn" 
                        style={{ animationDelay: getAnimationDelay(index + itemIndex + 1) }}
                      >
                        <p className="text-text-primary">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card stats-card text-center py-8">
              <h3 className="text-xl mb-2">No menu items found</h3>
              <p>
                {selectedMealtime === 'lunch' 
                  ? "The lunch menu for today is not available yet."
                  : "The dinner menu for today is not available yet."
                }
              </p>
              <button 
                className="btn-primary mt-4"
                onClick={() => setSelectedMealtime(selectedMealtime === 'lunch' ? 'dinner' : 'lunch')}
              >
                Switch to {selectedMealtime === 'lunch' ? 'Dinner' : 'Lunch'}
              </button>
            </div>
          )}
          
          {getCurrentMealtimeItemCount() === 0 && (
            <div className="card stats-card text-center py-8 mt-6">
              <h3 className="text-xl mb-2">No menu items found</h3>
              <p>
                {selectedMealtime === 'lunch' 
                  ? "The lunch menu for today is not available yet."
                  : "The dinner menu for today is not available yet."
                }
              </p>
              <button 
                className="btn-primary mt-4"
                onClick={() => setSelectedMealtime(selectedMealtime === 'lunch' ? 'dinner' : 'lunch')}
              >
                Switch to {selectedMealtime === 'lunch' ? 'Dinner' : 'Lunch'}
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="text-center text-sm text-text-primary opacity-70 mt-8">
        Menu data provided by RU IMT Atlantique
      </div>
    </div>
  );
} 