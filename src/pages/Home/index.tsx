import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Sensors } from "../../components/Sensors";
import { Solution } from "../../components/Solution";
import { Container } from "./styles";

export function Home() {
  return (
    <Container>
      <Header />
      <Solution />
      <Sensors />
      <Footer />
    </Container>
  );
}
