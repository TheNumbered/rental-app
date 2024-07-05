import { useCreateMutation } from '@/hooks';
import { ExpensesInput } from '@/interfaces';
import { useUser } from '@clerk/clerk-react';
import { Box, Button, Card, IconButton, InputAdornment, Popover, TextField, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { useState } from 'react';

const expenseTypes = [
    { emoji: '⛽', label: 'Fuel' },
    { emoji: '💡', label: 'Utilities' },
    { emoji: '🛒', label: 'Groceries' },
    { emoji: '🍽️', label: 'Food' },
    { emoji: '🎉', label: 'Entertainment' },
    { emoji: '🚗', label: 'Car Maintenance' },
    { emoji: '🩺', label: 'Healthcare' },
    { emoji: '👕', label: 'Clothing' },
    { emoji: '📚', label: 'Books' },
    { emoji: '💻', label: 'Internet' },
    { emoji: '🎁', label: 'Gifts' },
    { emoji: '🏫', label: 'Education' },
    { emoji: '🐾', label: 'Pet Care' },
    { emoji: '💼', label: 'Work Expenses' },
  ];
  

const SimpleCreateExpense: React.FC = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [date] = useState<string>(new Date().toISOString().split('T')[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useUser();

  const { mutate: createExpense } = useCreateMutation({
    resource: 'expenses',
    invalidateKeys: ['transactions-summary', 'unpaid-recurring-expenses']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ExpensesInput = {
      title,
      amount: Number(amount),
      date,
      is_recurring: false,
      user_id: user?.id || ''
    };
    createExpense({ data });
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card sx={{ padding: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Add New Expense
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          {expenseTypes.slice(0, 3).map((expense) => (
            <IconButton key={expense.label} onClick={() => setTitle(expense.label)}>
              {expense.emoji}
            </IconButton>
          ))}
          <IconButton onClick={handlePopoverOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
            {expenseTypes.slice(3).map((expense) => (
              <IconButton key={expense.label} onClick={() => { setTitle(expense.label); handlePopoverClose(); }}>
                {expense.emoji}
              </IconButton>
            ))}
          </Box>
        </Popover>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">R</InputAdornment>
          }}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">Add Expense</Button>
      </Box>
    </Card>
  );
};

export default SimpleCreateExpense;
