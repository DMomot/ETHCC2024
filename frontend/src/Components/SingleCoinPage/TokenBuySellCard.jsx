import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import "./styles.css";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function TokenBuySellCard({ coin, loading }) {
  const [mode, setMode] = useState("buy");

  return (
    <Card className="TokenBuySellCard">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mr: "12px", ml: "12px", mb: "7px" }}
          >
            <Stack sx={{ justifyContent: "center " }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  position: "relative",
                  top: "0px",
                  color: "rgb(34, 34, 34)",
                }}
                variant="h7"
              >
                {coin.coin_name} ({coin.coin_ticker})
              </Typography>
            </Stack>
            <Stack>
              <IconButton sx={{ borderRadius: 2, padding: "2px 4px" }}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          <ButtonGroup size="large" aria-label="Large button group">
            <Button key="buy">Buy</Button>
            <Button key="sell">Sell</Button>
          </ButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
