import React from "react";
import { Order, WeekOrder, DayOrder } from "../types";

interface OrderContextType {
  orders: Order[];
  addOrder: (employeeName: string, weekOrder: WeekOrder) => void;
  getOrdersByEmployee: (employeeName: string) => Order[];
  getAllOrders: () => Order[];
  deleteOrder: (orderId: string) => void; // Added new function
}

const OrderContext = React.createContext<OrderContextType | undefined>(undefined);

const EMPTY_DAY_ORDER: DayOrder = {};

const EMPTY_WEEK_ORDER: WeekOrder = {
  monday: EMPTY_DAY_ORDER,
  tuesday: EMPTY_DAY_ORDER,
  wednesday: EMPTY_DAY_ORDER,
  thursday: EMPTY_DAY_ORDER,
  friday: EMPTY_DAY_ORDER
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = React.useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (employeeName: string, weekOrder: WeekOrder) => {
    // Remove previous orders from the same employee
    const filteredOrders = orders.filter(order => order.employeeName !== employeeName);
    
    const newOrder: Order = {
      id: Date.now().toString(),
      employeeName,
      weekOrder,
      timestamp: Date.now()
    };
    
    setOrders([...filteredOrders, newOrder]);
  };

  const getOrdersByEmployee = (employeeName: string) => {
    return orders.filter(order => order.employeeName === employeeName);
  };

  const getAllOrders = () => {
    return orders;
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      getOrdersByEmployee, 
      getAllOrders,
      deleteOrder // Added new function to context 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};