import { useDeleteMutation, useGetQuery } from '@/hooks';
import { Expenses } from '@/interfaces';
import { useUser } from '@clerk/clerk-react';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import React from 'react';

const ExpenseList: React.FC = () => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const { user } = useUser();

  const { data } = useGetQuery<Expenses[]>({
    resource: 'expenses',
    appendToSql: `WHERE user_id = '${user?.id}' ORDER BY date DESC LIMIT 10 `
  })

  const { mutate: deleteExpense } = useDeleteMutation({
    resource: 'expenses',
    invalidateKeys: ['transactions-summary','unpaid-recurring-expenses']
  });

  const expenses = data ?? [];

  const handleDelete = (id: string) => {
    deleteExpense({ id });
  };

  return (
    <Card sx={{ padding: 2, borderRadius: 2 }}>
      <Typography variant="h5" component="div" gutterBottom sx={{ padding: 2 }}>
        History
      </Typography>

      <TableContainer
        sx={{
          overflow: 'auto',
          padding: 2,
          maxHeight: 312,
          height: 312,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }}>Title</TableCell>
              <TableCell sx={{ borderBottom: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }}>Amount</TableCell>
              <TableCell sx={{ borderBottom: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}` }}>Date</TableCell>
              <TableCell sx={{ borderBottom: `2px solid ${borderColor}`, borderTop: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(expense.id)} color="error">
                    <DeleteOutlineOutlined/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ExpenseList;
