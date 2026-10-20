import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { machine, seriesDto } from "../fixtures";
import { setupStore } from "../../app/store";
import DataPage from "../../app/pages/DataPage";

function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => setupStore());
  return <Provider store={store}>{children}</Provider>;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

function stubApi(respond: (path: string) => Promise<Response>) {
  window.fetch = (input) => respond(String(input));
}

const meta = {
  title: "Pages/DataPage",
  component: DataPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <StoreProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </StoreProvider>
    ),
  ],
} satisfies Meta<typeof DataPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  loaders: [
    () =>
      stubApi(async (path) =>
        json(path.endsWith("/machine") ? machine : seriesDto),
      ),
  ],
};

export const Loading: Story = {
  loaders: [() => stubApi(() => new Promise(() => {}))],
};

export const ServerError: Story = {
  loaders: [() => stubApi(async () => json({}, 500))],
};

export const Empty: Story = {
  loaders: [
    () =>
      stubApi(async (path) =>
        json(
          path.endsWith("/machine")
            ? machine
            : seriesDto.map((s) => ({ ...s, data: [] })),
        ),
      ),
  ],
};
