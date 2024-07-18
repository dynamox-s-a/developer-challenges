import {DrawerMenu} from "@/src/components/drawer-menu";

export default function PrivateLayout({children}: { children: React.ReactNode }) {

    return (
        <html lang="en">
        <body>
        <DrawerMenu>
            {children}
        </DrawerMenu>
        </body>
        </html>
    );
}
