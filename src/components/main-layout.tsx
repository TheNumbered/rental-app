import Header from "./header";



const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <>
        <Header />
        <main>
            {children}
        </main>
        </>
    );
}

export default MainLayout;