import Footer from "../components/Footer";
import Header from "../components/Header";
import SensorSection from "../components/SensorSection";
import SolutionSection from "../components/SolutionSection";

function Landing() {
  return (
    <div className="App">
      <Header />
      <SolutionSection />
      <SensorSection />
      <Footer />
    </div>
  );
}

export default Landing;
