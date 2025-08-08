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

// Check if URL contains QR code parameter
const isFromQRCode = (): boolean => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('source') === 'qrcode';
};

// Auto-redirect utility
const redirectToStore = (os: 'ios' | 'android') => {
    const storeUrls = {
        ios: 'https://apps.apple.com/app/apple-store/id6602883801?pt=127246943&ct=qrcode&mt=8',
        android: 'https://play.google.com/store/apps/details?id=com.yohann69.transat2_0'
    };
    
    window.location.href = storeUrls[os];
};

export default function Download() {
    const { t } = useTranslation();
    const [detectedOS, setDetectedOS] = useState<'ios' | 'android' | 'other'>('other');
    const [autoRedirected, setAutoRedirected] = useState(false);
    const [isQRCode, setIsQRCode] = useState(false);

    useEffect(() => {
        const os = detectOS();
        const fromQR = isFromQRCode();
        setDetectedOS(os);
        setIsQRCode(fromQR);
        
        // Auto-redirect logic
        if ((os === 'ios' || os === 'android') && !autoRedirected) {
            const redirectDelay = fromQR ? 0 : 3000; // Immediate redirect for QR codes, 3s for others
            
            const timer = setTimeout(() => {
                setAutoRedirected(true);
                redirectToStore(os);
            }, redirectDelay);
            
            return () => clearTimeout(timer);
        }
    }, [autoRedirected]);

    const handleManualDownload = (platform: 'ios' | 'android') => {
        redirectToStore(platform);
    };

    return (
        <div>
            {/* Auto-redirect notice for mobile users */}
            {(detectedOS === 'ios' || detectedOS === 'android') && !autoRedirected && (
                <Section spacing="sm" className="min-h-[100vh]">
                    <Container>
                        <Card>
                            <Stack align="center" spacing="sm">
                                <FaMobile className="w-8 h-8 text-blue-600" />
                                <Text as="h3" size="lg" weight="bold" className="text-blue-800">
                                    {detectedOS === 'ios' ? t('download.detection.ios') : t('download.detection.android')}
                                </Text>
                                <Text className="text-blue-700">
                                    {isQRCode 
                                        ? t('download.redirecting.immediate', { 
                                            store: detectedOS === 'ios' ? t('download.stores.appStore') : t('download.stores.googlePlay')
                                          })
                                        : t('download.redirecting.delayed', { 
                                            store: detectedOS === 'ios' ? t('download.stores.appStore') : t('download.stores.googlePlay')
                                          })
                                    }
                                </Text>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="animate-spin">
                                        <FaDownload className="w-4 h-4" />
                                    </div>
                                    <Text size="sm">{t('download.redirecting.status')}</Text>
                                </div>
                            </Stack>
                        </Card>
                    </Container>
                </Section>
            )}

            {/* Hero section */}
            <Hero
                title={t('download.hero.title')}
                subtitle={t('download.hero.subtitle')}
                ctaText={t('download.hero.cta')}
                ctaLink="#download-options"
                overlayOpacity={0.8}
            />

            {/* Download options section */}
            <Section
                id="download-options"
                title={t('download.options.title')}
                subtitle={t('download.options.subtitle')}
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
                                    <Text as="h3" size="lg" weight="bold" className="mb-2">
                                        {t('download.ios.title')}
                                    </Text>
                                    <Text className="text-gray-600 mb-4">
                                        {t('download.ios.description')}
                                    </Text>
                                </div>
                                <Button
                                    onClick={() => handleManualDownload('ios')}
                                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FaApple className="w-5 h-5" />
                                    {t('download.ios.button')}
                                </Button>
                                {detectedOS === 'ios' && (
                                    <Text size="sm" className="text-green-600 font-medium">
                                        ✓ {t('download.recommended')}
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
                                    <Text as="h3" size="lg" weight="bold" className="mb-2">
                                        {t('download.android.title')}
                                    </Text>
                                    <Text className="text-gray-600 mb-4">
                                        {t('download.android.description')}
                                    </Text>
                                </div>
                                <Button
                                    onClick={() => handleManualDownload('android')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FaGooglePlay className="w-5 h-5" />
                                    {t('download.android.button')}
                                </Button>
                                {detectedOS === 'android' && (
                                    <Text size="sm" className="text-green-600 font-medium">
                                        ✓ {t('download.recommended')}
                                    </Text>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                </Container>
            </Section>

            {/* Features section */}
            <Section 
                title={t('download.features.title')}
                subtitle={t('download.features.subtitle')}
                spacing="xl"
            >
                <Container>
                    <Grid cols={{ sm: 1, md: 2 }} gap="lg">
                        <Card className="text-center">
                            <Stack align="center" spacing="sm">
                                <img
                                    src="/restaurant_icon.png"
                                    alt="Restaurant"
                                    className="w-12 h-12 object-contain"
                                />
                                <Text as="h4" size="md" weight="medium">{t('download.features.restaurant.title')}</Text>
                                <Text className="text-gray-600">
                                    {t('download.features.restaurant.description')}
                                </Text>
                            </Stack>
                        </Card>

                        <Card className="text-center">
                            <Stack align="center" spacing="sm">
                                <img
                                    src="/laundry_logo.png"
                                    alt="Restaurant"
                                    className="w-12 h-12 object-contain"
                                />
                                <Text as="h4" size="md" weight="medium">{t('download.features.laundry.title')}</Text>
                                <Text className="text-gray-600">
                                    {t('download.features.laundry.description')}
                                </Text>
                            </Stack>
                        </Card>
                    </Grid>
                </Container>
            </Section>

            {/* About section */}
            <Section 
                title={t('download.about.title')}
                subtitle={t('download.about.subtitle')}
                spacing="lg"
            >
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <Text className="text-gray-700 leading-relaxed">
                            {t('download.about.description')}
                        </Text>
                    </div>
                </Container>
            </Section>
        </div>
    );
} 