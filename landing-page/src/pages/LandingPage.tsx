import React from 'react';
import './LandingPage.styles.scss';
import { contentImageSections } from './LandingPage.data';
import { ContentImageSection } from '@/components/ContentImageSection/index';

const LandingPage: React.FC = () => {
	return (
		<div className="container">
            {contentImageSections.map((section, index) => (
                <ContentImageSection
                    key={index}
                    imageSrc={section.imageSrc}
                    imageAlt={section.imageAlt}
                    icon={section.icon}
                    titleHighlight={section.titleHighlight}
                    title={section.title}
                    items={section.items}
                    textContent={section.textContent}
                    linkLabel={section.linkLabel}
                    linkUrl={section.linkUrl}
                    reverse={section.reverse} />
            ))}
		</div>
	);
};

export default LandingPage;