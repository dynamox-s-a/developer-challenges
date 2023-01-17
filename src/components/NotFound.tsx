import React from "react";

const NotFound = () => {
  return (
    <section className="flex items-center text-white max-w-md mx-auto">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Desculpe, não existe produto criado
          </p>
          <p className="mt-4 mb-8 dark:text-gray-400">
            Mas não se preocupe, se quiser poderá adicionar no botão acima.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
