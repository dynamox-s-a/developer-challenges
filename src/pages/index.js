import Header from "@/components/Header/index";
import Cover from "@/components/Sections/Cover/index";
import Sensors from "@/components/Sections/Sensors/index";
import Contact from "@/components/Sections/Contact/index";
import React, { useRef } from "react";

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
