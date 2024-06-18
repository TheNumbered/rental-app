import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

interface ExpenseCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

const DisplayCard: React.FC<ExpenseCardProps> = ({ title, amount, icon, color }) => {
  const backgroundColor = `${color}50`; 
  const borderColor = color;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', backgroundColor, border: `2px solid ${borderColor}`, color: borderColor }}>
      <CardContent sx={{
         display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', 
         backgroundColor: `#FFFFFF50`,
         }}>
        <Box>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="h6" component="div">
            R {amount}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DisplayCard;
