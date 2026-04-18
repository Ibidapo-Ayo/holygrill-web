import BottomNav from "@/components/nav/BottomNav";
import PickUpWindow from "@/components/Customs/PickUpWindow";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { MenuProvider } from "../context/MenuContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MenuProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <PickUpWindow />
        <BottomNav />
        <Footer />
      </div>
    </MenuProvider>
  );
}
