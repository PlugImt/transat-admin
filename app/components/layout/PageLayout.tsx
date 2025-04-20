import React from 'react';
import Header from './Header';
import Footer from './Footer';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  withHeader?: boolean;
  withFooter?: boolean;
  headerProps?: React.ComponentProps<typeof Header>;
  footerProps?: React.ComponentProps<typeof Footer>;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = '',
  withHeader = true,
  withFooter = true,
  headerProps,
  footerProps,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {withHeader && <Header {...headerProps} />}
      
      {/* Account for the fixed header height plus margin for floating navbar */}
      <main className={`flex-grow ${withHeader ? 'pt-24' : ''} ${className}`}>
        {children}
      </main>
      
      {withFooter && <Footer {...footerProps} />}
    </div>
  );
};

export default PageLayout; 