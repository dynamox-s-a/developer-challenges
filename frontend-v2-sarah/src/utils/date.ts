export const timestampMsFormatter = (isoDate: string): number => {
  return new Date(isoDate).getTime();
};
