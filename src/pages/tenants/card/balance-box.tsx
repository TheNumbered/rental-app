import { Box, Typography } from "@mui/material";
import { getPercentageColor } from "./get-percentage-color";

export const BalanceBox : React.FC<{outstanding_balance: number, rent_amount: number}> = ({outstanding_balance, rent_amount}) => {
  const balance = outstanding_balance;
  const amount = rent_amount;
  const percentageOutstanding = (balance / amount) * 100;
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        bgcolor: "background.paper",
        borderRadius: 1,
        padding: "3px",
        boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          bgcolor: getPercentageColor(percentageOutstanding),
          color: "white",
          borderRadius: 1,
          padding: "6px 6px",
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography variant="body2">{outstanding_balance>0 && "-" } R {outstanding_balance}</Typography>
      </Box>
    </Box>
  );
};
