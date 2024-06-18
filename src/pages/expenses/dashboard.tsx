import { useSqlQuery } from '@/hooks';
import { useUser } from '@clerk/clerk-react';
import BalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import IncomeIcon from '@mui/icons-material/AttachMoney';
import ExpenseIcon from '@mui/icons-material/MoneyOff';
import { Container, Grid } from '@mui/material';
import React from 'react';
import CreateExpense from './create';
import DisplayCard from './display-card';
import ExpenseList from './list';
import { TransactionsSummary, TransactionsSummaryQuery } from './querys';
import UnpaidRecurringExpenses from './unpaid-recurring';


export const ExpenseDashboard: React.FC = () => {
  const { user } = useUser();
  const { data} = useSqlQuery<TransactionsSummary[]>({
    queryKey: 'transactions-summary',
    query: TransactionsSummaryQuery(user?.id||"",  '14')
  })


  const totalPayments = Number(data?.[0]?.total_payments) || 0;
  const totalExpenses = Number(data?.[0]?.total_expenses) || 0;
  const balance = totalPayments - totalExpenses;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={4}>
          <DisplayCard title="Balance" amount={balance} icon={<BalanceIcon color={"action"} />} color="#4caf50" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayCard title="Income" amount={totalPayments} icon={<IncomeIcon color={"action"} />} color="#2196f3" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DisplayCard title="Expenses" amount={totalExpenses} icon={<ExpenseIcon color={"action"} />} color="#f44336" />
        </Grid>
        <Grid item xs={12} md={4}>
          <CreateExpense />
        </Grid>
        <Grid item xs={12} md={8}>
          <ExpenseList />
        </Grid>

        <Grid item xs={12} md={12}>
          <UnpaidRecurringExpenses />
        </Grid>

      </Grid>
    </Container>
  );
}
