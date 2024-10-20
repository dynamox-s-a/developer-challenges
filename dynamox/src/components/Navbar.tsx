import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = async () => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">User</span>
          <span className="text-[10px] text-gray-500 text-right">admin</span>
        </div>
        <AccountCircleIcon sx={{ fontSize: 40 }} />
      </div>
    </div>
  );
};

export default Navbar;
