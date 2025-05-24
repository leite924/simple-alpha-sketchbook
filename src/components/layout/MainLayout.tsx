
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
