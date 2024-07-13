import React, { useState } from "react";

import Button from "@mui/material/Button";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import CreateNewCoinModal from "./CreateNewCoinModal";

import "./styles.css";

export default function CreateNewCoinButton() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleOpenCreateModal = () => setCreateModalOpen(true);

  return (
    <React.Fragment>
      <Button
        startIcon={<MonetizationOnIcon />}
        variant="outlined"
        onClick={handleOpenCreateModal}
        sx={{
          maxWidth: "fit-content",
          borderRadius: "6px",
          padding: "5px 20px",
        }}
      >
        Start a new coin
      </Button>
      <CreateNewCoinModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </React.Fragment>
  );
}
