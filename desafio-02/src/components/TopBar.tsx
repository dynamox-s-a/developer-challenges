import { Button } from "@mui/material";
import { useRouter } from "next/router";
import styles from '../styles/topbar.module.css';
import { signOut, useSession } from "next-auth/react";

const TopBar = () => {
    const router = useRouter();
    const session = useSession()
    console.log()

    const logOutButton = async () => {
        const result  = await signOut(
            {
                callbackUrl: '/'
            }
        );
    };

    return (
        <>
        <div className={styles.topbar}>
            <div className={styles.maxWidth}>
                <div className={styles.content}>
                    <div className={styles.logo}>
                        <img src="logo-dynamox.png" alt="" />
                    </div>
                    <div className={styles.userInfos}>
                    <h3>{session.data?.user?.email}</h3>
                    <Button variant="outlined" onClick={logOutButton} >LogOut</Button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default TopBar;