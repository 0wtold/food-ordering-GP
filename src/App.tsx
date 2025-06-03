import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { EmployeeOrderForm } from "./components/employee-order-form";
import { ManagerView } from "./components/manager-view";
import { MenuEditor } from "./components/menu-editor";
import { OrderProvider } from "./context/order-context";
import { MenuProvider } from "./context/menu-context";
import { AuthProvider } from "./context/auth-context";
import { LoginForm } from "./components/login-form";
import { useAuth } from "./context/auth-context";

const AuthenticatedApp: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [selected, setSelected] = React.useState("order");

  return (
    <MenuProvider>
      <OrderProvider>
        <div className="min-h-screen bg-background">
          <header className="bg-content1 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-foreground">Team Food Ordering System</h1>
              {currentUser && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-default-600">
                    Logged in as {currentUser.displayName || currentUser.email}
                  </span>
                  <button 
                    onClick={() => logout()} 
                    className="text-sm text-danger hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Tabs 
              aria-label="Options" 
              selectedKey={selected} 
              onSelectionChange={setSelected}
              className="mb-6"
            >
              <Tab key="order" title="Place Order">
                <EmployeeOrderForm />
              </Tab>
              <Tab key="manager" title="Manager View">
                <ManagerView />
              </Tab>
              <Tab key="menu" title="Menu Editor">
                <MenuEditor />
              </Tab>
            </Tabs>
          </main>
        </div>
      </OrderProvider>
    </MenuProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return currentUser ? <AuthenticatedApp /> : <LoginForm />;
};