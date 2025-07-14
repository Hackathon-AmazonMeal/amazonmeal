import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, Paper, Divider } from '@mui/material';

const mockShoppingList = {
  name: 'Weekly Shopping List',
  items: [
    { id: '1', name: 'Pasta', quantity: 2, unit: 'boxes', category: 'PANTRY', checked: false },
    { id: '2', name: 'Tomatoes', quantity: 4, unit: 'pieces', category: 'PRODUCE', checked: false },
    { id: '3', name: 'Chicken Breast', quantity: 1, unit: 'lb', category: 'MEAT', checked: true },
    { id: '4', name: 'Milk', quantity: 1, unit: 'gallon', category: 'DAIRY', checked: false },
    { id: '5', name: 'Onions', quantity: 2, unit: 'pieces', category: 'PRODUCE', checked: false },
  ]
};

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState(mockShoppingList);

  const handleToggle = (itemId) => {
    setShoppingList(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const groupedItems = shoppingList.items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping List
      </Typography>
      
      <Paper elevation={2}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {shoppingList.name}
        </Typography>
        <Divider />
        
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <Typography variant="subtitle1" sx={{ p: 2, pb: 0, fontWeight: 'bold' }}>
              {category}
            </Typography>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.checked}
                      onChange={() => handleToggle(item.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${item.name} (${item.quantity} ${item.unit})`}
                    sx={{
                      textDecoration: item.checked ? 'line-through' : 'none',
                      opacity: item.checked ? 0.6 : 1
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        ))}
      </Paper>
    </Container>
  );
};

export default ShoppingList;