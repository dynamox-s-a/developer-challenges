import React from "react";
import { NextSeo } from "next-seo";

// eslint-disable-next-line react/prop-types
export default function Page({ title, description, children, path }:any) {
  const url = `https://lavaflex.com.br${path}`;
  return (
    <div>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          url,
          title,
        }}
      />
      {children}
      <link rel = "canonical" href = "https://lavaflex.com.br" /> 
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </div>
  );
}

