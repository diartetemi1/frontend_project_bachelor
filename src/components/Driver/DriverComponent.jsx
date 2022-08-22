import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import FooterComponent from "../FooterComponent";

const DriverComponent = () => {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    async function fetchDrivers() {
      const { data } = await axios.get("http://localhost:8080/api/drivers");
      if (data) {
        setDrivers(data);
      }
    }
    fetchDrivers();
  }, []);

  let history = useHistory();

  const deleteDriver = async (driverID) => {
    const result = await axios.delete(
      "http://localhost:8080/api/drivers/" + driverID
    );
    window.location.reload(false);
  };

  const createDriver = () => {
    history.push("/add-driver/_add");
  };

  function customerRouting() {
    history.push("/");
  }

  return (
    <div>
      <h2 className="text-center">Kurierfahrerliste</h2>
      <div className="row">
        <button className="btn btn-primary" onClick={createDriver}>
          Kurierfahrer hinzufügen
        </button>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Vorname</th>
              <th className="text-center">Nachname</th>
              <th className="text-center">E-Mail</th>
              <th className="text-center">Telefonnummer</th>
              <th className="text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.driverID}>
                <td className="text-center"> {driver.driverID}</td>
                <td className="text-center">  {driver.firstName}</td>
                <td className="text-center">  {driver.lastName}</td>
                <td className="text-center"> {driver.email}</td>
                <td className="text-center"> {driver.phoneNumber}</td>
                <td>
                  <button
                    onClick={() =>
                      history.push({
                        pathname: `/add-driver/${driver.driverID}`,
                        state: driver,
                      })
                    }
                    className="btn btn-warning mr-2"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => deleteDriver(driver.driverID)}
                    className="btn btn-danger"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-outline-primary" onClick={customerRouting}>
          Kundenübersicht
        </button>
      </div>
      <FooterComponent />
    </div>
  );
};

export default DriverComponent;
