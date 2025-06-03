import React from "react";
import { Button, Card, CardBody, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { MenuItem, DayOrder } from "../types";

interface DailyOrderFormProps {
  day: string;
  menuItemsByCategory: Record<string, MenuItem[]>;
  dayOrder: DayOrder;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export const DailyOrderForm: React.FC<DailyOrderFormProps> = ({
  day,
  menuItemsByCategory,
  dayOrder,
  onQuantityChange
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(menuItemsByCategory).map(([category, items]) => (
        <Card key={category} className="overflow-visible">
          <CardBody>
            <h3 className="text-lg font-medium mb-4">{category}</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-small text-default-500">{item.description}</p>
                      <p className="text-small font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat"
                        onPress={() => {
                          const currentQuantity = dayOrder[item.id] || 0;
                          if (currentQuantity > 0) {
                            onQuantityChange(item.id, currentQuantity - 1);
                          }
                        }}
                        isDisabled={!dayOrder[item.id] || dayOrder[item.id] === 0}
                      >
                        <Icon icon="lucide:minus" width={16} />
                      </Button>
                      <span className="w-8 text-center">{dayOrder[item.id] || 0}</span>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="flat"
                        onPress={() => {
                          const currentQuantity = dayOrder[item.id] || 0;
                          onQuantityChange(item.id, currentQuantity + 1);
                        }}
                      >
                        <Icon icon="lucide:plus" width={16} />
                      </Button>
                    </div>
                  </div>
                  {items.indexOf(item) < items.length - 1 && <Divider className="my-2" />}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};