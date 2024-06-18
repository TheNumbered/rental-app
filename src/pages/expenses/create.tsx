import { useCreateMutation } from '@/hooks';
import { ExpensesInput } from '@/interfaces';
import { useUser } from '@clerk/clerk-react';
import { Box, Button, Card, Checkbox, FormControlLabel, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const CreateExpense: React.FC = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const {user} = useUser();

  const {mutate: createExpense} = useCreateMutation({
    resource: 'expenses',
    invalidateKeys: ['transactions-summary', 'unpaid-recurring-expenses']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ExpensesInput = {
      title,
      amount: Number(amount),
      date,
      is_recurring: isRecurring,
      user_id: user?.id || ''
    };
    createExpense({data});
  };

  return (
    <Card sx={{ padding: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Add New Expense
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
          }
          label="Recurring Monthly?"
        />
        <Button type="submit" variant="contained" color="primary">Add Expense</Button>
      </Box>
    </Card>
  );
};

export default CreateExpense;
