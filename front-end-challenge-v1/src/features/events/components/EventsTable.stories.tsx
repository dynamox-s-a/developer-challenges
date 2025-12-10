import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import type { Event } from "@/types";
import { EventsTable } from "./EventsTable";

// Create future and past dates
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 30);

const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 30);

const sampleEvents: Event[] = [
  {
    id: "1",
    name: "Tech Conference 2025",
    dateTime: futureDate.toISOString(),
    location: "San Francisco Convention Center",
    description:
      "Join us for the biggest tech conference of the year with industry leaders and innovators.",
    category: "Conference",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "React Workshop",
    dateTime: new Date(
      futureDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    location: "Online",
    description:
      "Hands-on workshop covering advanced React patterns and best practices for modern web development.",
    category: "Workshop",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "AI in Healthcare Webinar",
    dateTime: pastDate.toISOString(),
    location: "Virtual Event",
    description:
      "Explore the revolutionary impact of artificial intelligence in healthcare with expert panelists.",
    category: "Webinar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Startup Founders Meetup",
    dateTime: new Date(
      pastDate.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    location: "Downtown Innovation Hub, NYC",
    description:
      "Connect with fellow entrepreneurs and startup founders at this networking event.",
    category: "Networking",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Team Building Event",
    dateTime: new Date(
      futureDate.getTime() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    location: "Central Park, NYC",
    description:
      "An outdoor team building event with various activities designed to strengthen team bonds.",
    category: "Other",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const meta: Meta<typeof EventsTable> = {
  title: "Events/EventsTable",
  component: EventsTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    events: sampleEvents,
    sortField: "dateTime",
    sortOrder: "asc",
    onSortChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: sampleEvents,
  },
};

export const SortedByName: Story = {
  args: {
    events: sampleEvents,
    sortField: "name",
  },
};

export const SortedDescending: Story = {
  args: {
    events: sampleEvents,
    sortOrder: "desc",
  },
};

export const SingleEvent: Story = {
  args: {
    events: [sampleEvents[0]],
  },
};

export const EmptyTable: Story = {
  args: {
    events: [],
  },
};

export const ManyEvents: Story = {
  args: {
    events: [
      ...sampleEvents,
      ...sampleEvents.map((e, i) => ({
        ...e,
        id: `${e.id}-copy-${i}`,
        name: `${e.name} (Copy ${i + 1})`,
      })),
    ],
  },
};

export const AllUpcoming: Story = {
  args: {
    events: sampleEvents
      .filter(
        (e) =>
          e.category === "Conference" ||
          e.category === "Workshop" ||
          e.category === "Other",
      )
      .map((e) => ({
        ...e,
        dateTime: new Date(
          futureDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      })),
  },
};

export const AllPast: Story = {
  args: {
    events: sampleEvents.map((e) => ({
      ...e,
      dateTime: new Date(
        pastDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    })),
  },
};
