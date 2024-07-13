import React, { useState, useContext } from "react";

import Button from "@mui/material/Button";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import CreateNewCoinModal from "./CreateNewCoinModal";
import { FeedbackContext } from "../../providers/FeedbackProvider";
import { Web3Context } from "../../providers/Web3Provider";

import "./styles.css";
import axios from "axios";

export default function CreateNewCoinButton({ afterCreate }) {
  const { setError, setSuccessMesage } = useContext(FeedbackContext);
  const { account, createToken, buyToken } = useContext(Web3Context);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [dataSubmitting, setIsDataSubmitting] = useState(false);

  const handleOpenCreateModal = () => setCreateModalOpen(true);

  const saveData = async (vals) => {
    setIsDataSubmitting(true);
    try {
      if (!account) {
        throw new Error("No connected wallet found");
      }
      const imageBase64Url = await getBase64DataUrlFromImageFile(vals.image[0]);
      if (!imageBase64Url) throw new Error(`Could not process image`);

      if (!vals.coin_name || !vals.coin_ticker || !vals.coin_description) {
        throw new Error("Please fill in all required fields");
      }

      const bodyObj = {
        chain_id: Number(window.ethereum.chainId),
        contract_address: "",
        coin_name: vals.coin_name,
        coin_ticker: vals.coin_ticker,
        coin_description: vals.coin_description,
        wallet_creator: account,
        image: imageBase64Url,
        twitter_link: vals.twitter_link ?? "",
        telegram_link: vals.telegram_link ?? "",
        website_link: vals.website ?? "",
      };

      const response = await axios.post(
        "http://localhost:8000/add_data/",
        bodyObj
      );

      if (response.status !== 200) throw new Error(`Could not create coin`);

      const _contractAddress = await createToken(
        vals.coin_name,
        vals.coin_ticker
      );
      if (!_contractAddress) throw new Error(`Could not create coin`);

      const responseUpdateExistence = await axios.put(
        "http://localhost:8000/update_address/",
        {
          contract_address: _contractAddress,
          coin_name: vals.coin_name,
          coin_ticker: vals.coin_ticker,
        }
      );

      if (responseUpdateExistence.status !== 200)
        throw new Error(`Could not create coin`);

      let buyError = false;

      console.log(vals.buy_amount, "vals.buy_amount)");
      if (vals.buy_amount) {
        const _buyAmount = parseFloat(vals.buy_amount);

        if (_buyAmount && _buyAmount > 0) {
          const buyRes = await buyToken(_contractAddress, _buyAmount);
          if (!buyRes) {
            buyError = true;
            setError(`Could not buy token (but coin data saved successfully)`);
          }
        }
      }
      if (!buyError) {
        setSuccessMesage("Coin data saved successfully");
      }

      setCreateModalOpen(false);
    } catch (err) {
      console.log(`Save new coin data error: `, err);
      setError(err.message);
    } finally {
      afterCreate();
      setIsDataSubmitting(false);
    }
  };

  const getBase64DataUrlFromImageFile = async (_image) => {
    const targetWidth = 400;
    const loadImage = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    // Load and scale the image
    const image = await loadImage(_image);
    const scaleFactor = targetWidth / image.width;
    const targetHeight = image.height * scaleFactor;
    // Create a canvas and draw the scaled image
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
    // Get the base64 data URL
    const base64DataUrl = canvas.toDataURL(_image.type);

    return base64DataUrl;
  };

  return (
    <React.Fragment>
      <Button
        startIcon={<MonetizationOnIcon />}
        variant="outlined"
        onClick={handleOpenCreateModal}
        sx={{
          maxWidth: "fit-content",
          borderRadius: "6px",
          padding: "5px 20px",
        }}
      >
        Start a new coin
      </Button>
      <CreateNewCoinModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        saveData={saveData}
        dataSubmitting={dataSubmitting}
      />
    </React.Fragment>
  );
}
