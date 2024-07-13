import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import CreateNewCoinButton from "../Components/MainPage/CreateNewCoinButton.jsx";
import CoinsCardsGrid from "../Components/MainPage/CoinsCardsGrid";

import { coinsList } from "../DataMockUpsTestingPurposesOnly/coinsList";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <Stack sx={{ width: "100vw" }} direction="column">
      <Stack
        sx={{ height: "120px", justifyContent: "center", alignItems: "center" }}
      >
        <CreateNewCoinButton />
      </Stack>
      <Stack sx={{ padding: "0px 24px" }}>
        <CoinsCardsGrid coinsList={coinsList} loading={loading} />
      </Stack>
      <Stack sx={{ mb: 4 }}></Stack>
    </Stack>
  );
}
