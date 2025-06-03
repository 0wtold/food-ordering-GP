import React from "react";
import { Card, CardBody, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useOrder } from "../context/order-context";
import { useMenu } from "../context/menu-context";
import { Order, DayOfWeek, DAYS_OF_WEEK, DAY_LABELS } from "../types";
import { OrderDetailModal } from "./order-detail-modal";

export const ManagerView: React.FC = () => {
  const { getAllOrders, deleteOrder } = useOrder();
  const { getMenuItemById } = useMenu();
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>("monday");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  
  const orders = getAllOrders();

  // Calculate total items for each day
  const calculateDailySummary = (day: DayOfWeek) => {
    const itemSummary: Record<string, number> = {};
    
    orders.forEach(order => {
      const dayOrder = order.weekOrder[day];
      Object.entries(dayOrder).forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          if (!itemSummary[itemId]) {
            itemSummary[itemId] = 0;
          }
          itemSummary[itemId] += quantity;
        }
      });
    });
    
    return itemSummary;
  };

  // Calculate total cost per employee
  const calculateEmployeeTotals = () => {
    return orders.map(order => {
      let total = 0;
      
      DAYS_OF_WEEK.forEach(day => {
        const dayOrder = order.weekOrder[day];
        Object.entries(dayOrder).forEach(([itemId, quantity]) => {
          const menuItem = getMenuItemById(itemId);
          if (menuItem) {
            total += menuItem.price * quantity;
          }
        });
      });
      
      return {
        employeeName: order.employeeName,
        total
      };
    });
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(orderId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Employee Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-default-500">
                <Icon icon="lucide:clipboard" className="mx-auto mb-2 text-4xl" />
                <p>No orders have been placed yet</p>
              </div>
            ) : (
              <Table removeWrapper aria-label="Employee orders">
                <TableHeader>
                  <TableColumn>EMPLOYEE</TableColumn>
                  <TableColumn>TOTAL AMOUNT</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const employeeTotal = calculateEmployeeTotals().find(
                      et => et.employeeName === order.employeeName
                    );
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell>{order.employeeName}</TableCell>
                        <TableCell>${employeeTotal?.total.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(order.timestamp)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="flat" 
                              onPress={() => handleOrderClick(order)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              variant="flat" 
                              color="danger"
                              onPress={() => handleDeleteOrder(order.id)}
                              startContent={<Icon icon="lucide:trash" width={16} />}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <Tabs 
              aria-label="Days of the week" 
              selectedKey={selectedDay}
              onSelectionChange={(key) => setSelectedDay(key as DayOfWeek)}
              className="mb-4"
            >
              {DAYS_OF_WEEK.map(day => (
                <Tab key={day} title={DAY_LABELS[day]}>
                  <DailySummary 
                    day={day} 
                    itemSummary={calculateDailySummary(day)} 
                  />
                </Tab>
              ))}
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
};

interface DailySummaryProps {
  day: DayOfWeek;
  itemSummary: Record<string, number>;
}

const DailySummary: React.FC<DailySummaryProps> = ({ day, itemSummary }) => {
  const { getMenuItemById } = useMenu();
  const items = Object.entries(itemSummary);
  
  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-default-500">
        <p>No items ordered for {DAY_LABELS[day]}</p>
      </div>
    );
  }
  
  return (
    <Table removeWrapper aria-label={`Summary for ${day}`}>
      <TableHeader>
        <TableColumn>ITEM</TableColumn>
        <TableColumn>QUANTITY</TableColumn>
        <TableColumn>PRICE</TableColumn>
        <TableColumn>TOTAL</TableColumn>
      </TableHeader>
      <TableBody>
        {items.map(([itemId, quantity]) => {
          const menuItem = getMenuItemById(itemId);
          if (!menuItem) return null;
          
          return (
            <TableRow key={itemId}>
              <TableCell>{menuItem.name}</TableCell>
              <TableCell>{quantity}</TableCell>
              <TableCell>${menuItem.price.toFixed(2)}</TableCell>
              <TableCell>${(menuItem.price * quantity).toFixed(2)}</TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
          <TableCell className="font-medium">
            ${items.reduce((total, [itemId, quantity]) => {
              const menuItem = getMenuItemById(itemId);
              return total + (menuItem ? menuItem.price * quantity : 0);
            }, 0).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};