import { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import FooterComponent from "../FooterComponent";

const CustomerComponent = () => {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await axios.get("http://localhost:8080/api/customers");
      if (data) {
        setCustomers(data);
      }
    }
    fetchCustomers();
  }, []);

  let history = useHistory();
  function addCustomer() {
    history.push("/add-customer/_add");
  }

  const deleteCustomer = async (customerID) => {
    await axios.delete("http://localhost:8080/api/customers/" + customerID);
    window.location.reload(false);
  };

  return (
    <div>
      <h2 className="text-center">Kundenliste</h2>
      <div className="row">
        <button className="btn btn-primary" onClick={addCustomer}>
          Kunde hinzufügen
        </button>
        <br></br>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Addresse</th>
              <th className="text-center">Stadt</th>
              <th className="text-center">Postleitzahl</th>
              <th className="text-center">Land</th>
              <th className="text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerID}>
                <td className="text-center"> {customer.customerID}</td>
                <td className="text-center"> {customer.name}</td>
                <td className="text-center"> {customer.email}</td>
                <td className="text-center"> {customer.address}</td>
                <td className="text-center"> {customer.city}</td>
                <td className="text-center"> {customer.postalCode}</td>
                <td className="text-center"> {customer.country}</td>
                <td className="text-center">
                  <button
                    onClick={() =>
                      history.push({
                        pathname: `/${customer.name}`,
                        state: customer,
                      })
                    }
                    className="btn btn-outline-primary mr-2"
                  >
                    Übersicht
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.customerID)}
                    className="btn btn-danger mr-2"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => history.push("/drivers")}
          className="btn btn-outline-primary"
        >
          Kurierfahrerübersicht
        </button>
      </div>
      <FooterComponent />
    </div>
  );
};

export default CustomerComponent;
