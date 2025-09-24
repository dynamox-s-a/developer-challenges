import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import EventFilters from "./EventFilters";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

const meta: Meta<typeof EventFilters> = {
  title: "UI/Inputs/EventFilters",
  component: EventFilters,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Componente de filtros para eventos com busca, categoria, localização e ordenação.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    searchTerm: {
      control: "text",
      description: "Termo de busca atual",
    },
    categoryFilter: {
      control: "text",
      description: "Categoria selecionada para filtro",
    },
    locationFilter: {
      control: "text",
      description: "Local selecionado para filtro",
    },
    sortBy: {
      control: { type: "radio" },
      options: ["date", "name"],
      description: "Campo para ordenação",
    },
    sortOrder: {
      control: { type: "radio" },
      options: ["asc", "desc"],
      description: "Ordem da ordenação",
    },
    categories: {
      control: "object",
      description: "Lista de categorias disponíveis",
    },
    onSearchChange: {
      description: "Callback para mudança na busca",
    },
    onCategoryChange: {
      description: "Callback para mudança na categoria",
    },
    onLocationChange: {
      description: "Callback para mudança na localização",
    },
    onSortByChange: {
      description: "Callback para mudança no campo de ordenação",
    },
    onSortOrderChange: {
      description: "Callback para mudança na ordem",
    },
    onClearFilters: {
      description: "Callback para limpar todos os filtros",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCategories = [
  "workshop",
  "conference",
  "webinar",
  "meetup",
  "seminar",
  "training",
  "networking",
  "other",
];

export const Default: Story = {
  args: {
    searchTerm: "",
    categoryFilter: "",
    locationFilter: "",
    sortBy: "date",
    sortOrder: "desc",
    categories: defaultCategories,
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const WithActiveFilters: Story = {
  args: {
    searchTerm: "React",
    categoryFilter: "workshop",
    locationFilter: "São Paulo",
    sortBy: "name",
    sortOrder: "asc",
    categories: defaultCategories,
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const EmptyCategories: Story = {
  args: {
    searchTerm: "",
    categoryFilter: "",
    locationFilter: "",
    sortBy: "date",
    sortOrder: "desc",
    categories: [],
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const SortByDate: Story = {
  args: {
    searchTerm: "",
    categoryFilter: "",
    locationFilter: "",
    sortBy: "date",
    sortOrder: "asc",
    categories: defaultCategories,
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const SortByName: Story = {
  args: {
    searchTerm: "",
    categoryFilter: "",
    locationFilter: "",
    sortBy: "name",
    sortOrder: "desc",
    categories: defaultCategories,
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "name">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const handleClearFilters = () => {
      setSearchTerm("");
      setCategoryFilter("");
      setLocationFilter("");
      setSortBy("date");
      setSortOrder("desc");
    };

    const getFilterSummary = () => {
      const filters = [];
      if (searchTerm) filters.push(`Busca: "${searchTerm}"`);
      if (categoryFilter) filters.push(`Categoria: ${categoryFilter}`);
      if (locationFilter) filters.push(`Local: "${locationFilter}"`);
      filters.push(
        `Ordenação: ${sortBy} (${
          sortOrder === "asc" ? "crescente" : "decrescente"
        })`
      );
      return filters;
    };

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          💡 Exemplo Interativo
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Experimente diferentes filtros e veja o resumo das configurações
          abaixo:
        </Typography>

        <EventFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          locationFilter={locationFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          categories={defaultCategories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
          onLocationChange={setLocationFilter}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
          onClearFilters={handleClearFilters}
        />

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Estado Atual dos Filtros
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {getFilterSummary().map((filter, index) => (
                <Typography key={index} variant="body2" color="text.secondary">
                  • {filter}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  },
};

export const ResponsiveLayout: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState("JavaScript");
    const [categoryFilter, setCategoryFilter] = useState("workshop");
    const [locationFilter, setLocationFilter] = useState("Online");
    const [sortBy, setSortBy] = useState<"date" | "name">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          📱 Layout Responsivo
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Os filtros se adaptam automaticamente ao tamanho da tela:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Desktop View */}
          <Box>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Desktop (Tela Ampla)
            </Typography>
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
              <EventFilters
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                locationFilter={locationFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                categories={defaultCategories}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategoryFilter}
                onLocationChange={setLocationFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onClearFilters={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setLocationFilter("");
                  setSortBy("date");
                  setSortOrder("desc");
                }}
              />
            </Box>
          </Box>

          {/* Mobile Simulation */}
          <Box>
            <Typography variant="subtitle1" gutterBottom color="secondary">
              Mobile (Tela Estreita)
            </Typography>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                p: 2,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <EventFilters
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                locationFilter={locationFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                categories={defaultCategories}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategoryFilter}
                onLocationChange={setLocationFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onClearFilters={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setLocationFilter("");
                  setSortBy("date");
                  setSortOrder("desc");
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
};

export const DifferentCategories: Story = {
  args: {
    searchTerm: "",
    categoryFilter: "",
    locationFilter: "",
    sortBy: "date",
    sortOrder: "desc",
    categories: [
      "tech-talk",
      "bootcamp",
      "hackathon",
      "conference",
      "workshop",
    ],
    onSearchChange: (value) => console.log("Search changed:", value),
    onCategoryChange: (value) => console.log("Category changed:", value),
    onLocationChange: (value) => console.log("Location changed:", value),
    onSortByChange: (value) => console.log("Sort by changed:", value),
    onSortOrderChange: (value) => console.log("Sort order changed:", value),
    onClearFilters: () => console.log("Clear filters clicked"),
  },
};

export const AllVariations: Story = {
  render: () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h5" gutterBottom>
        🎨 Variações do EventFilters
      </Typography>

      {/* Estado Limpo */}
      <Box>
        <Typography variant="h6" gutterBottom color="primary">
          Estado Limpo (Sem Filtros)
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <EventFilters
              searchTerm=""
              categoryFilter=""
              locationFilter=""
              sortBy="date"
              sortOrder="desc"
              categories={defaultCategories}
              onSearchChange={() => {}}
              onCategoryChange={() => {}}
              onLocationChange={() => {}}
              onSortByChange={() => {}}
              onSortOrderChange={() => {}}
              onClearFilters={() => {}}
            />
          </CardContent>
        </Card>
      </Box>

      <Divider />

      {/* Estado com Filtros Ativos */}
      <Box>
        <Typography variant="h6" gutterBottom color="secondary">
          Estado com Filtros Ativos
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <EventFilters
              searchTerm="React Workshop"
              categoryFilter="workshop"
              locationFilter="São Paulo"
              sortBy="name"
              sortOrder="asc"
              categories={defaultCategories}
              onSearchChange={() => {}}
              onCategoryChange={() => {}}
              onLocationChange={() => {}}
              onSortByChange={() => {}}
              onSortOrderChange={() => {}}
              onClearFilters={() => {}}
            />
          </CardContent>
        </Card>
      </Box>

      <Divider />

      {/* Categorias Customizadas */}
      <Box>
        <Typography variant="h6" gutterBottom color="success.main">
          Categorias Customizadas
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <EventFilters
              searchTerm=""
              categoryFilter=""
              locationFilter=""
              sortBy="date"
              sortOrder="desc"
              categories={[
                "ai-ml",
                "blockchain",
                "cloud-computing",
                "mobile-dev",
                "game-dev",
              ]}
              onSearchChange={() => {}}
              onCategoryChange={() => {}}
              onLocationChange={() => {}}
              onSortByChange={() => {}}
              onSortOrderChange={() => {}}
              onClearFilters={() => {}}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  ),
};
