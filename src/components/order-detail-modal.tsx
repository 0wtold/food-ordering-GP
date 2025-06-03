import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Tabs, Tab } from "@heroui/react";
import { useMenu } from "../context/menu-context";
import { Order, DayOfWeek, DAYS_OF_WEEK, DAY_LABELS } from "../types";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { getMenuItemById } = useMenu();
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>("monday");
  
  const calculateDayTotal = (day: DayOfWeek) => {
    return Object.entries(order.weekOrder[day]).reduce((total, [itemId, quantity]) => {
      const menuItem = getMenuItemById(itemId);
      return total + (menuItem ? menuItem.price * quantity : 0);
    }, 0);
  };
  
  const calculateWeekTotal = () => {
    return DAYS_OF_WEEK.reduce((total, day) => {
      return total + calculateDayTotal(day);
    }, 0);
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Modal isOpen onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div>Order Details for {order.employeeName}</div>
          <div className="text-small text-default-500">
            Ordered on: {formatDate(order.timestamp)}
          </div>
        </ModalHeader>
        <ModalBody>
          <Tabs 
            aria-label="Days of the week" 
            selectedKey={selectedDay}
            onSelectionChange={(key) => setSelectedDay(key as DayOfWeek)}
          >
            {DAYS_OF_WEEK.map(day => (
              <Tab key={day} title={DAY_LABELS[day]}>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{DAY_LABELS[day]} Order</h3>
                  
                  {Object.entries(order.weekOrder[day]).length === 0 || 
                   !Object.entries(order.weekOrder[day]).some(([_, qty]) => qty > 0) ? (
                    <p className="text-default-500">No items ordered for this day</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(order.weekOrder[day])
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([itemId, quantity]) => {
                          const menuItem = getMenuItemById(itemId);
                          if (!menuItem) return null;
                          
                          return (
                            <div key={itemId} className="flex justify-between">
                              <div>
                                <p className="font-medium">{menuItem.name} × {quantity}</p>
                                <p className="text-small text-default-500">{menuItem.description}</p>
                              </div>
                              <p>${(menuItem.price * quantity).toFixed(2)}</p>
                            </div>
                          );
                        })}
                      
                      <div className="border-t border-divider pt-2 font-medium flex justify-between">
                        <span>Day Total</span>
                        <span>${calculateDayTotal(day).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Tab>
            ))}
          </Tabs>
          
          <div className="mt-6 bg-content2 p-4 rounded-medium">
            <h3 className="font-medium mb-2">Week Summary</h3>
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="flex justify-between text-small">
                <span>{DAY_LABELS[day]}</span>
                <span>${calculateDayTotal(day).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-divider mt-2 pt-2 font-semibold flex justify-between">
              <span>Total</span>
              <span>${calculateWeekTotal().toFixed(2)}</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};