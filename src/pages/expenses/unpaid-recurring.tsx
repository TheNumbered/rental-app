import { sql, useDeleteMutation, useGlobal, useSqlQuery } from "@/hooks";
import { Expenses } from "@/interfaces";
import { useUser } from "@clerk/clerk-react";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Box, Button, Card, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { PayRecurringExpensesQuery, UnpaidRecurringExpensesQuery } from "./querys";

const UnpaidRecurringExpenses: React.FC = () => {
  const { user } = useUser();
  const { data, isLoading, isError } = useSqlQuery<Expenses[]>({
    query: UnpaidRecurringExpensesQuery(user?.id || ""),
    queryKey: "unpaid-recurring-expenses",
  });
  
  const { showToast } = useGlobal();
  const queryClient = useQueryClient();
  const { mutate: payExpense } =  useMutation({
    mutationFn: async ({expense_id}: {expense_id: string}) => {
      try {
        const res = await sql(PayRecurringExpensesQuery(expense_id));
        return res;
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, "error");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["unpaid-recurring-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },

  })
  const { mutate: deleteExpense } = useDeleteMutation({
    resource: "expenses",
    invalidateKeys: ["unpaid-recurring-expenses"],
  });

  const onPay = (id: string) => {
    payExpense({
      expense_id: id
    });
  };

  const onDelete = (id: string) => {
    deleteExpense({ id });
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error fetching data</Typography>;
  }

  const expenses = data ?? [];

  return (
    <Card sx={{ padding: 4, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center" }}>
        Unpaid Expenses
      </Typography>
      {expenses.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
          No unpaid recurring expenses
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>R {expense.amount}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <IconButton
                        onClick={() => onDelete(expense.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteOutlineOutlined />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onPay(expense.id)}
                        size="small"
                      >
                        Pay
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default UnpaidRecurringExpenses;
