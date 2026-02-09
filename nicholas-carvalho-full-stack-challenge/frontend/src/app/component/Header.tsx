import { Box, Button } from "@mui/material";
import Image from "next/image";
import { LoginService } from "../api/login";
import { useRouter } from "next/navigation";

export default function Header() {
    const loginService = new LoginService();
    const router = useRouter();
    return (
        <Box width="100%" minHeight="10vh" sx={{ display: "flex", justifyContent: "space-between", p: 2, alignItems: "center", backgroundColor: 'primary.main', color: 'white' }}>
            <Image src={"/logo/Dynamox_cwhite.svg"} alt="logo" width={100} height={100} />
            <Button variant="contained" color="secondary" onClick={() => loginService.logout().then(() => router.push("/"))}>Logout</Button>
        </Box>
    );
}