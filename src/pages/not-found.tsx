import { CenteredLayout } from "@/components";
import { ErrorOutline } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <CenteredLayout>
      <ErrorOutline color="error" style={{ fontSize: 80 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        We can't seem to find the page you're looking for.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        style={{ marginTop: "20px" }}
      >
        Go to Home
      </Button>
    </CenteredLayout>
  );
};

export default NotFoundPage;
