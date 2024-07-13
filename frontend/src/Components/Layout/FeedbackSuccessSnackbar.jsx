import React, { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./styles.css";
import { FeedbackContext } from "../../providers/FeedbackProvider";

export default function FeedbackSuccessSnackbar() {
  const { successMessage, showSuccessMessage, setShowSuccessMessage } =
    useContext(FeedbackContext);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={showSuccessMessage}
      onClose={() => setShowSuccessMessage(false)}
    >
      <Alert
        icon={false}
        sx={{
          minWidth: "220px",
          borderRadius: "12px",
          border: "solid 1px rgb(34, 34, 34, 0.5)",
          fontSize: "16px",
        }}
        severity="success"
      >
        {successMessage}
      </Alert>
    </Snackbar>
  );
}
