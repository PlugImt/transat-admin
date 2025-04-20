import { Link } from 'react-router';
import { FaShip, FaUtensils, FaChartLine, FaTshirt, FaCouch, FaTree } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import type { Route } from "../+types/root";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Transat - Home" },
    { name: "description", content: "Welcome to Transat, your ultimate cruise companion." },
  ];
};

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Hero section */}
      <section className="mb-12">
        <div className="card stats-card max-w-screen-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-text-primary">
            {t('home.welcome')}
          </h1>
          <p className="text-text-primary opacity-80 text-center max-w-2xl mx-auto">
            {t('home.description')}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">{t('home.services.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Laundry Card */}
          <div className="card service-card max-w-[500px] group hover:shadow-lg transition-all">
            <Link to="/laundry" className="card-content block">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <img
                      src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/machine.png"
                      alt="Laundry icon"
                      className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.services.laundry.title')}</h3>
              </div>
              <p className="text-text-primary opacity-80">
                {t('home.services.laundry.description')}
              </p>
              <div className="mt-6">
                <span className="text-accent inline-flex items-center font-medium">
                  {t('home.services.explore')} 
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Restaurant Card */}
          <div className="card service-card max-w-[500px] group hover:shadow-lg transition-all">
            <Link to="/restaurant" className="card-content block">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <img
                      src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/restaurant.png"
                      alt="Restaurant icon"
                      className="w-16 h-16 object-contain"
                  />                </div>
                <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.services.restaurant.title')}</h3>
              </div>
              <p className="text-text-primary opacity-80">
                {t('home.services.restaurant.description')}
              </p>
              <div className="mt-6">
                <span className="text-accent inline-flex items-center font-medium">
                  {t('home.services.explore')} 
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Statistics Card */}
          <div className="card service-card max-w-[500px] group hover:shadow-lg transition-all">
            <Link to="/statistics" className="card-content block">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <FaChartLine className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.services.statistics.title')}</h3>
              </div>
              <p className="text-text-primary opacity-80">
                {t('home.services.statistics.description')}
              </p>
              <div className="mt-6">
                <span className="text-accent inline-flex items-center font-medium">
                  {t('home.services.explore')} 
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/*/!* Coming Soon Section *!/*/}
      {/*<section>*/}
      {/*  <h2 className="text-2xl font-bold mb-6 text-text-primary">{t('home.comingSoon.title')}</h2>*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
      {/*    /!* Entertainment Card *!/*/}
      {/*    <div className="card service-card max-w-[500px] group">*/}
      {/*      <div className="card-content">*/}
      {/*        <div className="flex items-center mb-4">*/}
      {/*          <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent">*/}
      {/*            <FaCouch className="w-6 h-6" />*/}
      {/*          </div>*/}
      {/*          <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.comingSoon.entertainment')}</h3>*/}
      {/*        </div>*/}
      {/*        <p className="text-text-primary opacity-80">*/}
      {/*          {t('home.comingSoon.entertainmentDescription')}*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    /!* Excursions Card *!/*/}
      {/*    <div className="card service-card max-w-[500px] group">*/}
      {/*      <div className="card-content">*/}
      {/*        <div className="flex items-center mb-4">*/}
      {/*          <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent">*/}
      {/*            <FaTree className="w-6 h-6" />*/}
      {/*          </div>*/}
      {/*          <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.comingSoon.excursions')}</h3>*/}
      {/*        </div>*/}
      {/*        <p className="text-text-primary opacity-80">*/}
      {/*          {t('home.comingSoon.excursionsDescription')}*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}

      {/*    /!* Ship Info Card *!/*/}
      {/*    <div className="card service-card max-w-[500px] group">*/}
      {/*      <div className="card-content">*/}
      {/*        <div className="flex items-center mb-4">*/}
      {/*          <div className="w-12 h-12 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent">*/}
      {/*            <FaShip className="w-6 h-6" />*/}
      {/*          </div>*/}
      {/*          <h3 className="text-xl font-semibold ml-4 text-text-primary">{t('home.comingSoon.shipInfo')}</h3>*/}
      {/*        </div>*/}
      {/*        <p className="text-text-primary opacity-80">*/}
      {/*          {t('home.comingSoon.shipInfoDescription')}*/}
      {/*        </p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
}
