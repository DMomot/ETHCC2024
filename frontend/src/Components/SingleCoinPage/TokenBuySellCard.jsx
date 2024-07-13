import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import "./styles.css";
// import IconButton from "@mui/material/IconButton";
// import RefreshIcon from "@mui/icons-material/Refresh";

import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { CustomTextField } from "../MainPage/CreateNewCoinForm";
export default function TokenBuySellCard({ coin, loading }) {
  const [mode, setMode] = useState("buy");

  return (
    <Card className="TokenBuySellCard">
      <CardContent>
        <Stack
          direction="column"
          spacing={2}
          sx={{ height: "300px" }}
          justifyContent="space-between"
        >
          <Stack>
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
              {/* <Stack>
                <IconButton sx={{ borderRadius: 2, padding: "2px 4px" }}>
                  <RefreshIcon />
                </IconButton>
              </Stack> */}
            </Stack>
            <ToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={() => setMode(mode === "buy" ? "sell" : "buy")}
              aria-label="swap-mode"
              size="small"
            >
              <ToggleButton sx={{ minWidth: "100px" }} value="buy">
                Buy
              </ToggleButton>
              <ToggleButton sx={{ minWidth: "100px" }} value="sell">
                Sell
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack spacing={2}>
            <CustomTextField
              label="Amount"
              variant="outlined"
              fullWidth
              disabled={loading}
              margin="dense"
              size="small"
            />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" sx={{ height: "24px" }}>
                Reset
              </Button>
              <Button size="small" variant="outlined" sx={{ height: "24px" }}>
                25%
              </Button>
              <Button size="small" variant="outlined" sx={{ height: "24px" }}>
                50%
              </Button>
              <Button size="small" variant="outlined" sx={{ height: "24px" }}>
                75%
              </Button>
            </Stack>
          </Stack>
          <Button sx={{ marginTop: "auto" }}>
            {mode === "buy" ? "Buy" : "Sell"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
