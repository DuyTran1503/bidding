import Banner from "@/Client/Home/components/Banner";
import NewNews from "@/Client/Home/components/NewNews";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useArchive } from "@/hooks/useArchive";
import { ISystemInitialState } from "@/services/store/system/system.slice";
import { getSystem } from "@/services/store/system/system.thunk";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
    const { state, dispatch } = useArchive<ISystemInitialState>("system");

    useEffect(() => {
        dispatch(getSystem({}));
    }, []);
    return (
        <>
            <Header  systemData={state.system}/>
            <div className="max-w-screen-xl mx-4 xl:mx-auto">
                <Banner />
                <NewNews />
                <Outlet />
            </div>
            <Footer systemData={state.system}/>
        </>
    );
};

export default ClientLayout;
