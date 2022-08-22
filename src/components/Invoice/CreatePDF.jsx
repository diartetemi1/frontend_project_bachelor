import { useRef } from "react";
import { useHistory } from "react-router-dom";
import "./CreatePDF.css";
import html2PDF from "jspdf-html2canvas";

export const CreatePDF = ({ pdf }) => {
  const canvasRef = useRef(null);
  let history = useHistory();
  const customer = {
    customerID: pdf.customerID,
    name: pdf.name,
    email: pdf.email,
    address: pdf.address,
    city: pdf.city,
    postalCode: pdf.postalCode,
    country: pdf.country,
  };

  console.log(pdf);

  const createPDF = () => {
    html2PDF(canvasRef.current, {
      jsPDF: {
        format: "a4",
      },
      html2canvas: {
        imageTimeout: 15000,
        scale: 5,
        logging: true,
      },
      imageQuality: 0.9,
      imageType: "image/jpeg",
      output: `invoice_${pdf.name}`,
    });
  };

  let priceSum = 0;
  for (const trip of pdf.trips) {
    priceSum += trip.nettoPreis;
  }
  const ust = (priceSum * 0.19).toFixed(2);
  const endSum = priceSum + parseFloat(ust);

  function cancel() {
    history.goBack();
  }

  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  return (
    <div>
      <button onClick={createPDF} className="export-button">
        PDF erstellen
      </button>
      <button className="btn btn-danger" onClick={cancel}>
        Cancel
      </button>
      <div ref={canvasRef} className="page">
        <p className="text-xs underline mb-4">
          Firma xxx · Max-Mustermann-Straße · 12345 Berlin
        </p>

        <div className="invoice-info-container text-sm mb-4">
          <div>
            <p>{customer.name}</p>
            <p>{customer.address}</p>
            <p>
              {customer.postalCode} {customer.city}, {customer.country}{" "}
            </p>
          </div>
          <div className="invoice-box">
            <div className="invoice-col-container">
              <p>Kundennr.:</p>
              <p>Rechnungsnr.:</p>
              <p>Datum:</p>
            </div>
            <div className="invoice-col-container text-end">
              <p>{customer.customerID}</p>
              <p>{pdf.invoiceID}</p>
              <p>{date}</p>
            </div>
          </div>
        </div>
        <h3>
          <strong>RECHNUNG</strong>
        </h3>
        <p className="mb-3">
          Sehr geehrte Damen und Herren, <br />
          für die Erledigung der von Ihnen beauftragen Fahrt/en berechne ich
          Ihnen wie folgt:
        </p>
        <h5 className="underline mb-4">EINZELAUFSTELLUNG:</h5>
        {pdf.trips.map((trip, i) => (
          <div key={i} className="invoice-col-container w-full mb-5">
            <div className="invoice-info-container divider-bottom">
              <div className="invoice-row-container">
                <p className="mr-8">
                  <strong>{trip.datum}</strong>
                </p>
                <p>
                  <strong>Jobnr.:</strong>
                </p>
                &nbsp;
                <p>{trip.jobID}</p>
              </div>
              <div className="invoice-row-container">
                <p>
                  <strong>Besteller:</strong>
                </p>
                &nbsp;
                <p>{trip.orderer}</p>
              </div>
            </div>
            <div className="invoice-row-container">
              <p className="destination">Start:</p>
              <p>{trip.startAdress}</p>
            </div>
            <div className="invoice-row-container divider-bottom">
              <p className="destination">Ziel:</p>
              <p>{trip.finishingPoint}</p>
            </div>

            <div className="invoice-info-container divider-bottom">
              <div className="invoice-row-container">
                <p>
                  <strong>Fahrzeugart:</strong>
                </p>
                &nbsp;
                <p>{trip.fahrzeugart}</p>
              </div>
              <div className="invoice-row-container">
                <p>
                  <strong>Entfernung:</strong>
                </p>
                &nbsp;
                <p>{trip.entfernung} km</p>
              </div>
              <div className="invoice-row-container">
                <p>
                  <strong>Servicezeit:</strong>
                </p>
                &nbsp;
                <p>{trip.serviceZeit} min</p>
              </div>
              <div className="invoice-row-container">
                <p>
                  <strong>Netto:</strong>
                </p>
                &nbsp;
                <p>{trip.nettoPreis.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        ))}
        <div className="invoice-pricing-container mb-4">
          <div className="invoice-pricing">
            <div className="invoice-info-container divider-top">
              <div className="invoice-col-container">
                <p>Netto Total:</p>
                <p>+ 19% USt:</p>
              </div>
              <div className="invoice-col-container">
                <p className="text-right">{priceSum.toFixed(2)} €</p>
                <p className="text-right"> {ust} €</p>
              </div>
            </div>
            <div className="invoice-info-container divider-top">
              <p>
                <strong className="text-right">Endbetrag:</strong>
              </p>
              <p>
                <strong>{endSum.toFixed(2)} €</strong>
              </p>
            </div>
          </div>
        </div>
        <p>
          Zahlen Sie bitte den oben genannten Rechnungsendbetrag innerhalb von 7
          Werktagen nach Zugang der Rechnung.
        </p>
        <p className="mb-2">Vielen Dank für Ihren Auftrag!</p>
        <p className="mb-8">
          <strong>
            Bei Rechnungsnachfragen bitte immer Job- und Rechnungsnummer
            angeben.
          </strong>
        </p>
      </div>
    </div>
  );
};
