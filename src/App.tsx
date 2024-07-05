import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { CenteredLayout, MainLayout } from "./components";
import { SignInPage } from "./pages";
import { ExpenseDashboard } from "./pages/expenses/dashboard";
import NotFoundPage from "./pages/not-found";
import TenantList from "./pages/tenants/list";
import { ManageTenant } from "./pages/tenants/manage-tenant";
import CreateExpense from "./pages/expenses/create";
import SimpleCreateExpense from "./pages/expenses/simple-create";
import ExpenseList from "./pages/expenses/list";



const App: React.FC = () => {
  const {isLoaded, isSignedIn} = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
   <BrowserRouter>
      <Routes>
        {isSignedIn && (
          <Route element={<MainLayout><Outlet/></MainLayout>}>
            <Route path="/dashboard" element={<ExpenseDashboard/>} />
            <Route path="/tenants" element={<TenantList/>} />
          </Route>
        )}
        <Route path="/manage-tenant" element={<ManageTenant/>} />
        <Route path="/add-expense" element={<SimpleCreateExpense/>} />
        <Route path="/history" element={<ExpenseList/>} />
        
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignInPage />} />
        <Route path="/" element={isSignedIn? <Navigate to="/dashboard" /> : <Navigate to="/sign-in" />}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
   </BrowserRouter>
  );
}

export default App;