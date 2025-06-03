import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { MenuItem, Order, WeekOrder } from "../types";

// Menu Items Collection
const menuItemsCollection = collection(db, "menuItems");

export const saveMenuItems = async (menuItems: MenuItem[]) => {
  try {
    // First clear the collection
    const snapshot = await getDocs(menuItemsCollection);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then add all items
    const addPromises = menuItems.map(item => addDoc(menuItemsCollection, item));
    await Promise.all(addPromises);
    
    return true;
  } catch (error) {
    console.error("Error saving menu items:", error);
    return false;
  }
};

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const snapshot = await getDocs(menuItemsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

// Orders Collection
const ordersCollection = collection(db, "orders");

export const saveOrder = async (employeeName: string, weekOrder: WeekOrder, userId: string): Promise<string | null> => {
  try {
    const orderData = {
      employeeName,
      weekOrder,
      userId,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(ordersCollection, orderData);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    return null;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        employeeName: data.employeeName,
        weekOrder: data.weekOrder,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toMillis() 
          : Date.now()
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(ordersCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        employeeName: data.employeeName,
        weekOrder: data.weekOrder,
        timestamp: data.timestamp instanceof Timestamp 
          ? data.timestamp.toMillis() 
          : Date.now()
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
};
