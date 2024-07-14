import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import WalletIcon from "@mui/icons-material/Wallet";
import Typography from "@mui/material/Typography";
import "./styles.css";
import { Web3Context } from "../../providers/Web3Provider";
import { ROUTE_HOME } from "../../Config/routes";
import { generatePath, useNavigate } from "react-router-dom";

const ConnectWalletButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgb(218, 228, 251)",
  color: theme.palette.secondary.main,
  padding: "5px 20px",
  borderRadius: "12px",
  textTransform: "none",
  fontSize: "16px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "rgb(191, 210, 249)",
    boxShadow: "none",
  },
}));

// const DisconnectWalletButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "rgb(181,51,51,0.1)",
//   color: theme.palette.error.main,
//   padding: "5px 20px",
//   borderRadius: "12px",
//   textTransform: "none",
//   fontSize: "16px",
//   boxShadow: "none",
//   "&:hover": {
//     backgroundColor: "rgb(181,51,51,0.3)",
//     boxShadow: "none",
//   },
// }));

export default function HeaderComponent() {
  const { account, handleConnectWallet } = useContext(Web3Context);
  const navigate = useNavigate();

  return (
    <header className="App-header">
      <Stack direction="row" justifyContent="start" alignItems="center">
        <img
          onClick={() => navigate(generatePath(ROUTE_HOME))}
          src="/logo512.png"
          alt="header-logo"
          style={{
            cursor: "pointer",
          }}
        ></img>
        <Typography>FairPump</Typography>
      </Stack>
      <ConnectWalletButton
        onClick={handleConnectWallet}
        variant="contained"
        startIcon={<WalletIcon />}
        disabled={typeof account === "undefined" || !!account}
      >
        Connect wallet
      </ConnectWalletButton>
    </header>
  );
}
