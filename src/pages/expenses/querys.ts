export type TransactionsSummary = {
  total_payments: number;
  total_expenses: number;
};

export const TransactionsSummaryQuery = (user_id: string, interval: string) => {
  interval = interval || "14";
  return `
    WITH recent_payments AS (
        SELECT
            p.amount
        FROM
            payments p
        JOIN
            tenants t ON p.tenant_id = t.id
        JOIN
            rooms r ON t.room_id = r.id
        JOIN
            houses h ON r.house_id = h.id
        WHERE
            h.user_id = '${user_id}'
            AND p.payment_date >= CURRENT_DATE - INTERVAL '${interval} days'
    ),
    recent_expenses AS (
        SELECT
            e.amount
        FROM
            expenses e
        WHERE
            e.user_id = '${user_id}'
            AND e.date >= CURRENT_DATE - INTERVAL '${interval} days'
    )
    SELECT
        COALESCE(SUM(rp.amount), 0) AS total_payments,
        COALESCE(SUM(re.amount), 0) AS total_expenses
    FROM
        recent_payments rp
        FULL OUTER JOIN recent_expenses re ON true;
    `;
};

export const UnpaidRecurringExpensesQuery = (user_id: string) => {
  // expenses which have a date month less than the current month
  return `
    SELECT * FROM expenses
    WHERE
        user_id = '${user_id}'
        AND is_recurring = TRUE
        AND DATE_TRUNC('month', date) != DATE_TRUNC('month', CURRENT_DATE)
    `;
};

export const PayRecurringExpensesQuery = (expense_id: string) => {
  return `
    SELECT update_and_insert_expense('${expense_id}');
    `;
};
