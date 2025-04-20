import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Text } from '../ui';
import LanguageSelector from '../LanguageSelector';

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: t('footer.links.about'), href: '#' },
    { label: t('footer.links.privacy'), href: '#' },
    { label: t('footer.links.terms'), href: '#' },
    { label: t('footer.links.contact'), href: '#' },
  ];
  
  const socialLinks = [
    { 
      name: 'Twitter', 
      href: '#', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      href: '#', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      href: '#', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      href: '#', 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
  ];
  
  return (
    <footer className={`bg-card mt-12 py-10 border-t border-primary/20 ${className}`}>
      <Container>
        <Grid cols={{ sm: 1, md: 4 }} gap="lg">
          {/* Logo and About */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png" 
                alt="Transat Logo" 
                className="w-10 h-10 object-contain"
              />
              <h3 className="text-lg font-bold ml-2 text-foreground">{t('app.title')}</h3>
            </div>
            <Text color="muted" size="sm" className="mb-4">
              {t('app.slogan')}
            </Text>
            <div className="mt-4">
              <LanguageSelector />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4">
              {t('footer.links.about')}
            </Text>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4">
              Contact
            </Text>
            <address className="not-italic text-sm">
              <Text color="muted" size="sm" className="mb-2">IMT Atlantique</Text>
              <Text color="muted" size="sm" className="mb-2">Campus de Nantes</Text>
              <Text color="muted" size="sm" className="mb-2">4 Rue Alfred Kastler</Text>
              <Text color="muted" size="sm" className="mb-2">44300 Nantes, France</Text>
            </address>
          </div>
          
          {/* Social Media */}
          <div>
            <Text as="h3" size="lg" weight="bold" className="mb-4">
              Social Media
            </Text>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  aria-label={social.name} 
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </Grid>
        
        <div className="pt-8 mt-8 border-t border-primary/20 text-center">
          <Text color="muted" size="sm">
            {t('footer.copyright', { year: currentYear })} <span role="img" aria-label="Sun emoji">☀️</span>
          </Text>
          <Text color="muted" size="xs" className="mt-2">
            {t('footer.allRightsReserved')}
          </Text>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 