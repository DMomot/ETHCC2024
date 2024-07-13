import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Stack,
  TextField,
  Button,
  Stepper,
  Step,
  StepButton,
  Typography,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Web3Context } from "../../providers/Web3Provider";

const createNewCoinFormConfig = {
  required: {
    coin_name: {
      label: "Name",
      key: "coin_name",
      required: true,
      step: 1,
    },
    coin_ticker: {
      label: "Ticker",
      key: "coin_ticker",
      required: true,
      step: 1,
    },
    coin_description: {
      label: "Description",
      key: "coin_description",
      required: true,
      step: 1,
      multiline: true,
    },
  },
  optional: {
    twitter_link: {
      label: "Twitter link",
      key: "twitter_link",
      required: false,
      step: 1,
    },
    telegram_link: {
      label: "Telegram link",
      key: "telegram_link",
      required: false,
      step: 1,
    },
    website: {
      label: "Website",
      key: "website",
      required: false,
      step: 1,
    },
    buy_amount: {
      label: "Buy amount",
      key: "buy_amount",
      required: false,
      step: 2,
    },
  },
};

export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    padding: "12px 14px",
    "& .MuiOutlinedInput-input": {
      padding: 0,
    },
  },
  "& .MuiInputLabel-root": {
    top: "3px",
  },
}));

export default function CreateNewCoinForm({ saveData, dataSubmitting }) {
  const { account, handleConnectWallet } = useContext(Web3Context);

  const [step, setStep] = useState(0);
  const [visitedStep, setVisitedStep] = useState({
    0: true,
    1: false,
  });
  const [nextDisabled, setNextDisabled] = useState({
    0: true,
    1: true,
  });
  const [isFileHovering, setIsFileHovering] = useState(false);
  const [shouldShowMoreOptions, setShouldShowMoreOptions] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    getValues,
  } = useForm({
    reValidateMode: "onChange",
  });

  const _name = watch("coin_name");
  const _descr = watch("coin_description");
  const _ticker = watch("coin_ticker");
  const _image = watch("image");

  const isStepCompleted = (step) => {
    if (step === 0) {
      const vals = getValues();
      if (
        !vals.coin_name ||
        !vals.coin_ticker ||
        !vals.coin_description ||
        !vals.image?.length
      )
        return false;
    }

    return visitedStep[step];
  };

  useEffect(() => {
    const _isStepCompleted = (_step) => {
      if (_step === 0) {
        if (!_name || !_ticker || !_descr || !_image.length) return false;
      }

      return visitedStep[_step];
    };

    setNextDisabled({
      0: !_isStepCompleted(0),
      1: !_isStepCompleted(0) || !_isStepCompleted(1),
    });
  }, [_name, _descr, _ticker, _image, visitedStep]);

  /**
   * @param {'required' | 'optional'} key
   */
  const renderFields = (configPart = "required") => {
    return Object.entries(createNewCoinFormConfig[configPart])
      .filter(([, confPiece]) => confPiece.step === step + 1)
      .map(([, confPiece]) => (
        <CustomTextField
          key={confPiece.key}
          variant="outlined"
          margin="dense"
          size="small"
          fullWidth
          label={confPiece.label}
          {...register(confPiece.key, {
            required: confPiece.required && `${confPiece.label} is required`,
          })}
          error={!!(errors && errors[confPiece.key])}
          helperText={errors?.[confPiece.key]?.message}
          multiline={confPiece.multiline}
        />
      ));
  };
  const steps = ["General info", "Buy"];

  const handleStep = async (step) => {
    await trigger();
    if (step === 1) {
      const vals = getValues();
      if (
        !vals.coin_name ||
        !vals.coin_ticker ||
        !vals.coin_description ||
        !vals.image?.length
      ) {
        await trigger();
      } else {
        setVisitedStep({ ...visitedStep, [step]: true });
        setStep(1);
      }
    }
    if (step === 0) {
      setVisitedStep({ ...visitedStep, [step]: true });
      setStep(0);
    }
    if (step > 1) {
      await handleFinishForm();
    }
  };

  const handleFinishForm = async () => {
    if (!account) {
      handleConnectWallet();
      return;
    }
    // Check here if enough resources
    // TODO: add market logic
    // TODO: add flag submitted to DB & then confirmed from contract by job on backend
    await saveData(getValues());
  };

  return (
    <form>
      <Stack spacing={2}>
        <Stepper nonLinear activeStep={step}>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepCompleted(index)}>
              <StepButton
                disableRipple
                color="inherit"
                onClick={() => handleStep(index)}
                disabled={!isStepCompleted(0)}
              >
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <Stack sx={{ mt: 2 }}></Stack>
        {step === 1 ? (
          <Alert severity="info">
            Tip: it's optional but buying a small amount of coins helps protect
            your coin from snipers
          </Alert>
        ) : null}
        {renderFields()}
        {step === 0 ? (
          <Button
            disableRipple
            variant="text"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              padding: 0,
              width: "fit-content",
              paddingLeft: "4px",
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
            onClick={() => setShouldShowMoreOptions(!shouldShowMoreOptions)}
          >
            Show more options
          </Button>
        ) : null}
        {shouldShowMoreOptions || step !== 0 ? renderFields("optional") : null}
        {step === 0 ? (
          <Stack direction="column" sx={{ m: 0 }}>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              inputProps={{
                accept: "image/*",
                multiple: false,
              }}
              type="file"
              {...register("image", {
                required: "File required",
                validate: {
                  lessThan5MB: (files) =>
                    files[0]?.size < 5000000 ||
                    "File is too large. Max file size is 5MB",
                },
              })}
              sx={{
                borderRadius: "5px",
                border: isFileHovering
                  ? "1px dotted black"
                  : "1px solid transparent",
              }}
              onDragEnter={() => {
                setIsFileHovering(true);
              }}
              onDragLeave={() => {
                setIsFileHovering(false);
              }}
              onDragEnd={() => {
                setIsFileHovering(false);
              }}
              error={!!(errors && errors.image)}
              helperText={errors?.image?.message}
            />
            {getValues("image")?.[0]?.name && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {getValues("image")?.[0]?.name}
              </Typography>
            )}
          </Stack>
        ) : null}
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          Cost to deploy ~0.2 SOL
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          {step === 1 ? (
            <Button
              onClick={() => handleStep(step - 1)}
              disabled={dataSubmitting}
            >
              Back
            </Button>
          ) : null}
          <Button
            sx={{ ml: "auto" }}
            fullWidth={step === 0}
            onClick={() => handleStep(step + 1)}
            disabled={nextDisabled[step] || dataSubmitting}
          >
            {step === 1 ? (account ? "Create coin" : "Connect wallet") : "Next"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
