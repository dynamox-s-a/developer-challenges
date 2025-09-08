import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/domain/data/reducer";
import ChartsGroup from "@/ui/pages/components/charts/ChartsGroup";

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { data: dataReducer } });
  return render(<Provider store={store}>{ui}</Provider>);
}

it("renderiza os três gráficos (Aceleração, Velocidade, Temperatura)", () => {
  renderWithStore(<ChartsGroup />);

  expect(screen.getByText(/Aceleração/i)).toBeInTheDocument();
  expect(screen.getByText(/Velocidade/i)).toBeInTheDocument();
  expect(screen.getByText(/Temperatura/i)).toBeInTheDocument();
});
