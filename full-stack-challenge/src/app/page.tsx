import withAuth from "@/components/withAuth";
import MachineList from "@/components/machines/MachineList";

const HomePage = () => {
  return (
    <div>
      <h1>Bem-vindo à Home!</h1>
      <MachineList />
    </div>
  );
};

export default withAuth(HomePage);
