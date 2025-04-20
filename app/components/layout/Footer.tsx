import React from 'react';
import {useTranslation} from 'react-i18next';
import {Container, Text} from '../ui';

export interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({className = ''}) => {
    const {t} = useTranslation();
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {label: t('footer.links.about'), href: '#'},
        {label: t('footer.links.privacy'), href: '#'},
        {label: t('footer.links.terms'), href: '#'},
        {label: t('footer.links.contact'), href: '#'},
    ];

    return (
        <footer className={`mt-12 p-2 md:p-10 md:pb-0 pb-0 ${className}`}>
            <Container>
                <div className="flex items-end px-2 md:px-10">
                    <img
                        src="https://transat.destimt.fr/api/data/New_Project_943f029163e65ef3.png"
                        className="max-h-52 mr-4"
                        alt="footer logo"
                    />
                    <div className="w-full">

                        <div
                            className="flex flex-row gap-3 items-baseline md:justify-evenly pb-2 flex-wrap align-baseline">
                            <div className="mb-4">
                                <Text as="h3" size="lg" weight="bold" className="md:mb-4">
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

                            <div className="mb-4">
                                <Text as="h3" size="lg" weight="bold" className="md:mb-4">
                                    Contact
                                </Text>
                                <address className="not-italic text-sm">
                                    <Text color="muted" size="sm" className="mb-2">IMT Atlantique</Text>
                                    <Text color="muted" size="sm" className="mb-2">Campus de Nantes</Text>
                                    <Text color="muted" size="sm" className="mb-2">4 Rue Alfred Kastler</Text>
                                    <Text color="muted" size="sm" className="mb-2">44300 Nantes, France</Text>
                                </address>
                            </div>

                            <div className="mb-4">
                                <Text as="h3" size="lg" weight="bold" className="md:mb-4">
                                    Download the app
                                </Text>
                                <div className="flex space-x-4 flex-col">
                                    <a
                                        href="https://apps.apple.com/fr/app/transat/id6602883801"
                                        aria-label="{social.name} "
                                        className="text-foreground hover:text-primary transition-colors"
                                    >
                                        <img
                                            src="https://icon-library.com/images/app-store-icon-png/app-store-icon-png-14.jpg"
                                            alt="App Store" className="w-36 object-contain"/>
                                    </a>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=com.Transat"
                                        aria-label="{social.name} "
                                        className="text-foreground hover:text-primary transition-colors"
                                    >
                                        <img
                                            src="https://icon-library.com/images/app-store-icon-png/app-store-icon-png-5.jpg"
                                            alt="App Store" className="w-36 object-contain"/>
                                    </a>

                                </div>
                            </div>
                        </div>

                        <div className="flex items-center pl-10 pr-10 flex-col border-t pt-2 border-amber-50/10 mb-4">
                            <Text color="muted" size="sm" className="text-center">
                                {t('footer.copyright', {year: currentYear})} <span role="img"
                                                                                   aria-label="Sun emoji">☀️</span>
                            </Text>
                            <Text color="muted" size="xs" className="mt-2">
                                {t('footer.allRightsReserved')}
                            </Text>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer; 