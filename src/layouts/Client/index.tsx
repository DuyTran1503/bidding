import Banner from "@/Client/Home/components/Banner";
import NewNews from "@/Client/Home/components/NewNews";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
    return (
        <>
            <Header />
            <div className="max-w-screen-xl mx-4 xl:mx-auto">
                <Banner />
                <NewNews />
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default ClientLayout;
