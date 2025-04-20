import { useState, useEffect } from "react";
import type { Route } from "../+types/root";
import { 
  Badge,
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Container, 
  Grid, 
  Section, 
  Spinner, 
  Stack, 
  Text 
} from "../components";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Restaurant - Transat" },
    { name: "description", content: "View today's menu at the campus restaurant" },
  ];
};

// Define API base URL
const API_BASE_URL = "https://transat.destimt.fr";

// MenuItem interface
interface MenuItem {
  name: string;
  description?: string;
  allergens?: string[];
  price?: string;
}

// API response interface
interface MenuResponse {
  grilladesMidi?: string[];
  migrateurs?: string[];
  cibo?: string[];
  accompMidi?: string[];
  grilladesSoir?: string[];
  accompSoir?: string[];
  updatedDate?: string;
}

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
  <Card className="mb-8">
    <CardContent>
      <div className="animate-fadeIn py-8" style={{ animationDelay: "0.1s" }}>
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
    </CardContent>
  </Card>
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
    <Container>
      <Section
        title="Today's Menu"
        subtitle={menuData ? `Menu for ${formatDate(menuData.date)}` : undefined}
        spacing="lg"
      >
        {/* Header image */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png" 
            alt="Restaurant icon" 
            className="w-16 h-16"
          />
        </div>
        
        {/* Error display */}
        {error && (
          <Card className="mb-8 bg-error/20">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <Text color="error">{error}</Text>
            </CardContent>
          </Card>
        )}
        
        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}
        
        {/* Menu display */}
        {!loading && menuData && (
          <>
            {/* Mealtime selector */}
            <div className="mb-8">
              <Stack direction="horizontal" justify="center" spacing="md">
                <Button
                  variant={selectedMealtime === 'lunch' ? 'primary' : 'outline'}
                  onClick={() => setSelectedMealtime('lunch')}
                  leftIcon="☀️"
                >
                  Lunch
                </Button>
                <Button
                  variant={selectedMealtime === 'dinner' ? 'primary' : 'outline'}
                  onClick={() => setSelectedMealtime('dinner')}
                  leftIcon="🌙"
                >
                  Dinner
                </Button>
              </Stack>
            </div>
            
            {/* No items message */}
            {getCurrentMealtimeItemCount() === 0 ? (
              <Card className="py-8">
                <CardContent className="text-center">
                  <Text size="xl" color="muted">
                    No menu items available for {selectedMealtime === 'lunch' ? 'lunch' : 'dinner'} today.
                  </Text>
                </CardContent>
              </Card>
            ) : (
              /* Menu categories */
              <div className="space-y-8">
                {Object.entries(menuData[selectedMealtime]).map(([categoryKey, category], index) => (
                  <Card 
                    key={categoryKey}
                    bordered
                    elevated
                    className="overflow-hidden"
                  >
                    <div 
                      className="border-b-2 bg-gradient-to-r from-primary/10 to-transparent"
                      style={{ borderColor: category.color }}
                    >
                      <CardHeader className="flex items-center">
                        <div className="text-2xl mr-2">{category.icon}</div>
                        <CardTitle>{category.title}</CardTitle>
                      </CardHeader>
                    </div>
                    
                    <CardContent>
                      <ul className="pl-4 space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li 
                            key={`${categoryKey}-${itemIndex}`}
                            className="animate-fadeInLeft text-lg"
                            style={{ animationDelay: `${itemIndex * 0.1}s` }}
                          >
                            <Text>{item}</Text>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Disclaimer */}
            <div className="mt-8 text-center">
              <Badge variant="secondary" size="sm">
                Menu items may vary based on availability
              </Badge>
            </div>
          </>
        )}
      </Section>
    </Container>
  );
} 