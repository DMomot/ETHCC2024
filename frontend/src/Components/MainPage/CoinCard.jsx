import * as React from "react";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import { generatePath } from "react-router";
import { ROUTE_SINGLE_COIN } from "../../Config/routes";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export default function CoinCard({ loading, coin }) {
  const navigate = useNavigate();

  const handleCardClick = (event) => {
    if (event.target.tagName === "A") return;

    const path = generatePath(ROUTE_SINGLE_COIN, {
      coinId: coin.id,
    });

    if (event.metaKey || event.ctrlKey) {
      window.open(path);
      return;
    }
    navigate(path);
  };

  if (loading) {
    return (
      <Card sx={{ cursor: "pointer" }} onClick={(e) => handleCardClick(e)}>
        <Skeleton variant="rectangular" width="100%" height={140}>
          <CardMedia
            component="img"
            alt={`skeleton-img-logo`}
            height="140"
            image="/logo512.png"
            sx={{ objectFit: "contain", padding: "20px" }}
          />
        </Skeleton>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Skeleton width="100%">
            <Typography gutterBottom variant="h5" component="div">
              Name mock
            </Typography>
          </Skeleton>
          <Skeleton width="90%">
            <Typography variant="body1" color="text.secondary">
              Desc moc
            </Typography>
          </Skeleton>
          <Skeleton width="90%">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                mt: 1,
              }}
            >
              Author mock
            </Typography>
          </Skeleton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ cursor: "pointer" }} onClick={(e) => handleCardClick(e)}>
      <CardMedia
        component="img"
        alt={`logo for ${coin.coin_name}`}
        height="140"
        image="/logo512.png"
        sx={{ objectFit: "contain", padding: "20px" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {coin.coin_name} ({coin.coin_ticker})
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {coin.coin_description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            mt: 1,
          }}
        >
          {coin.author ? `Author: ${coin.author.slice(0, 13)}...` : ""}
        </Typography>
        <Stack direction="column" sx={{ mt: 1 }}>
          {coin.website && (
            <Link variant="body2" href={coin.website}>
              {coin.website}
            </Link>
          )}
          {coin.twitter_link && (
            <Link variant="body2" href={coin.twitter_link}>
              {coin.twitter_link}
            </Link>
          )}
          {coin.telegram_link && (
            <Link variant="body2" href={coin.telegram_link}>
              {coin.telegram_link}
            </Link>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
