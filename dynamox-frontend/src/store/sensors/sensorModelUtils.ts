export const toDbModel = (model: string): string => {
  return model === "HF_Plus" ? "HF+" : model;
};

export const fromDbModel = (model: string): string => {
  return model === "HF+" ? "HF_Plus" : model;
};
