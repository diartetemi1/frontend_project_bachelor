import { useHistory } from "react-router-dom";
import FooterComponent from "../FooterComponent";

const Rechnungsübersicht = ({ invoicedata }) => {
  let history = useHistory();

  const invoiceList = invoicedata.invoices.filter(
    (invoice) => invoice.trips.length > 0
  );

  return (
    <div>
      <h2 className="text-center">Rechnungen {invoicedata.name}</h2>
      <div className="row">
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Datum</th>
              <th className="text-center">Kurierfahrten</th>
              <th className="text-center">Endsumme</th>
              <th className="text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.map((invoice) => (
              <tr key={invoice.invoiceID}>
                <td className="text-center"> {invoice.invoiceID}</td>
                <td className="text-center"> {invoice.datum}</td>
                <td className="text-center">
                  {" "}
                  {invoice.trips.map((trip, i) => (
                    <p key={i}>
                      {trip.startAdress} → {trip.finishingPoint}
                    </p>
                  ))}
                </td>
                <td className="text-center"> {invoice.endBetrag} €</td>
                <td>
                  <button
                    style={{ marginLeft: "10 px" }}
                    className="btn btn-dark"
                    onClick={() => {
                      history.push({
                        pathname: "/createPDF",
                        state: {
                          ...invoicedata,
                          trips: invoice.trips,
                          invoiceID: invoice.invoiceID,
                        },
                      });
                    }}
                  >
                    Zur PDF Rechnung
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() =>
            history.push({
              pathname: `/${invoicedata.name}`,
              state: invoicedata,
            })
          }
          className="btn btn-danger"
        >
          Cancel
        </button>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Rechnungsübersicht;
