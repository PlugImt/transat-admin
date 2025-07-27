import {FaChartLine, FaCouch, FaShip, FaTree, FaMobile} from 'react-icons/fa';
import {useTranslation} from 'react-i18next';

import type {Route} from "../+types/root";
import {Grid, Hero, Section, ServiceCard} from "../components";

export const meta: Route.MetaFunction = () => {
    return [
        {title: "Transat - Home"},
        {name: "description", content: "Welcome to Transat, your ultimate campus companion."},
    ];
};

export default function Home() {
    const {t} = useTranslation();

    const services = [
        {
            title: t('home.services.restaurant.title'),
            description: t('home.services.restaurant.description'),
            icon: <img
                src="/restaurant_icon.png"
                alt="Restaurant icon"
                className="w-6 h-6 object-contain"
            />,
            linkTo: '#',
            linkText: t('home.services.explore'),
        },
        {
            title: t('download.features.laundry.title'),
            description: t('download.features.laundry.description'),
            icon: <img
                src="/laundry_logo.png"
                alt="Laudry icon"
                className="w-6 h-6 object-contain"
            />,
            linkTo: '#',
            linkText: t('home.services.explore'),
        },
    ];

    const comingSoonServices = [
        {
            title: t('home.comingSoon.entertainment'),
            description: t('home.comingSoon.entertainmentDescription'),
            icon: <FaCouch className="w-5 h-5"/>,
            linkTo: '#',
            linkText: t('home.comingSoon.learnMore'),
        },
        {
            title: t('home.comingSoon.excursions'),
            description: t('home.comingSoon.excursionsDescription'),
            icon: <FaTree className="w-5 h-5"/>,
            linkTo: '#',
            linkText: t('home.comingSoon.learnMore'),
        },
        {
            title: t('home.comingSoon.shipInfo'),
            description: t('home.comingSoon.shipInfoDescription'),
            icon: <FaShip className="w-5 h-5"/>,
            linkTo: '#',
            linkText: t('home.comingSoon.learnMore'),
        },
    ];

    return (
        <div>
            {/* Hero section */}
            <Hero
                title={t('home.welcome')}
                subtitle={t('home.description')}
                ctaText="Download Mobile App"
                ctaLink="/download"
                overlayOpacity={0.7}
            />

            {/* Services section */}
            <Section
                id="services"
                title={t('home.services.title')}
                subtitle={t('home.services.subtitle')}
                spacing="xl"
            >
                <Grid cols={{sm: 1, md: 2}} gap="lg">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.linkTo}
                            title={service.title}
                            description={service.description}
                            icon={service.icon}
                            linkTo={service.linkTo}
                            linkText={service.linkText}
                            animationDelay={index * 100}
                        />
                    ))}
                </Grid>
            </Section>

            {/* Mobile App Download Section */}
            <Section
                title="Get the Mobile App"
                subtitle="Access all services on your phone with the official Transat app"
                spacing="xl"
            >
                <Grid cols={{sm: 1, md: 1}} gap="lg">
                    <ServiceCard
                        title="Download Transat App"
                        description="Available for iOS and Android. Get real-time updates, check restaurant menus, view statistics, and more!"
                        icon={<FaMobile className="w-6 h-6" />}
                        linkTo="/download"
                        linkText="Download Now"
                        animationDelay={0}
                    />
                </Grid>
            </Section>

        </div>
    );
}
