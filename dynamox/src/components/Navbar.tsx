import { UserButton } from "@clerk/nextjs";
import { AccountCircle } from "@mui/icons-material";

const Navbar = async () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">admin</span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
