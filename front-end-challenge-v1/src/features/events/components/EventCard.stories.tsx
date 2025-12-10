import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Event } from "@/types";
import { EventCard } from "./EventCard";

// Create future date for upcoming events
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 30);

// Create past date for past events
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 30);

const baseEvent: Event = {
  id: "1",
  name: "Tech Conference 2025",
  dateTime: futureDate.toISOString(),
  location: "San Francisco Convention Center, CA",
  description:
    "Join us for the biggest tech conference of the year! Learn from industry leaders, network with peers, and discover the latest innovations in technology.",
  category: "Conference",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta: Meta<typeof EventCard> = {
  title: "Events/EventCard",
  component: EventCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    event: {
      description: "The event object to display",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "350px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UpcomingConference: Story = {
  args: {
    event: baseEvent,
  },
};

export const PastConference: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "2",
      name: "Past Tech Summit",
      dateTime: pastDate.toISOString(),
    },
  },
};

export const Workshop: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "3",
      name: "React Workshop",
      category: "Workshop",
      location: "Online",
      description:
        "A hands-on workshop where you'll learn React from scratch. Build real-world applications and master modern React patterns and best practices.",
    },
  },
};

export const Webinar: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "4",
      name: "AI in Healthcare Webinar",
      category: "Webinar",
      location: "Virtual Event",
      description:
        "Explore the revolutionary impact of artificial intelligence in healthcare. Join experts as they discuss the latest breakthroughs and future possibilities.",
    },
  },
};

export const Networking: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "5",
      name: "Startup Founders Meetup",
      category: "Networking",
      location: "Downtown Innovation Hub, NYC",
      description:
        "Connect with fellow entrepreneurs and startup founders. Share experiences, find potential co-founders, and build valuable professional relationships.",
    },
  },
};

export const Other: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "6",
      name: "Team Building Event",
      category: "Other",
      location: "Central Park, NYC",
      description:
        "An outdoor team building event with various activities designed to strengthen team bonds and improve collaboration among colleagues.",
    },
  },
};

export const LongDescription: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "7",
      name: "Annual Developer Conference",
      description:
        "This comprehensive three-day conference covers everything from frontend development to backend architecture, DevOps, cloud computing, machine learning, and more. With over 100 sessions, 50+ speakers from top tech companies, hands-on workshops, and networking events, this is the must-attend event for software professionals. You'll gain practical skills, discover emerging trends, and connect with a global community of developers passionate about creating amazing software.",
    },
  },
};

export const ShortTitle: Story = {
  args: {
    event: {
      ...baseEvent,
      id: "8",
      name: "Meetup",
      description: "A quick casual meetup for tech enthusiasts in the area.",
    },
  },
};
