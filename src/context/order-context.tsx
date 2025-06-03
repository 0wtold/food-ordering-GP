import React from "react";
import { Order, WeekOrder, DayOrder } from "../types";
import { fetchOrders, saveOrder, deleteOrder as firebaseDeleteOrder } from "../services/firebase-service";
import { useAuth } from "./auth-context";

interface OrderContextType {
  orders: Order[];
  addOrder: (employeeName: string, weekOrder: WeekOrder) => void;
  getOrdersByEmployee: (employeeName: string) => Order[];
  getAllOrders: () => Order[];
  deleteOrder: (orderId: string) => void;
  loading: boolean;
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
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { currentUser } = useAuth();

  // Load orders from Firebase on component mount and when user changes
  React.useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    };
    
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser]);

  const addOrder = async (employeeName: string, weekOrder: WeekOrder) => {
    if (!currentUser) return;
    
    try {
      const orderId = await saveOrder(employeeName, weekOrder, currentUser.uid);
      
      if (orderId) {
        const newOrder: Order = {
          id: orderId,
          employeeName,
          weekOrder,
          timestamp: Date.now()
        };
        
        setOrders([...orders, newOrder]);
      }
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const getOrdersByEmployee = (employeeName: string) => {
    return orders.filter(order => order.employeeName === employeeName);
  };

  const getAllOrders = () => {
    return orders;
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const success = await firebaseDeleteOrder(orderId);
      
      if (success) {
        setOrders(orders.filter(order => order.id !== orderId));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      getOrdersByEmployee, 
      getAllOrders,
      deleteOrder,
      loading
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