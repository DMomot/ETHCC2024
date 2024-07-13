import React, { useState, useEffect, useContext, useCallback } from "react";
import Stack from "@mui/material/Stack";
import TokenBuySellCard from "../Components/SingleCoinPage/TokenBuySellCard";
import { FeedbackContext } from "../providers/FeedbackProvider";
import axios from "axios";
// import { singleCoin } from "../DataMockUpsTestingPurposesOnly/coinsList";
import { useParams } from "react-router-dom";

export default function SingleCoinPage() {
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState({});
  const { coinId } = useParams();

  const { setError } = useContext(FeedbackContext);

  const fetchSingleCoin = useCallback(async () => {
    const timeStart = Date.now();

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/get_token_info/?contract_address=${coinId}`
      );
      if (response.status === 200) {
        setCoin(response.data?.[0] || {});
      } else throw new Error(`Could not load coin`);
    } catch (err) {
      console.log(`fetchSingleCoin Error: `, err);
      setError(err.message);
    } finally {
      const timeEnd = Date.now();
      const diff = timeEnd - timeStart;
      if (diff < 300) {
        setTimeout(() => setLoading(false), 300 - diff);
      } else {
        setLoading(false);
      }
    }
  }, [setLoading, setError, coinId]);

  useEffect(() => {
    fetchSingleCoin();
  }, [fetchSingleCoin]);

  return (
    <Stack
      sx={{
        width: "100vw",
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TokenBuySellCard loading={loading} coin={coin} />
    </Stack>
  );
}
