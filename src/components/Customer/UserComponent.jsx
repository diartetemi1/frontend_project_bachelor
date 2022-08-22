import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./UserComponent.css";
import FooterComponent from "../FooterComponent";

export const UserComponent = ({ user }) => {
  let history = useHistory();
  const customer = {
    customerID: user.customerID,
    name: user.name,
    email: user.email,
    address: user.address,
    city: user.city,
    postalCode: user.postalCode,
    country: user.country,
  };

  console.log(user);

  const [pickedTrips, setPickedTrips] = useState([]);

  const tripIds = [];
  let nettoPreis = 0;
  for (const trip of pickedTrips) {
    tripIds.push(trip.jobID);
    nettoPreis += trip.nettoPreis;
  }
  const ust = (nettoPreis * 0.19).toFixed(2);
  const endSum = nettoPreis + parseFloat(ust);

  const date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
  const moment = require("moment");

  const dateJSON = moment(date).format("YYYY-MM-DD");

  const createInvoice = async () => {
    const res = await axios
      .post("http://localhost:8080/api/invoices/", {
        datum: dateJSON,
        tripsIds: tripIds,
        customerId: user.customerID,
        endBetrag: endSum.toFixed(2),
      })
      .then((res) => res);
    return res.data;
  };

  const deleteTrip = async (jobID) => {
    await axios.delete("http://localhost:8080/api/trips/" + jobID);
    history.push("/");
  };

  function cancel() {
    history.push("/");
  }

  return (
    <div>
      <div>
        <div>
          <h3 className="text-center">{customer.name}</h3>
        </div>
        <table className="table-fill">
          <tbody className="table-hover">
            <tr>
              <td className="text-center">Kundennummer</td>
              <td className="text-center">{customer.customerID}</td>
            </tr>
            <tr>
              <td className="text-center">E-Mail</td>
              <td className="text-center">{customer.email}</td>
            </tr>
            <tr>
              <td className="text-center">Addresse</td>
              <td className="text-center">{customer.address}</td>
            </tr>
            <tr>
              <td className="text-center">Stadt</td>
              <td className="text-center">{customer.city}</td>
            </tr>
            <tr>
              <td className="text-center">Postleitzahl</td>
              <td className="text-center">{customer.postalCode}</td>
            </tr>
            <tr>
              <td className="text-center">Land</td>
              <td className="text-center">{customer.country}</td>
            </tr>
          </tbody>
        </table>
        <br></br>
        <div className="text-center">
          <button
            onClick={() =>
              history.push({
                pathname: `/add-customer/${customer.customerID}`,
                state: user,
              })
            }
            className="btn btn-warning mr-2"
          >
            Bearbeiten
          </button>
          <button
            className="btn btn-danger mr-2"
            onClick={cancel}
            style={{ marginLeft: "10 px" }}
          >
            Zurück
          </button>
          <button
            style={{ marginLeft: "10 px" }}
            onClick={() =>
              history.push({
                pathname: `/rechnungsübersicht`,
                state: user,
              })
            }
            className="btn btn-primary"
          >
            Rechnungsübersicht
          </button>
        </div>
        <br></br>
      </div>
      <div className="text-lefft">
        <h2>Kurierfahrten</h2>
      </div>
      <div>
        <button
          style={{ marginLeft: "10 px" }}
          onClick={() =>
            history.push({
              pathname: `/add-trip/_add`,
              state: { customerID: customer.customerID },
            })
          }
          className="btn btn-outline-primary"
        >
          Tour hinzufügen
        </button>
      </div>
      <br></br>
      <table>
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Checkbox</th>
            <th className="text-center">Jobnummer</th>
            <th className="text-center">Datum</th>
            <th className="text-center">Fahrzeugart</th>
            <th className="text-center">Besteller</th>
            <th className="text-center">Startaddresse</th>
            <th className="text-center">Ziel</th>
            <th className="text-center">Entfernung</th>
            <th className="text-center">Servicezeit</th>
            <th className="text-center">Nettopreis</th>
            <th className="text-center">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {user.trips.map((trip) => (
            <tr key={trip.jobID}>
              <td className="text-center">
                <input
                  type="checkbox"
                  onClick={(e) => {
                    if (e.target.checked) {
                      setPickedTrips((state) => [...state, trip]);
                    } else {
                      const trips = pickedTrips.filter((el) => el !== trip);
                      setPickedTrips(trips);
                    }
                  }}
                />
              </td>
              <td className="text-center"> {trip.jobID}</td>
              <td className="text-center"> {trip.datum}</td>
              <td className="text-center"> {trip.fahrzeugart}</td>
              <td className="text-center"> {trip.orderer}</td>
              <td className="text-center"> {trip.startAdress}</td>
              <td className="text-center"> {trip.finishingPoint}</td>
              <td className="text-center"> {trip.entfernung} km</td>
              <td className="text-center"> {trip.serviceZeit} min</td>
              <td className="text-center"> {trip.nettoPreis.toFixed(2)} €</td>
              <td className="text-center">
                <button
                  onClick={() => deleteTrip(trip.jobID)}
                  className="btn btn-danger mb-2"
                >
                  Löschen
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    history.push({
                      pathname: `/add-trip/${trip.jobID}`,
                      state: {
                        data: trip,
                        customerID: customer.customerID,
                        customerName: customer.name,
                      },
                    })
                  }
                >
                  Bearbeiten
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <div>
        <button
          style={{ marginLeft: "10 px" }}
          className="btn btn-dark"
          onClick={async () => {
            const invoice = await createInvoice();

            const invoiceTripIds = [];
            invoice.trips.forEach((newTrip) => {
              invoiceTripIds.push(newTrip.jobID);
            });

            const filteredInvoices = user.invoices.filter((oldInvoice) => {
              let hasSameTrip = false;
              oldInvoice.trips.map((oldTrip) =>
                invoiceTripIds.includes(oldTrip.jobID)
                  ? (hasSameTrip = true)
                  : null
              );
              return !hasSameTrip ? oldInvoice : null;
            });

            history.push({
              pathname: "/rechnungsübersicht",
              state: {
                ...user,
                invoices: [...filteredInvoices, invoice],
              },
            });
          }}
        >
          Rechnung erstellen
        </button>
      </div>
      <FooterComponent />
    </div>
  );
};
