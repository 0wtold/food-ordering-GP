import React from "react";
import { MenuItem } from "../types";
import { fetchMenuItems, saveMenuItems } from "../services/firebase-service";

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Chicken Salad",
    price: 12.99,
    description: "Fresh salad with grilled chicken, mixed greens, and balsamic vinaigrette",
    category: "Salads"
  },
  {
    id: "2",
    name: "Vegetable Pasta",
    price: 10.99,
    description: "Penne pasta with seasonal vegetables and tomato sauce",
    category: "Pasta"
  },
  {
    id: "3",
    name: "Beef Burger",
    price: 14.99,
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    category: "Burgers"
  },
  {
    id: "4",
    name: "Margherita Pizza",
    price: 13.99,
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    category: "Pizza"
  },
  {
    id: "5",
    name: "Chicken Wrap",
    price: 9.99,
    description: "Grilled chicken with vegetables and sauce in a tortilla wrap",
    category: "Wraps"
  },
  {
    id: "6",
    name: "Caesar Salad",
    price: 8.99,
    description: "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    category: "Salads"
  },
  {
    id: "7",
    name: "Vegetable Soup",
    price: 6.99,
    description: "Hearty soup with seasonal vegetables",
    category: "Soups"
  },
  {
    id: "8",
    name: "Fruit Salad",
    price: 7.99,
    description: "Mix of fresh seasonal fruits",
    category: "Desserts"
  }
];

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  getMenuItemById: (id: string) => MenuItem | undefined;
  getMenuItemsByCategory: () => Record<string, MenuItem[]>;
  loading: boolean;
}

const MenuContext = React.createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(() => {
    // Initialize with empty array, will load from Firebase
    return [];
  });
  const [loading, setLoading] = React.useState(true);

  // Load menu items from Firebase on component mount
  React.useEffect(() => {
    const loadMenuItems = async () => {
      setLoading(true);
      const items = await fetchMenuItems();
      
      if (items.length > 0) {
        setMenuItems(items);
      } else {
        // If no items in Firebase, use default items and save them
        setMenuItems(DEFAULT_MENU_ITEMS);
        await saveMenuItems(DEFAULT_MENU_ITEMS);
      }
      
      setLoading(false);
    };
    
    loadMenuItems();
  }, []);

  // Save to Firebase whenever menu items change
  React.useEffect(() => {
    if (!loading) {
      saveMenuItems(menuItems);
    }
  }, [menuItems, loading]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  const getMenuItemsByCategory = () => {
    return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  return (
    <MenuContext.Provider value={{ 
      menuItems, 
      addMenuItem, 
      updateMenuItem, 
      deleteMenuItem, 
      getMenuItemById,
      getMenuItemsByCategory,
      loading
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = React.useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};