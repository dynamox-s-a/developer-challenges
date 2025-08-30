import tw from "tailwind-styled-components";

// Wrapper principal
export const FormWrapper = tw.div`
  flex-grow flex items-center justify-center p-4
  min-h-[calc(100vh-64px)]
`;

// Card central
export const Card = tw.div`
  w-full max-w-md p-8 bg-white rounded-xl shadow-lg
`;

// Título
export const Title = tw.h1`
  text-3xl font-bold text-gray-800 mb-6 text-center
`;