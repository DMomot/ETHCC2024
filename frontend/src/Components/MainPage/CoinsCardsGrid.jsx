import React from "react";
import Grid from "@mui/material/Grid";
import CoinCard from "./CoinCard";

import "./styles.css";

export default function CoinsCardsGrid({ coinsList = [], loading }) {
  return (
    <Grid container spacing={4}>
      {!loading
        ? coinsList.map((coin, index) => (
            <Grid key={`coin-grid-item-${index}`} item sm={4} xs={12}>
              <CoinCard coin={coin} />
            </Grid>
          ))
        : Array(6)
            .fill(1)
            .map((_, index) => (
              <Grid key={`coin-grid-item-${index}`} item sm={4} xs={12}>
                <CoinCard loading={loading} />
              </Grid>
            ))}
    </Grid>
  );
}
