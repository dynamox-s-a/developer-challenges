import Header from "@/components/Header";
import Cover from "@/components/Sections/Cover";
import Sensors from "@/components/Sections/Sensors";
import Contact from "@/components/Sections/Contact";
import React, { useEffect, useRef } from "react";

export default function Home() {
  const sensorsRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      <Header pageRef={[sensorsRef, contactRef]} />
      <Cover />
      <Sensors ref={sensorsRef} />
      <Contact ref={contactRef} />
    </>
  );
}
