import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui';

interface NavItem {
  label: string;
  path: string;
}

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items
  const navItems: NavItem[] = [
    { label: t('nav.laundry'), path: '/laundry' },
    { label: t('nav.restaurant'), path: '/restaurant' },
    { label: t('nav.statistics'), path: '/statistics' },
  ];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <header 
      className={`
       w-full max-w-screen-xl px-4 mx-auto 
        fixed z-sticky px-4 py-3 mx-4 my-2 rounded-lg z-50
        transition-all duration-normal backdrop-blur-2xl
        ${isScrolled 
          ? 'bg-[#181010]/60 shadow-lg' 
          : 'bg-[#181010]/20'
        }
        ${className}
      `}
      style={{
        left: '0',
        right: '0'
      }}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-foreground flex items-center">
          <img 
            src="https://epsbubz.stripocdn.email/content/guids/CABINET_882ea3df7cd154211d1b97eac5876cf77c8c0bab12620e24b042e4c3c07d9421/images/icon.png"
            alt="Transat Logo" 
            className="w-8 h-8 mr-2"
          />
          {t('app.title')}
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-foreground hover:text-primary transition-colors"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-foreground p-2"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            {isMobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-primary/20 animate-fadeIn">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    isActive 
                      ? "text-primary font-medium block py-1" 
                      : "text-foreground hover:text-primary transition-colors block py-1"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header; 