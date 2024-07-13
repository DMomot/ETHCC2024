import React, { useState, useContext } from "react";
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
import { Web3Context } from "../../providers/Web3Provider";
import { FeedbackContext } from "../../providers/FeedbackProvider";
import { Skeleton } from "@mui/material";

export default function TokenBuySellCard({ coin, loading }) {
  const [swapInProgress, setSwapInProgress] = useState(false);
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");
  const { buyToken, sellToken } = useContext(Web3Context);
  const { setError, setSuccessMesage } = useContext(FeedbackContext);

  const handleTokenSwap = async () => {
    setSwapInProgress(true);

    try {
      const callback = mode === "buy" ? buyToken : sellToken;
      const response = await callback(
        coin.contract_address,
        parseFloat(amount)
      );
      if (!response) {
        throw new Error(`Could not ${mode} token`);
      } else {
        setAmount("");
        setSuccessMesage(
          `Token was successfully ${mode === "buy" ? "bought" : "sold"}`
        );
      }
    } catch (err) {
      console.log(`handleTokenSwap Error: `, err);
      setError(err.message);
    } finally {
      setSwapInProgress(false);
    }
  };

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
                {loading ? (
                  <Skeleton>
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
                  </Skeleton>
                ) : (
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
                )}
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
              onChange={() => {
                setAmount("");
                setMode(mode === "buy" ? "sell" : "buy");
              }}
              aria-label="swap-mode"
              size="small"
              disabled={swapInProgress || loading}
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
              label="Amount (ETH)"
              key="amount_token"
              variant="outlined"
              fullWidth
              disabled={loading || swapInProgress}
              margin="dense"
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button
                disabled
                size="small"
                variant="outlined"
                sx={{ height: "24px" }}
              >
                Reset
              </Button>
              <Button
                disabled
                size="small"
                variant="outlined"
                sx={{ height: "24px" }}
              >
                25%
              </Button>
              <Button
                disabled
                size="small"
                variant="outlined"
                sx={{ height: "24px" }}
              >
                50%
              </Button>
              <Button
                disabled
                size="small"
                variant="outlined"
                sx={{ height: "24px" }}
              >
                75%
              </Button>
            </Stack>
          </Stack>
          <Button
            onClick={handleTokenSwap}
            sx={{ marginTop: "auto" }}
            disabled={loading || swapInProgress || !parseFloat(amount)}
          >
            {mode === "buy" ? "Buy" : "Sell"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
