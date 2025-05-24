import { useEffect, useState } from 'react';
import { FaApple, FaGooglePlay, FaMobile, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import type { Route } from "../+types/root";
import { Hero, Section, Container, Grid, Card, Button, Text, Stack } from "../components";

export const meta: Route.MetaFunction = () => {
    return [
        { title: "Download Transat App" },
        { name: "description", content: "Download the Transat app for iOS and Android to access all campus services on the go." },
        { name: "keywords", content: "Transat, app, download, iOS, Android, IMT Atlantique, campus" },
    ];
};

// OS Detection utility
const detectOS = (): 'ios' | 'android' | 'other' => {
    if (typeof window === 'undefined') return 'other';
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
    } else if (/android/.test(userAgent)) {
        return 'android';
    }
    
    return 'other';
};

// Auto-redirect utility
const redirectToStore = (os: 'ios' | 'android') => {
    const storeUrls = {
        ios: 'https://apps.apple.com/fr/app/transat/id6602883801?l=en-GB',
        android: 'https://play.google.com/store/apps/details?id=com.yohann69.transat2_0'
    };
    
    window.location.href = storeUrls[os];
};

export default function Download() {
    const { t } = useTranslation();
    const [detectedOS, setDetectedOS] = useState<'ios' | 'android' | 'other'>('other');
    const [autoRedirected, setAutoRedirected] = useState(false);

    useEffect(() => {
        const os = detectOS();
        setDetectedOS(os);
        
        // Auto-redirect after a short delay if on mobile
        if ((os === 'ios' || os === 'android') && !autoRedirected) {
            const timer = setTimeout(() => {
                setAutoRedirected(true);
                redirectToStore(os);
            }, 2000); // 2 second delay to show the page briefly
            
            return () => clearTimeout(timer);
        }
    }, [autoRedirected]);

    const handleManualDownload = (platform: 'ios' | 'android') => {
        redirectToStore(platform);
    };

    return (
        <div>
            {/* Hero section */}
            <Hero
                title="Download Transat"
                subtitle="Get the official Transat app and access all campus services on your mobile device"
                ctaText="View Download Options"
                ctaLink="#download-options"
                overlayOpacity={0.8}
            />

            {/* Auto-redirect notice for mobile users */}
            {(detectedOS === 'ios' || detectedOS === 'android') && !autoRedirected && (
                <Section spacing="sm">
                    <Container>
                        <Card>
                            <Stack align="center" spacing="sm">
                                <FaMobile className="w-8 h-8 text-blue-600" />
                                <Text as="h3" size="lg" weight="bold" className="text-blue-800">
                                    {detectedOS === 'ios' ? 'iOS Device Detected' : 'Android Device Detected'}
                                </Text>
                                <Text className="text-blue-700">
                                    You will be automatically redirected to the {detectedOS === 'ios' ? 'App Store' : 'Google Play Store'} in a few seconds...
                                </Text>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="animate-spin">
                                        <FaDownload className="w-4 h-4" />
                                    </div>
                                    <Text size="sm">Redirecting...</Text>
                                </div>
                            </Stack>
                        </Card>
                    </Container>
                </Section>
            )}

            {/* Download options section */}
            <Section
                id="download-options"
                title="Choose Your Platform"
                subtitle="Available on both iOS and Android devices"
                spacing="xl"
            >
                <Container>
                    <Grid cols={{ sm: 1, md: 2 }} gap="lg">
                        {/* iOS Download Card */}
                        <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                            <Stack align="center" spacing="md">
                                <div className="bg-gray-900 rounded-2xl p-4">
                                    <FaApple className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <Text as="h3" size="lg" weight="bold" className="mb-2">Download for iOS</Text>
                                    <Text className="text-gray-600 mb-4">
                                        Available on iPhone and iPad running iOS 13.4 or later
                                    </Text>
                                </div>
                                <Button
                                    onClick={() => handleManualDownload('ios')}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FaApple className="w-5 h-5" />
                                    Download on App Store
                                </Button>
                                {detectedOS === 'ios' && (
                                    <Text size="sm" className="text-green-600 font-medium">
                                        ✓ Recommended for your device
                                    </Text>
                                )}
                            </Stack>
                        </Card>

                        {/* Android Download Card */}
                        <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                            <Stack align="center" spacing="md">
                                <div className="bg-green-600 rounded-2xl p-4">
                                    <FaGooglePlay className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <Text as="h3" size="lg" weight="bold" className="mb-2">Download for Android</Text>
                                    <Text className="text-gray-600 mb-4">
                                        Available on Android devices running Android 5.0 or later
                                    </Text>
                                </div>
                                <Button
                                    onClick={() => handleManualDownload('android')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FaGooglePlay className="w-5 h-5" />
                                    Get it on Google Play
                                </Button>
                                {detectedOS === 'android' && (
                                    <Text size="sm" className="text-green-600 font-medium">
                                        ✓ Recommended for your device
                                    </Text>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                </Container>
            </Section>

            {/* Features section */}
            <Section 
                title="What's in the App?" 
                subtitle="Everything you need for campus life at IMT Atlantique"
                spacing="xl"
            >
                <Container>
                    <Grid cols={{ sm: 1, md: 3 }} gap="lg">
                        <Card className="text-center">
                            <Stack align="center" spacing="sm">
                                <img
                                    src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png"
                                    alt="Restaurant"
                                    className="w-12 h-12 object-contain"
                                />
                                <Text as="h4" size="md" weight="medium">Restaurant Menu</Text>
                                <Text className="text-gray-600">
                                    Check the daily menu and never miss your favorite dishes
                                </Text>
                            </Stack>
                        </Card>

                        <Card className="text-center">
                            <Stack align="center" spacing="sm">
                                <img
                                    src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/machine.png"
                                    alt="Laundry"
                                    className="w-12 h-12 object-contain"
                                />
                                <Text as="h4" size="md" weight="medium">Laundry Status</Text>
                                <Text className="text-gray-600">
                                    Get real-time updates on washing machine availability
                                </Text>
                            </Stack>
                        </Card>

                        <Card className="text-center">
                            <Stack align="center" spacing="sm">
                                <FaMobile className="w-12 h-12 text-blue-600" />
                                <Text as="h4" size="md" weight="medium">Campus Services</Text>
                                <Text className="text-gray-600">
                                    Access all campus services and stay connected with your community
                                </Text>
                            </Stack>
                        </Card>
                    </Grid>
                </Container>
            </Section>

            {/* About section */}
            <Section 
                title="Made by Students, for Students" 
                subtitle="By the Atlantes, for the Atlantes 🐙"
                spacing="lg"
            >
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <Text className="text-gray-700 leading-relaxed">
                            Transat is developed by Plug'IMT, a student association at IMT Atlantique. 
                            Our goal is to improve the daily life of students on campus by providing 
                            easy access to essential services through a modern, intuitive mobile application.
                        </Text>
                    </div>
                </Container>
            </Section>
        </div>
    );
} 