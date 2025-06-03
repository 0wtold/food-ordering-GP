import React from "react";
import { Card, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMenu } from "../context/menu-context";
import { MenuItem } from "../types";
import { MenuItemForm } from "./menu-item-form";

export const MenuEditor: React.FC = () => {
  const { menuItems, deleteMenuItem } = useMenu();
  const [isAddingItem, setIsAddingItem] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);

  const handleAddClick = () => {
    setIsAddingItem(true);
    setEditingItem(null);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItem(id);
    }
  };

  const handleFormClose = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <Button 
          color="primary" 
          onPress={handleAddClick}
          startContent={<Icon icon="lucide:plus" />}
        >
          Add New Item
        </Button>
      </div>

      {(isAddingItem || editingItem) && (
        <MenuItemForm 
          item={editingItem} 
          onClose={handleFormClose} 
        />
      )}

      <Card>
        <CardBody>
          {menuItems.length === 0 ? (
            <div className="text-center py-8 text-default-500">
              <Icon icon="lucide:utensils" className="mx-auto mb-2 text-4xl" />
              <p>No menu items available</p>
              <Button 
                color="primary" 
                variant="flat" 
                className="mt-4"
                onPress={handleAddClick}
              >
                Add Your First Menu Item
              </Button>
            </div>
          ) : (
            <Table removeWrapper aria-label="Menu items">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>CATEGORY</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {menuItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{item.description}</div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="primary"
                          isIconOnly
                          onPress={() => handleEditClick(item)}
                        >
                          <Icon icon="lucide:edit" width={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="flat" 
                          color="danger"
                          isIconOnly
                          onPress={() => handleDeleteClick(item.id)}
                        >
                          <Icon icon="lucide:trash" width={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};