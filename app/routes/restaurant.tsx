import {useEffect, useState} from "react";
import type {Route} from "../+types/root";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Container,
    Spinner,
    Stack,
    Text
} from "../components";

export const meta: Route.MetaFunction = () => {
    return [
        {title: "Restaurant - Transat"},
        {name: "description", content: "View today's menu at the campus restaurant"},
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

// Function to check if restaurant is closed based on day and mealtime
const isRestaurantClosed = (date: Date, mealtime: 'lunch' | 'dinner'): boolean => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Restaurant is closed on weekends (Saturday and Sunday)
    if (day === 0 || day === 6) {
        return true;
    }

    // Restaurant is closed on Friday for dinner
    if (day === 5 && mealtime === 'dinner') {
        return true;
    }

    return false;
};

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
            const {title, icon, color, mealtime} = categoryInfo[category];

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
    <Card className="bg-zinc-900 animate-fadeIn w-full mx-auto">
        <CardContent className="py-12 flex flex-col items-center justify-center">
            <Spinner size="lg" color="primary" className="mb-4"/>
            <Text color="muted">Loading menu...</Text>
        </CardContent>
    </Card>
);

export default function Restaurant() {
    // Get current date and time
    const currentDate = new Date();

    // Set default mealtime based on current time - if after 14:00, show dinner by default
    const defaultMealtime = currentDate.getHours() >= 14 ? 'dinner' : 'lunch';

    const [menuData, setMenuData] = useState<GroupedMenu | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMealtime, setSelectedMealtime] = useState<'lunch' | 'dinner'>(defaultMealtime);
    const [refreshing, setRefreshing] = useState(false);
    const [menuLastLoaded, setMenuLastLoaded] = useState<string>(new Date().toISOString());

    // Check if restaurant is closed for the selected mealtime
    const restaurantClosedForSelectedMeal = isRestaurantClosed(currentDate, selectedMealtime);

    // Check if restaurant is closed for both meals today
    const restaurantClosedToday = isRestaurantClosed(currentDate, 'lunch') && isRestaurantClosed(currentDate, 'dinner');

    const fetchMenu = async () => {
        setLoading(prev => prev === true);
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
            setMenuLastLoaded(new Date().toISOString());
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(`Failed to fetch menu: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchMenu();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // Format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
        <Container className="max-w-5xl py-8">
            <div className="flex flex-col gap-8 max-w-[800px] mx-auto">
                {/* Error display */}
                {error && (
                    <Card className="border-l-4 border-error animate-fadeIn">
                        <CardHeader className="pb-2">
                            <Stack direction="horizontal" align="center">
                                <div className="mr-2" role="img" aria-label="Error">⚠️</div>
                                <CardTitle>Error</CardTitle>
                            </Stack>
                        </CardHeader>
                        <CardContent>
                            <Text color="error">{error}</Text>
                        </CardContent>
                    </Card>
                )}

                {/* Restaurant Header Card */}
                <Card
                    className="bg-zinc-900 animate-fadeIn w-full mx-auto"
                    style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center w-full justify-center">
                            <CardTitle className="text-[#ffe6cc] flex-grow text-center">
                                Today's <span className="text-[#ec7f32]">Menu</span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="py-6">
                        {/* Restaurant closed message */}
                        {restaurantClosedToday && (
                            <div className="text-center mb-6 p-4 bg-error/10 rounded-lg">
                                <Text size="xl" weight="bold" color="error"
                                      className="flex items-center justify-center">
                                    <span className="mr-2">🚫</span> Restaurant is closed today
                                </Text>
                                <Text color="muted" className="mt-2">
                                    The restaurant is closed on weekends.
                                </Text>
                            </div>
                        )}

                        {/* Date Display */}
                        {menuData && !restaurantClosedToday && (
                            <>
                                <div className="flex flex-col items-center mb-6 text-center">
                                    <Text size="sm" color="muted" className="mb-2">Menu Date</Text>
                                    <Text size="lg" weight="medium">
                                        {formatDate(menuData.date)}
                                    </Text>
                                </div>

                                {/* Mealtime selector */}
                                <div className="flex flex-row flex-wrap justify-center gap-4 mt-4">
                                    <Button
                                        variant={selectedMealtime === 'lunch' ? 'primary' : 'outline'}
                                        onClick={() => setSelectedMealtime('lunch')}
                                        leftIcon="☀️"
                                        className={selectedMealtime === 'lunch' ? "bg-[#0049a8] hover:bg-[#0062e1]" : ""}
                                        disabled={restaurantClosedForSelectedMeal && selectedMealtime === 'lunch'}
                                    >
                                        Lunch
                                        {isRestaurantClosed(currentDate, 'lunch') && (
                                            <span className="ml-2 text-xs opacity-70">(Closed)</span>
                                        )}
                                    </Button>
                                    <Button
                                        variant={selectedMealtime === 'dinner' ? 'primary' : 'outline'}
                                        onClick={() => setSelectedMealtime('dinner')}
                                        leftIcon="🌙"
                                        className={selectedMealtime === 'dinner' ? "bg-[#0049a8] hover:bg-[#0062e1]" : ""}
                                        disabled={restaurantClosedForSelectedMeal && selectedMealtime === 'dinner'}
                                    >
                                        Dinner
                                        {isRestaurantClosed(currentDate, 'dinner') && (
                                            <span className="ml-2 text-xs opacity-70">(Closed)</span>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* "Too late for lunch" message when viewing lunch after 14:00 */}
                        {!restaurantClosedToday && selectedMealtime === 'lunch' && currentDate.getHours() >= 14 && (
                            <div className="text-center mt-4">
                                <Badge variant="warning" size="sm">
                                    Lunch service is over for today
                                </Badge>
                            </div>
                        )}

                        {/* Closed for specific mealtime message */}
                        {!restaurantClosedToday && restaurantClosedForSelectedMeal && (
                            <div className="text-center mt-4 p-3 bg-warning/10 rounded-lg">
                                <Text color="warning">
                                    {selectedMealtime === 'dinner' ?
                                        "The restaurant is closed for dinner on Fridays." :
                                        "The restaurant does not serve lunch on weekends."}
                                </Text>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Loading indicator */}
                {loading && <LoadingSkeleton/>}

                {/* Menu display */}
                {!loading && menuData && (
                    <>
                        {/* No items message or restaurant closed */}
                        {(getCurrentMealtimeItemCount() === 0 || restaurantClosedForSelectedMeal) ? (
                            <Card className="bg-zinc-900 animate-fadeIn w-full mx-auto">
                                <CardContent className="py-12 flex flex-col items-center justify-center">
                                    {restaurantClosedForSelectedMeal ? (
                                        <Text size="xl" color="muted">
                                            No menu available - Restaurant is closed
                                            for {selectedMealtime === 'lunch' ? 'lunch' : 'dinner'} today.
                                        </Text>
                                    ) : (
                                        <Text size="xl" color="muted">
                                            No menu items available
                                            for {selectedMealtime === 'lunch' ? 'lunch' : 'dinner'} today.
                                        </Text>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            /* Menu categories */
                            <Card
                                className="bg-zinc-900 animate-fadeIn w-full mx-auto"
                                style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold">
                                        {selectedMealtime === 'lunch' ? 'Lunch' : 'Dinner'} <span
                                        className="text-[#ec7f32]">Menu</span>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="py-6 pl-6 pr-6">
                                    <div className="space-y-8">
                                        {Object.entries(menuData[selectedMealtime]).map(([categoryKey, category], index) => (
                                            <div key={categoryKey}
                                                 className="border-t border-zinc-800 pt-6 first:border-0 first:pt-0">
                                                <div className="flex items-center mb-4">
                                                    <div className="text-2xl mr-2">{category.icon}</div>
                                                    <Text size="xl" weight="bold" color="primary"
                                                          className="text-[#0049a8]">
                                                        {category.title}
                                                    </Text>
                                                </div>

                                                <div className="pl-10">
                                                    <ul className="space-y-3">
                                                        {category.items.map((item, itemIndex) => (
                                                            <li
                                                                key={`${categoryKey}-${itemIndex}`}
                                                                className="animate-fadeInLeft text-lg"
                                                                style={{animationDelay: `${itemIndex * 0.1}s`}}
                                                            >
                                                                <Text>{item}</Text>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="justify-center border-t border-zinc-800 pt-4 text-center">
                                    <Badge variant="secondary" size="sm">
                                        Menu items may vary based on availability
                                    </Badge>
                                </CardFooter>
                            </Card>
                        )}
                    </>
                )}

                {!loading && menuData && (
                    <div className="text-center text-zinc-500 text-sm">
                        Menu last loaded: {formatDate(menuLastLoaded)}
                    </div>
                )}

            </div>
        </Container>
    );
} 