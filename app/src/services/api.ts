const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async getData() {
    const response = await fetch(`${API_URL}/metrics`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  },
};
