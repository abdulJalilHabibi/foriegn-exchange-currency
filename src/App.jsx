import { useEffect, useState } from "react";
import Header from "./Component/Header";
import Logo from "./Component/Logo";
import CheckRate from "./Component/CheckRate";
import LiveMarket from "./Component/LiveMarket";
import Main from "./Component/Main";
import History from "./Component/History";
import Footer from "./Component/Footer";
import DropDown from "./Component/DropDown";
import Compare from "./Component/Compare";
import Favroite from "./Component/Favroite";
import Log from "./Component/Log";
import { data } from "./data/data.js";
import "./index.css";
import useCurrency from "./hooks/useCurrency.js";
import useAmountInput from "./hooks/useAmountInput.js";
import DefaultHistory from "./Component/DefaultSection.jsx";
import DefaultSection from "./Component/DefaultSection.jsx";
function App() {
  const [selectedOption, setSelectedOption] = useState("history");
  const [selectedCountry] = useState(data);
  const [logged, setLogged] = useState([]);

  const [favorited, setFavorited] = useState([]);

  const currency = useCurrency();

  const sendField = useAmountInput("");
  const receiveField = useAmountInput("");
  
  function handleFavorite(
    senderCurrency,
    receiverCurrency,
    rate,
    changePercent,
  ) {
    const newFavorite = {
      senderCurrency,
      receiverCurrency,
      rate,
      changePercent,
    };

    setFavorited((prevFavroited) => {
      const alreadyExist = prevFavroited.some(
        (favroite) =>
          favroite.senderCurrency === newFavorite.senderCurrency &&
          favroite.receiverCurrency === newFavorite.receiverCurrency,
      );
      if (alreadyExist) {
        const deleteFavroite = prevFavroited.filter(
          (favroite) =>
            favroite.senderCurrency !== newFavorite.senderCurrency ||
            favroite.receiverCurrency !== newFavorite.receiverCurrency,
        );
        return deleteFavroite;
      }
      return [...prevFavroited, newFavorite];
    });
  }

  function handleAllClearLogged() {
    setLogged([]);
  }

  function handleDeleteLog(senderCurrency, receiverCurrency) {
    setLogged((prevLogged) =>
      prevLogged.filter(
        (log) =>
          log.senderCurrency !== senderCurrency ||
          log.receiverCurrency !== receiverCurrency,
      ),
    );
  }

  function handleDeleteFavorite(senderCurrency, receiverCurrency) {
    setFavorited((favorited) =>
      favorited.filter(
        (favroite) =>
          favroite.senderCurrency !== senderCurrency ||
          favroite.receiverCurrency !== receiverCurrency,
      ),
    );
  }

  function handleLogged(senderCurrency, receiverCurrency) {
    const newLogged = {
      senderValue: sendField.value,
      receiveValue: receiveField.value,
      senderCurrency,
      receiverCurrency,
      createdAt: Date.now(),
    };

    setLogged((prevLogged) => {
      const alreadyLogged = prevLogged.some(
        (logged) =>
          logged.senderCurrency === newLogged.senderCurrency &&
          logged.receiverCurrency === newLogged.receiverCurrency &&
          sendField.value === logged.senderValue &&
          logged.receiveValue === newLogged.receiveValue,
      );
      if (alreadyLogged) {
        return prevLogged;
        // const deleteLogged = prevLogged.filter(
        //   (log) =>
        //     log.senderCurrency !== newLogged.senderCurrency ||
        //     log.receiverCurrency !== newLogged.receiverCurrency,
        // );
        // return deleteLogged;
      }

      return [...prevLogged, newLogged];
    });
  }

  return (
    <>
      <Header>
        <Logo />
        <LiveMarket />
      </Header>
      <Main>
        <CheckRate
          handleLogged={handleLogged}
          logged={logged}
          setLogged={setLogged}
          selectedCountry={selectedCountry}
          favorited={favorited}
          setFavorited={setFavorited}
          handleFavorite={handleFavorite}
          currency={currency}
          sendField={sendField}
          receiveField={receiveField}
        />
        <DropDown
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          favorited={favorited}
          logged={logged}
        />
        {selectedOption === "history" &&
          (currency.fromSelectedCurrency === "USD" &&
          currency.toSelectedCurrency === "AFN" ? (
            <DefaultSection
              heading="No chart data available"
              text="We couldn't load rate history for USD/AFN right now. This usually clears up in a minute."
            />
          ) : (
            <History currency={currency} />
          ))}

        {selectedOption === "compare" &&
          (!sendField.value ? (
            <DefaultSection
              heading="No comparison available"
              text="Enter an amount in SEND above to see what your money is worth in other currencies."
            />
          ) : (
            <Compare
              currency={currency}
              handleFavorite={handleFavorite}
              favorited={favorited}
              senderField={sendField.value}
            />
          ))}
        {selectedOption === "favroites" &&
          (favorited.length > 0 ? (
            <Favroite
              favorited={favorited}
              handleDeleteFavorite={handleDeleteFavorite}
            />
          ) : (
            <DefaultSection
              heading="No pinned pairs yet"
              text="Pin a pair to track its rate here. Tap the star icon on any conversion or comparison row."
            />
          ))}
        {selectedOption === "logs" &&
          (logged.length > 0 ? (
            <Log
              handleAllClearLogged={handleAllClearLogged}
              logged={logged}
              setLogged={setLogged}
              handleDeleteLog={handleDeleteLog}
            />
          ) : (
            <DefaultSection
              heading="No conversions logged yet"
              text="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
            />
          ))}
      </Main>
      <Footer className="md:hidden" />
    </>
  );
}

export default App;
