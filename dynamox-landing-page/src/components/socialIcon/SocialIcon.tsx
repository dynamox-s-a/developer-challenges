import "./socialIcon.css";

interface SocialSocialProps {
  link: string;
  icon: string;
}

export function SocialIcon({ link, icon }: SocialSocialProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="social-icon"
    >
      <img src={icon} />
    </a>
  );
}
