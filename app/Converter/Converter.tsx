"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { ExchangeRates } from "@/types/models";
import styled from "@emotion/styled";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { getExchangeRates } from "@/api";
import toast, { Toaster } from "react-hot-toast";

interface ConverterProps {
  rates: ExchangeRates;
}

const CurrencyConverter = styled.div({
  padding: "30px",
  display: "flex",
  justifyContent: "space-between",
  maxWidth: "770px",
  width: "100%",
  boxShadow: "0 10px 20px 0 #b3bbc673",
});

const calculateFinalValue = (
  activeValue: number,
  fromCurrencyRate: number,
  toCurrencyRate: number
) => +((activeValue * toCurrencyRate) / fromCurrencyRate).toFixed(4);

export const Converter: React.FC<ConverterProps> = ({ rates: initialRates }) => {
  const [initialFirstCurrency, initialSecondCurrency] = Object.keys(initialRates);
  const [rates, setRates] = useState(initialRates);
  const [firstSelectedCurrency, setFirstSelectedCurrency] = useState(initialFirstCurrency);
  const [secondSelectedCurrency, setSecondSelectedCurrency] = useState(initialSecondCurrency);
  const [firstCurrencyValue, setFirstCurrencyValue] = useState(0);
  const [secondCurrencyValue, setSecondCurrencyValue] = useState(0);
  const [activeField, setActiveField] = useState('');
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    if (!shouldUpdate) return;

    async function fetchRates() {
      const { rates, errorMessage } = await getExchangeRates();
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        setRates(rates);
        updateFields(rates);
      }
      setShouldUpdate(false);
    }

    function updateFields(fetchedRates: ExchangeRates) {
      const firstCurrencyFetchedRate =
        fetchedRates[firstSelectedCurrency].value;
      const secondCurrencyFetchedRate =
        fetchedRates[secondSelectedCurrency].value;

      switch (activeField) {
        case "firstCurrencyInput":
          setSecondCurrencyValue(
            calculateFinalValue(
              firstCurrencyValue,
              firstCurrencyFetchedRate,
              secondCurrencyFetchedRate
            )
          );
          break;
        case "secondCurrencyInput":
          setFirstCurrencyValue(
            calculateFinalValue(
              secondCurrencyValue,
              secondCurrencyFetchedRate,
              firstCurrencyFetchedRate
            )
          );
          break;
      }
    }

    const timerId = setTimeout(() => fetchRates(), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [
    firstCurrencyValue,
    secondCurrencyValue,
    firstSelectedCurrency,
    secondSelectedCurrency,
    activeField,
    shouldUpdate,
  ]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/[^0-9.]/)) return;
    if (e.target.name === "firstCurrencyInput") {
      setFirstCurrencyValue(+e.target.value);
    } else {
      setSecondCurrencyValue(+e.target.value);
    }
    setActiveField(e.target.name);
    setShouldUpdate(true);
  };

  const onCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "firsCurrencySelect") {
      setFirstSelectedCurrency(e.target.value);
    } else {
      setSecondSelectedCurrency(e.target.value);
    }
    setShouldUpdate(true);
  };

  const onSwapClick = () => {
    setSecondSelectedCurrency(firstSelectedCurrency);
    setFirstSelectedCurrency(secondSelectedCurrency);
    setShouldUpdate(true);
  };

  const itemsList = useMemo(() => {
    return Object.entries(rates).map(([code, rate]) => (
      <MenuItem key={rate.name} value={code}>
        {rate.name}
      </MenuItem>
    ));
  }, [rates]);

  return (
    <CurrencyConverter>
      <Grid container>
        <Grid item xs={12} sm={5}>
          <TextField
            sx={{ marginBottom: "10px" }}
            select
            value={firstSelectedCurrency}
            fullWidth
            onChange={onCurrencyChange}
            name="firsCurrencySelect"
          >
            {itemsList}
          </TextField>
          <TextField
            value={firstCurrencyValue}
            onChange={onValueChange}
            variant="filled"
            fullWidth
            name="firstCurrencyInput"
          />
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: "flex" }}>
          {shouldUpdate ? (
            <CircularProgress sx={{ margin: "auto" }} />
          ) : (
            <IconButton
              onClick={onSwapClick}
              sx={{ margin: "auto" }}
              size="large"
            >
              <SwapHorizIcon />
            </IconButton>
          )}
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            sx={{ marginBottom: "10px" }}
            select
            value={secondSelectedCurrency}
            fullWidth
            onChange={onCurrencyChange}
            name="secondCurrencySelect"
          >
            {itemsList}
          </TextField>
          <TextField
            value={secondCurrencyValue}
            onChange={onValueChange}
            variant="filled"
            fullWidth
            name="secondCurrencyInput"
          />
        </Grid>
      </Grid>
      <Toaster />
    </CurrencyConverter>
  );
};
