import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import FooterComponent from "../FooterComponent";

export const checkEndpoint = (endpoint) => {
  return window.location.href.indexOf(endpoint) != -1;
};

export const CreateCustomer = ({ user }) => {
  let history = useHistory();
  const [customer, setCustomer] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    address: user ? user.address : "",
    city: user ? user.city : "",
    postalCode: user ? user.postalCode : "",
    country: user ? user.country : "",
  });
  const [error, setError] = useState(null);

  const onCustomerChange = (e) => {
    e.preventDefault();
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const getTitle = () => {
    if (checkEndpoint("_add")) {
      return <h3 className="text-center">Kunde hinzufügen</h3>;
    } else {
      return <h3 className="text-center">Kunde bearbeiten</h3>;
    }
  };

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (
        customer.name !== "" &&
        customer.email !== "" &&
        customer.address !== "" &&
        customer.city !== "" &&
        customer.postalCode !== "" &&
        customer.country !== ""
      ) {
        if (checkEndpoint("_add")) {
          await axios.post("http://localhost:8080/api/customers", customer);
        } else {
          await axios.put(
            "http://localhost:8080/api/customers/" + user.customerID,
            customer
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
    if (checkEndpoint("_add")) {
      history.push("/");
    } else {
      history.push({
        pathname: `/${user.name}`,
        state: user,
      });
    }
  }

  return (
    <div>
      <div className="container">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          {getTitle()}
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Name: </label>
                <input
                  defaultValue={user ? user.name : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="text"
                  name="name"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <label>E-Mail: </label>
                <input
                  defaultValue={user ? user.email : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="email"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <label>Addresse: </label>
                <input
                  defaultValue={user ? user.address : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="text"
                  name="address"
                  placeholder="Addresse"
                />
              </div>
              <div className="form-group">
                <label>Stadt: </label>
                <input
                  defaultValue={user ? user.city : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="text"
                  name="city"
                  placeholder="Stadt"
                />
              </div>
              <div className="form-group">
                <label>Postleitzahl: </label>
                <input
                  defaultValue={user ? user.postalCode : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="text"
                  name="postalCode"
                  placeholder="Postleitzahl"
                />
              </div>
              <div className="form-group">
                <label>Land: </label>
                <input
                  defaultValue={user ? user.country : undefined}
                  className="form-control"
                  onChange={onCustomerChange}
                  type="text"
                  name="country"
                  placeholder="Land"
                />
              </div>
              {error && <p>{error}</p>}
              <button className="btn btn-success mr-1" onClick={onCreate}>
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
