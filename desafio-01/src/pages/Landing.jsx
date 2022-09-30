import Header from "../components/Header";
import SensorSection from "../components/SensorSection";
import SolutionSection from "../components/SolutionSection";

function Landing() {
  return (
    <div className="App">
      <Header />
      <SolutionSection />
      <SensorSection />
    </div>
  );
}

export default Landing;
