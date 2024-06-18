import { useCreateMutation, useDeleteMutation, useSqlMutation, useSqlQuery, useUpdateMutation } from "@/hooks";
import { ElectricityTokensInput, Payments, PaymentsInput } from "@/interfaces";
import {
  ControlPointDuplicateRounded,
  Delete,
  DeleteOutline,
  DownloadingRounded,
  SaveOutlined,
  SendRounded
} from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Tenant } from "../querys";
import { BalanceBox } from "./balance-box";
import getColorFromText from "./get-text-color";
import { GetElectricityToken } from "./querys";

interface TenantCardProps {
  tenant: Tenant;
}

const CardInput: React.FC<TenantCardProps> = ({ tenant }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [serverToken, setServerToken] = useState("");

  const { mutate: makePayment, isPending: paymentPending } = useCreateMutation({
    resource: "payments",
    invalidateKeys: ["tenants", "transactions-summary"],
  });

  const {
    mutate: generateToken,
    data: returnToken,
    isPending: generatingToken,
  } = useSqlMutation({
    query: GetElectricityToken(tenant.room_id),
  });

  const { mutate: addToken } = useCreateMutation({
    resource: "electricity_tokens",
  });

  useEffect(() => {
    const token = returnToken?.[0]?.token || "";
    if (token && token !== serverToken) {
      setServerToken(token);
      setInputToken(token);
      try {
        navigator.clipboard.writeText(token);
      } catch (err) {
        console.error("Failed to copy token to clipboard:", err);
      }
    }
  }, [returnToken, serverToken]);

  const handlePaymentSubmit = () => {
    const amount = parseFloat(paymentAmount);
    if (!isNaN(amount)) {
      const newPayment: PaymentsInput = {
        tenant_id: tenant.id,
        amount,
      };
      makePayment({
        data: newPayment,
      });
      setPaymentAmount("");
    }
  };

  const handleAddToken = () => {
    if (inputToken !== "") {
      const newToken: ElectricityTokensInput = {
        room_id: tenant.room_id,
        token: inputToken,
      };
      addToken({
        data: newToken,
      });
      setInputToken("");
    }
  };

  const handleGenerateToken = () => {
    setInputToken("");
    generateToken();
  };

  return (
    <>
      <TextField
        id="outlined-electricity-token"
        fullWidth
        value={inputToken}
        onChange={(e) => setInputToken(e.target.value)}
        label="Electricity token"
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleAddToken} disabled={generatingToken}>
                <ControlPointDuplicateRounded />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleGenerateToken}
                disabled={generatingToken}
              >
                <DownloadingRounded />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          borderRadius: 1,
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      />

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel htmlFor="outlined-adornment-amount">
          Add new payment
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          value={paymentAmount}
          type="number"
          disabled={paymentPending}
          onChange={(e) => setPaymentAmount(e.target.value)}
          startAdornment={<InputAdornment position="start">R</InputAdornment>}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handlePaymentSubmit}>
                <SendRounded />
              </IconButton>
            </InputAdornment>
          }
          label="Add new payment"
        />
      </FormControl>
    </>
  );
};

const LastPayments: React.FC<{ tenant_id: Tenant["id"] }> = ({ tenant_id }) => {
  const { data: payments, isLoading, isError } = useSqlQuery<Payments[]>({
    query: `SELECT * FROM payments WHERE tenant_id = '${tenant_id}' ORDER BY payment_date DESC LIMIT 2`,
    queryKey: `payments-${tenant_id}`
  })
  const { mutate: deletePayment } = useDeleteMutation({
    resource: "payments",
    invalidateKeys: ["tenants", `payments-${tenant_id}`],
  });

  const { mutate: updatePayment } = useUpdateMutation({
    resource: "payments",
    invalidateKeys: ["tenants",`payments-${tenant_id}`],
  });

  const [editablePayments, setEditablePayments] = useState<Payments[]>([]);

  useEffect(() => {
    if (payments) {
      setEditablePayments(payments);
    }
  }, [payments]);

  const handleSave = (payment: Payments) => {
    updatePayment({
      id: payment.id,
      data: payment,
    });
  };

  const handleChange = (
    id: Payments["id"],
    field: keyof Payments,
    value: string | number
  ) => {
    setEditablePayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading payments</Typography>;

  return (
    <div
    style={{
      minHeight: 135
    }}
    >
      {editablePayments.map((payment) => (
        <div key={payment.id}
         style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
         }}
        >
          <TextField
              type="date"
              fullWidth
              value={new Date(payment.payment_date).toISOString().slice(0, 10)}
              onChange={(e) =>
                handleChange(payment.id, "payment_date", e.target.value)
              }
              sx={{ marginRight: 2 }}
            />
            <TextField
              type="number"
              fullWidth
              value={payment.amount}
              onChange={(e) => handleChange(payment.id, "amount", +e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>,
              }}
            />
            <IconButton
              onClick={() => handleSave(payment)}
              color="primary"
            >
              <SaveOutlined/>
            </IconButton>
            <IconButton
              onClick={() => deletePayment({ id: payment.id })}
              color="error"
            >
              <DeleteOutline />
            </IconButton>
        </div>
      ))}
    </div>
  );
};

export const TenantCard: React.FC<TenantCardProps> = ({ tenant }) => {
  const [viewPayments, setViewPayments] = useState(false);
  const { mutate: deleteTenant } = useDeleteMutation({
    resource: "tenants",
    invalidateKeys: ["available_rooms"],
  });

  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              alt={tenant.name}
              onClick={() => setViewPayments(!viewPayments)}
              sx={{
                width: 60,
                height: 60,
                bgcolor: getColorFromText(tenant.name),
              }}
            >
              {tenant.name[0].toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h5"
              component="div"
              sx={{ cursor: "pointer" }}
              onClick={() => setViewPayments(!viewPayments)}
            >
              {tenant.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Rental amount: R {tenant.rent_amount}
            </Typography>
          </Grid>
          {viewPayments && (
            <Grid item>
              <IconButton onClick={() => deleteTenant({ id: tenant.id })}>
                <Delete color="error" />
              </IconButton>
            </Grid>
          )}
        </Grid>
        <Divider style={{ margin: "16px 0" }} />
        {viewPayments ? (
          <LastPayments tenant_id={tenant.id} />
        ) : (
          <CardInput tenant={tenant} />
        )}
        <div
          style={{
            marginTop: 16,
            display: "flex",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            flex={1}
            sx={{
              alignSelf: "center",
              fontStyle: "italic",
              opacity: 0.5,
            }}
          >
            Last payment : R {tenant.last_payment_amount}
          </Typography>
          <BalanceBox
            outstanding_balance={tenant.outstanding_balance}
            rent_amount={tenant.rent_amount}
          />
        </div>
      </CardContent>
    </Card>
  );
};
