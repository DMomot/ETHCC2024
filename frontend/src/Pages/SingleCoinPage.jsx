import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TokenBuySellCard from "../Components/SingleCoinPage/TokenBuySellCard";

import { singleCoin } from "../DataMockUpsTestingPurposesOnly/coinsList";

export default function SingleCoinPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <Stack
      sx={{
        width: "100vw",
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TokenBuySellCard loading={loading} coin={singleCoin} />
    </Stack>
  );
}
