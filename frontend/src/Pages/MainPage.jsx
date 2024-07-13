import React, { useState, useEffect, useContext, useCallback } from "react";
import Stack from "@mui/material/Stack";
import CreateNewCoinButton from "../Components/MainPage/CreateNewCoinButton.jsx";
import CoinsCardsGrid from "../Components/MainPage/CoinsCardsGrid";
import axios from "axios";
import { FeedbackContext } from "../providers/FeedbackProvider";

// import { coinsList } from "../DataMockUpsTestingPurposesOnly/coinsList";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [coinsList, setCoinsList] = useState([]);

  const { setError } = useContext(FeedbackContext);

  const fetchCoinsList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/get_all_tokens/");
      if (response.status === 200) {
        const _coins = response.data
          .filter((coin) => coin.confirmed_existence)
          .map((coin) => {
            const {
              coin_name,
              coin_ticker,
              coin_description,
              contract_address,
              image,
              twitter_link,
              telegram_link,
              website_link,
              wallet_creator,
            } = coin;
            return {
              id: contract_address,
              coin_name,
              coin_ticker,
              coin_description,
              image,
              twitter_link,
              telegram_link,
              website: website_link,
              author: wallet_creator,
            };
          });
        setCoinsList(_coins);
      } else throw new Error(`Could not load coins list`);
    } catch (err) {
      console.log(`fetchCoinsList Error: `, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  useEffect(() => {
    //setTimeout(() => setLoading(false), 2000);
    fetchCoinsList();
  }, [fetchCoinsList]);

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
