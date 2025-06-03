import React from "react";
import { Input, Button, Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMenu } from "../context/menu-context";
import { useOrder } from "../context/order-context";
import { MenuItem, WeekOrder, DayOfWeek, DAYS_OF_WEEK, DAY_LABELS } from "../types";
import { DailyOrderForm } from "./daily-order-form";

export const EmployeeOrderForm: React.FC = () => {
  const { getMenuItemsByCategory } = useMenu();
  const { addOrder } = useOrder();
  const [employeeName, setEmployeeName] = React.useState("");
  const [currentDay, setCurrentDay] = React.useState<DayOfWeek>("monday");
  const [weekOrder, setWeekOrder] = React.useState<WeekOrder>({
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {}
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const menuItemsByCategory = getMenuItemsByCategory();

  const handleQuantityChange = (day: DayOfWeek, itemId: string, quantity: number) => {
    setWeekOrder(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [itemId]: quantity
      }
    }));
  };

  const calculateDayTotal = (day: DayOfWeek) => {
    const { getMenuItemById } = useMenu();
    return Object.entries(weekOrder[day]).reduce((total, [itemId, quantity]) => {
      const item = getMenuItemById(itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const calculateWeekTotal = () => {
    return DAYS_OF_WEEK.reduce((total, day) => {
      return total + calculateDayTotal(day);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) {
      alert("Please enter your name");
      return;
    }

    // Check if any items were ordered
    const hasOrders = DAYS_OF_WEEK.some(day => 
      Object.values(weekOrder[day]).some(quantity => quantity > 0)
    );

    if (!hasOrders) {
      alert("Please select at least one item");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addOrder(employeeName, weekOrder);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setEmployeeName("");
        setWeekOrder({
          monday: {},
          tuesday: {},
          wednesday: {},
          thursday: {},
          friday: {}
        });
        setIsSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Your Name"
                placeholder="Enter your full name"
                value={employeeName}
                onValueChange={setEmployeeName}
                isRequired
                className="max-w-md"
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Order for the Week</h2>
              
              <Tabs 
                aria-label="Days of the week" 
                selectedKey={currentDay}
                onSelectionChange={(key) => setCurrentDay(key as DayOfWeek)}
                className="mb-4"
              >
                {DAYS_OF_WEEK.map(day => (
                  <Tab key={day} title={DAY_LABELS[day]}>
                    <DailyOrderForm
                      day={day}
                      menuItemsByCategory={menuItemsByCategory}
                      dayOrder={weekOrder[day]}
                      onQuantityChange={(itemId, quantity) => 
                        handleQuantityChange(day, itemId, quantity)
                      }
                    />
                  </Tab>
                ))}
              </Tabs>
            </div>
            
            <div className="bg-content2 p-4 rounded-medium space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="flex justify-between">
                  <span>{DAY_LABELS[day]}</span>
                  <span>${calculateDayTotal(day).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-divider pt-2 font-semibold flex justify-between">
                <span>Total for Week</span>
                <span>${calculateWeekTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <Button 
                type="submit" 
                color="primary" 
                isLoading={isSubmitting}
                className="w-full sm:w-auto"
                startContent={isSuccess ? <Icon icon="lucide:check" /> : undefined}
              >
                {isSuccess ? "Order Submitted!" : "Submit Order"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};