import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { EmployeeOrderForm } from "./components/employee-order-form";
import { ManagerView } from "./components/manager-view";
import { MenuEditor } from "./components/menu-editor";
import { OrderProvider } from "./context/order-context";
import { MenuProvider } from "./context/menu-context";

export default function App() {
  const [selected, setSelected] = React.useState("order");

  return (
    <MenuProvider>
      <OrderProvider>
        <div className="min-h-screen bg-background">
          <header className="bg-content1 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-foreground">Team Food Ordering System</h1>
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
}