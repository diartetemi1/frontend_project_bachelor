import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { checkEndpoint } from "../Customer/CreateCustomer";
import FooterComponent from "../FooterComponent";

const CreateDriver = ({ driver }) => {
  let history = useHistory();
  const [courierDriver, setcourierDriver] = useState({
    firstName: driver ? driver.firstName : "",
    lastName: driver ? driver.lastName : "",
    email: driver ? driver.email : "",
    phoneNumber: driver ? driver.phoneNumber : "",
  });
  const [error, setError] = useState(null);

  const onDriverChange = (e) => {
    e.preventDefault();
    setcourierDriver({ ...courierDriver, [e.target.name]: e.target.value });
  };

  const getTitle = () => {
    if (checkEndpoint("_add")) {
      return <h3 className="text-center">Kurierfahrer hinzufügen</h3>;
    } else {
      return <h3 className="text-center">Kurierfahrer bearbeiten</h3>;
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (
        courierDriver.firstName !== "" &&
        courierDriver.lastName !== "" &&
        courierDriver.email !== "" &&
        courierDriver.phoneNumber !== "" 
      ) {
        if (checkEndpoint("_add")) {
          await axios.post("http://localhost:8080/api/drivers", courierDriver);
        } else {
          const res = await axios.put(
            "http://localhost:8080/api/drivers/" + driver.driverID,
            courierDriver
          );
        }
        history.goBack();
      } else {
        setError("Bitte füllen Sie alle Felder aus");
      }
    } catch (error) {
      setError("Bitte füllen Sie alle Felder aus");
    }
  };

  function cancel() {
    history.push("/drivers");
  }

  return (
    <div>
      <div className="container">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          {getTitle()}
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Vorname: </label>
                <input
                  defaultValue={driver ? driver.firstName : undefined}
                  className="form-control"
                  onChange={onDriverChange}
                  type="text"
                  name="firstName"
                  placeholder="Vorname"
                />
              </div>
              <div className="form-group">
                <label>Nachname: </label>
                <input
                  defaultValue={driver ? driver.lastName : undefined}
                  className="form-control"
                  onChange={onDriverChange}
                  type="text"
                  name="lastName"
                  placeholder="Nachname"
                />
              </div>
              <div className="form-group">
                <label>E-Mail: </label>
                <input
                  defaultValue={driver ? driver.email : undefined}
                  className="form-control"
                  onChange={onDriverChange}
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                />
              </div>
              <div className="form-group">
                <label>Telefonnummer: </label>
                <input
                  defaultValue={driver ? driver.phoneNumber : undefined}
                  className="form-control"
                  onChange={onDriverChange}
                  type="text"
                  name="phoneNumber"
                  placeholder="Telefonnummer"
                />
              </div>
              {error && <p>{error}</p>}
              <button className="btn btn-success mr-2" onClick={onCreate}>
                Speichern
              </button>
              <button
                className="btn btn-danger"
                onClick={cancel}
                style={{ marginLeft: "10 px" }}
              >
                Zurück
              </button>
            </form>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default CreateDriver;
