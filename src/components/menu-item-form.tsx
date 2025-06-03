import React from "react";
import { Card, CardBody, Input, Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMenu } from "../context/menu-context";
import { MenuItem } from "../types";

interface MenuItemFormProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onClose }) => {
  const { addMenuItem, updateMenuItem } = useMenu();
  const [name, setName] = React.useState(item?.name || "");
  const [price, setPrice] = React.useState(item?.price.toString() || "");
  const [description, setDescription] = React.useState(item?.description || "");
  const [category, setCategory] = React.useState(item?.category || "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!category.trim()) {
      newErrors.category = "Category is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (item) {
      updateMenuItem({
        ...item,
        name,
        price: parseFloat(price),
        description,
        category
      });
    } else {
      addMenuItem({
        name,
        price: parseFloat(price),
        description,
        category
      });
    }
    
    onClose();
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-medium mb-4">
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Enter item name"
              value={name}
              onValueChange={setName}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
            
            <Input
              label="Price"
              placeholder="Enter price"
              value={price}
              onValueChange={setPrice}
              startContent={<div className="pointer-events-none">$</div>}
              isInvalid={!!errors.price}
              errorMessage={errors.price}
            />
          </div>
          
          <Input
            label="Category"
            placeholder="Enter category (e.g., Salads, Pasta, Desserts)"
            value={category}
            onValueChange={setCategory}
            isInvalid={!!errors.category}
            errorMessage={errors.category}
          />
          
          <Textarea
            label="Description"
            placeholder="Enter a description of the item"
            value={description}
            onValueChange={setDescription}
            isInvalid={!!errors.description}
            errorMessage={errors.description}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" startContent={<Icon icon="lucide:save" />}>
              {item ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};