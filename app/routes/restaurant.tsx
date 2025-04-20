import { useState, useEffect } from "react";
import type { Route, MenuData, MenuItem } from "./+types/restaurant";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Restaurant - Transat" },
    { name: "description", content: "View today's menu at the campus restaurant" },
  ];
}

// Define API base URL
const API_BASE_URL = "https://transat.destimt.fr";

// Category icons mapping
const categoryIcons: Record<string, { icon: string, color: string }> = {
  "Entrée": { 
    icon: "🥗", 
    color: "#4ade80" // green
  },
  "Plat": { 
    icon: "🍲", 
    color: "#f97316" // orange
  },
  "Dessert": { 
    icon: "🍰", 
    color: "#ec4899" // pink
  },
  "Accompagnement": { 
    icon: "🥔", 
    color: "#a16207" // amber
  },
  "Petit déjeuner": { 
    icon: "☕", 
    color: "#854d0e" // yellow
  },
  "Végétarien": { 
    icon: "🥦", 
    color: "#16a34a" // green
  },
  "Poisson": { 
    icon: "🐟", 
    color: "#0284c7" // blue
  },
  "Viande": { 
    icon: "🍗", 
    color: "#b91c1c" // red
  },
  // Default for any other category
  "default": { 
    icon: "🍽️", 
    color: "#6366f1" // indigo
  }
};

// Get icon and color for a category
const getCategoryInfo = (category: string) => {
  return categoryIcons[category] || categoryIcons.default;
};

// Animation delay utility
const getAnimationDelay = (index: number) => {
  return `${index * 0.05}s`;
};

export default function Restaurant() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
        const menuItems: MenuItem[] = data.MenuData.items || [];
        
        // Extract unique categories
        const categories = Array.from(
          new Set(menuItems.map(item => item.category))
        ).filter(category => category);
        
        setMenuData({
          menuItems,
          date: data.UpdatedDate || new Date().toISOString(),
          categories
        });
        
        // Set the first category as selected by default if available
        if (categories.length > 0 && !selectedCategory) {
          setSelectedCategory(categories[0]);
        }
        
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

  // Filter menu items by selected category
  const filteredItems = selectedCategory
    ? menuData?.menuItems.filter(item => item.category === selectedCategory)
    : menuData?.menuItems;

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
      
      {/* Loading indicator */}
      {loading && (
        <div className="card stats-card mb-8">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent"></div>
            <p className="mt-4 text-lg">Loading today's menu...</p>
          </div>
        </div>
      )}
      
      {/* Menu display */}
      {!loading && menuData && (
        <div>
          {/* Category filters */}
          {menuData.categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8 transition-all duration-300">
              <button 
                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center border-2 ${
                  selectedCategory === null 
                    ? 'bg-accent text-white border-accent' 
                    : 'bg-transparent text-text-primary border-accent-hover hover:bg-accent hover:text-white'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                <span className="mr-2">🍽️</span>
                All Items
              </button>
              
              {menuData.categories.map((category, index) => {
                const { icon, color } = getCategoryInfo(category);
                return (
                  <button 
                    key={category}
                    style={{
                      animationDelay: getAnimationDelay(index),
                      borderColor: selectedCategory === category ? color : undefined,
                    }}
                    className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center border-2 animate-fadeIn ${
                      selectedCategory === category 
                        ? 'bg-accent text-white' 
                        : 'bg-transparent text-text-primary border-accent-hover hover:bg-accent hover:text-white'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className="mr-2">{icon}</span>
                    {category}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Menu items */}
          <div className="grid grid-cols-1 gap-6">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const { icon, color } = getCategoryInfo(item.category);
                return (
                  <div 
                    key={item.id || index}
                    className="card stats-card animate-fadeIn transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                    style={{ 
                      animationDelay: getAnimationDelay(index),
                      borderLeft: `4px solid ${color}`
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span 
                            className="w-8 h-8 flex items-center justify-center rounded-full mr-2 text-xl"
                            style={{ backgroundColor: `${color}30` }}
                          >
                            {icon}
                          </span>
                          <h3 className="card-title mb-0">{item.name}</h3>
                          {item.isVegetarian && (
                            <span className="ml-2 px-2 py-1 bg-green-900 text-green-100 text-xs rounded-full">
                              Veg
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="ml-10 mb-4 text-text-primary opacity-80">
                            {item.description}
                          </p>
                        )}
                        
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="ml-10">
                            <p className="text-sm text-accent mb-1">Allergens:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.allergens.map((allergen, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-1 bg-red-900 bg-opacity-30 text-red-100 text-xs rounded"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-text-primary opacity-60">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card stats-card text-center py-8">
                <h3 className="text-xl mb-2">No menu items found</h3>
                <p>
                  {selectedCategory 
                    ? `There are no items in the ${selectedCategory} category today.` 
                    : 'The menu for today is not available yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="text-center text-sm text-text-primary opacity-70 mt-8">
        Menu data provided by RU IMT Atlantique
      </div>
    </div>
  );
} 