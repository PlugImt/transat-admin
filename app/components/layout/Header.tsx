import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router';
import {useTranslation} from 'react-i18next';

interface NavItem {
    label: string;
    path: string;
}

export interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({className = ''}) => {
    const {t} = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navigation items
    const navItems: NavItem[] = [
        {label: t('nav.download'), path: '/download'},
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
                fixed z-sticky px-4 py-4 mx-4 my-2 rounded-2xl z-50
                transition-all duration-300 backdrop-blur-xl
                ${isScrolled
                    ? 'bg-black/20 shadow-xl border border-white/10'
                    : 'bg-white/5 border border-white/5'
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
                <NavLink to="/" className="text-2xl font-bold text-foreground flex items-center group">
                    <img
                        src="/logo.png"
                        alt="Transat Logo"
                        className="w-8 h-8 mr-3 transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="gradient-text">{t('app.title')}</span>
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({isActive}) =>
                                        isActive
                                            ? "text-primary font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary"
                                            : "text-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-primary after:to-secondary hover:after:w-full after:transition-all after:duration-300"
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
                    className="md:hidden text-foreground p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
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
                <div className="md:hidden mt-6 pt-6 border-t border-white/10 animate-fadeIn">
                    <ul className="space-y-4">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({isActive}) =>
                                        isActive
                                            ? "text-primary font-semibold block py-3 px-4 rounded-lg bg-white/10 backdrop-blur-sm"
                                            : "text-foreground hover:text-primary transition-colors block py-3 px-4 rounded-lg hover:bg-white/5"
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