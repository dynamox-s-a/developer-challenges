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
                <div className="marginBlock">
                    {contentSections.map((section, index) => (
                        <ContentSection key={index} {...section} />
                    ))}
                </div>
                <div className="container--contentImageSections">
                    {contentImageSections.map((section, index) => (
                        <ContentImageSection key={index} {...section} />
                    ))}
                </div>
            </main>
            <Footer />
        </>
	);
};

export default LandingPage;