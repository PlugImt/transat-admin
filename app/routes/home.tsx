import { FaShip, FaUtensils, FaChartLine, FaTshirt, FaCouch, FaTree } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import type { Route } from "../+types/root";
import { Container, Grid, Hero, Section, ServiceCard, Text } from "../components";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Transat - Home" },
    { name: "description", content: "Welcome to Transat, your ultimate cruise companion." },
  ];
};

export default function Home() {
  const { t } = useTranslation();
  
  const services = [
    {
      title: t('home.services.laundry.title'),
      description: t('home.services.laundry.description'),
      icon: <img
        src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/machine.png"
        alt="Laundry icon"
        className="w-6 h-6 object-contain"
      />,
      linkTo: '/laundry',
      linkText: t('home.services.explore'),
    },
    {
      title: t('home.services.restaurant.title'),
      description: t('home.services.restaurant.description'),
      icon: <img
        src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png"
        alt="Restaurant icon"
        className="w-6 h-6 object-contain"
      />,
      linkTo: '/restaurant',
      linkText: t('home.services.explore'),
    },
    {
      title: t('home.services.statistics.title'),
      description: t('home.services.statistics.description'),
      icon: <FaChartLine className="w-5 h-5" />,
      linkTo: '/statistics',
      linkText: t('home.services.explore'),
    },
  ];
  
  const comingSoonServices = [
    {
      title: t('home.comingSoon.entertainment'),
      description: t('home.comingSoon.entertainmentDescription'),
      icon: <FaCouch className="w-5 h-5" />,
      linkTo: '#',
      linkText: t('home.comingSoon.learnMore'),
    },
    {
      title: t('home.comingSoon.excursions'),
      description: t('home.comingSoon.excursionsDescription'),
      icon: <FaTree className="w-5 h-5" />,
      linkTo: '#',
      linkText: t('home.comingSoon.learnMore'),
    },
    {
      title: t('home.comingSoon.shipInfo'),
      description: t('home.comingSoon.shipInfoDescription'),
      icon: <FaShip className="w-5 h-5" />,
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
        ctaText={t('home.getStarted')}
        ctaLink="#services"
        bgImage="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/ship.jpg"
        overlayOpacity={0.7}
      />
      
      {/* Services section */}
      <Section 
        id="services" 
        title={t('home.services.title')}
        subtitle={t('home.services.subtitle')}
        spacing="xl"
      >
        <Grid cols={{ sm: 1, md: 3 }} gap="lg">
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
      
      {/* Coming Soon section */}
      <Section 
        title={t('home.comingSoon.title')}
        subtitle={t('home.comingSoon.subtitle')}
        spacing="xl"
      >
        <Grid cols={{ sm: 1, md: 3 }} gap="lg">
          {comingSoonServices.map((service, index) => (
            <ServiceCard
              key={service.title}
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
      
      {/* About section */}
      <Section 
        title={t('home.about.title')}
        spacing="xl"
        className="bg-card py-16"
      >
        <Container maxWidth="lg">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png"
                alt="Transat Logo" 
                className="w-32 h-32 mx-auto md:mx-0 mb-4 animate-pulseGlow"
              />
              <Text size="lg" color="muted" className="text-center md:text-left">
                {t('home.about.description')}
              </Text>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="animate-fadeInRight" style={{ animationDelay: '200ms' }}>
                <Text as="h3" size="xl" weight="bold" className="mb-2">
                  {t('home.about.mission.title')}
                </Text>
                <Text color="muted">
                  {t('home.about.mission.description')}
                </Text>
              </div>
              <div className="animate-fadeInRight" style={{ animationDelay: '400ms' }}>
                <Text as="h3" size="xl" weight="bold" className="mb-2">
                  {t('home.about.vision.title')}
                </Text>
                <Text color="muted">
                  {t('home.about.vision.description')}
                </Text>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
