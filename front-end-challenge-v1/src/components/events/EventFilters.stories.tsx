import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import type { EventFilters as EventFiltersType } from "@/types";
import { EventFilters } from "./EventFilters";

const defaultFilters: EventFiltersType = {
  search: "",
  category: "",
  sortField: "dateTime",
  sortOrder: "asc",
};

const meta: Meta<typeof EventFilters> = {
  title: "Events/EventFilters",
  component: EventFilters,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    filters: defaultFilters,
    onSearchChange: fn(),
    onCategoryChange: fn(),
    onSortFieldChange: fn(),
    onSortOrderToggle: fn(),
    onReset: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "800px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: defaultFilters,
  },
};

export const WithSearchTerm: Story = {
  args: {
    filters: {
      ...defaultFilters,
      search: "Conference",
    },
  },
};

export const WithCategorySelected: Story = {
  args: {
    filters: {
      ...defaultFilters,
      category: "Workshop",
    },
  },
};

export const SortedByName: Story = {
  args: {
    filters: {
      ...defaultFilters,
      sortField: "name",
    },
  },
};

export const SortDescending: Story = {
  args: {
    filters: {
      ...defaultFilters,
      sortOrder: "desc",
    },
  },
};

export const AllFiltersActive: Story = {
  args: {
    filters: {
      search: "Tech",
      category: "Conference",
      sortField: "name",
      sortOrder: "desc",
    },
  },
};

export const SearchAndCategory: Story = {
  args: {
    filters: {
      ...defaultFilters,
      search: "React",
      category: "Workshop",
    },
  },
};
