import './LandingPage.styles.scss';

import { contentSections } from './LandingPage.data';
import { contentImageSections } from './LandingPage.data';

import { ContentSection } from '@/components/ContentSection';
import { ContentImageSection } from '@/components/ContentImageSection/index';
import { Footer } from '@/components/Footer/Footer';

const LandingPage = () => {
	return (
        <>
            <main className="container">
                {contentSections.map((section, index) => (
                    <ContentSection key={index} {...section} />
                ))}
                {contentImageSections.map((section, index) => (
                    <ContentImageSection key={index} {...section} />
                ))}
            </main>
            <Footer />
        </>
	);
};

export default LandingPage;