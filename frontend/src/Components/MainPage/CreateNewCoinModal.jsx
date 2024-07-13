import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { IconButton, Typography, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewCoinForm from "./CreateNewCoinForm";

import "./styles.css";

export default function CreateNewCoinButton({
  open,
  onClose,
  saveData,
  dataSubmitting,
}) {
  return (
    <Dialog
      open={open}
      PaperProps={{
        className: "create-new-coin-modal--paper",
      }}
    >
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Create a new coin</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <CreateNewCoinForm
            saveData={saveData}
            dataSubmitting={dataSubmitting}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
