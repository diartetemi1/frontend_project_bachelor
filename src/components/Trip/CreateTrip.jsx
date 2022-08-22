import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useEffect } from "react";
import { checkEndpoint } from "../Customer/CreateCustomer";
import FooterComponent from "../FooterComponent";

export const CreateTrip = ({ data }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_API_KEY",
    libraries: ["places"],
  });
  let history = useHistory();

  function cancel() {
    history.push("/customers");
  }
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

  const [trip, setTrip] = useState({
    datum: data.data ? data.data.datum : "",
    orderer: data.data ? data.data.orderer : "",
    startAdress: data.data ? data.data.startAdress : "",
    finishingPoint: data.data ? data.data.finishingPoint : "",
    fahrzeugart: data.data ? data.data.fahrzeugart : "Bus",
    entfernung: data.data ? data.data.entfernung : "",
    serviceZeit: data.data ? data.data.serviceZeit : "",
    nettoPreis: data.data ? data.data.nettoPreis : "",
    customerId: data.customerID,
    courierDriverId: data.data ? data.data.courierDriver.driverID : "",
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [distance, setDistance] = useState("");
  const [error, setError] = useState(null);

  // const autocompleteRef = useRef(null);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <h2>Error</h2>;
  }

  async function calculateRoute(e) {
    e.preventDefault();
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setTrip((state) => ({
      ...state,
      entfernung: results.routes[0].legs[0].distance.text
        .replace(" km", "")
        .replace(",", "."),
    }));
  }

  const onTripChange = (e) => {
    e.preventDefault();
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const addTrip = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (checkEndpoint("_add")) {
        await axios.post("http://localhost:8080/api/trips", trip);
      } else {
        await axios.put(
          "http://localhost:8080/api/trips/" + data.data.jobID,
          trip
        );
      }
      history.push("/customers");
    } catch (error) {
      setError("Bitte füllen Sie alle Felder aus");
    }
  };

  const prices = {
    Bus: {
      Anfahrtskosten: 20,
      servicefaktor: 0.7,
      entfernungsfaktor: 1.6,
    },
    Kombi: {
      Anfahrtskosten: 17,
      servicefaktor: 0.6,
      entfernungsfaktor: 1.4,
    },
    PKW: {
      Anfahrtskosten: 15,
      servicefaktor: 0.5,
      entfernungsfaktor: 1.2,
    },
  };

  const calculatePrice = (e) => {
    e.preventDefault();
    if (trip.fahrzeugart && trip.serviceZeit && trip.entfernung) {
      setError(null);
      setTrip((state) => ({
        ...state,
        nettoPreis:
          prices[state.fahrzeugart].Anfahrtskosten +
          state.serviceZeit * prices[state.fahrzeugart].servicefaktor +
          state.entfernung * prices[state.fahrzeugart].entfernungsfaktor,
      }));
    } else {
      setError("Füllen Sie alle Felder aus");
    }
  };

  const handleTripValues = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setTrip((state) => ({
      ...state,
      fahrzeugart: value,
    }));
  };

  const handleDrivers = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setTrip((state) => ({
      ...state,
      courierDriverId: value,
    }));
  };

  const getTitle = () => {
    if (checkEndpoint("_add")) {
      return <h3 className="text-center">Kurierfahrt hinzufügen</h3>;
    } else {
      return <h3 className="text-center">Kurierfahrt bearbeiten</h3>;
    }
  };

  return (
    <div>
      <div className="container">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          <h2>{getTitle()}</h2>
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Startadresse: </label>
                <Autocomplete
                  onPlaceChanged={() =>
                    setTrip((state) => ({
                      ...state,
                      startAdress: originRef.current.value,
                    }))
                  }
                >
                  <input
                    defaultValue={data.data ? data.data.startAdress : undefined}
                    type="text"
                    name="startAdress"
                    className="form-control"
                    onChange={onTripChange}
                    placeholder="Startadresse"
                    ref={originRef}
                  />
                </Autocomplete>
              </div>
              <div className="form-group">
                <label>Zieladresse: </label>
                <Autocomplete
                  onPlaceChanged={() =>
                    setTrip((state) => ({
                      ...state,
                      finishingPoint: destiantionRef.current.value,
                    }))
                  }
                >
                  <input
                    defaultValue={
                      data.data ? data.data.finishingPoint : undefined
                    }
                    type="text"
                    name="finishingPoint"
                    className="form-control"
                    onChange={onTripChange}
                    placeholder="Zieladresse"
                    ref={destiantionRef}
                  />
                </Autocomplete>
              </div>
              <button className="btn btn-success mb-2" onClick={calculateRoute}>
                Entfernung berechnen
              </button>
              <h6>Entfernung: {trip.entfernung + " km"} </h6>
              <div className="form-group">
                <label>Datum: </label>
                <input
                  defaultValue={data.data ? data.data.datum : undefined}
                  type="date"
                  name="datum"
                  className="form-control"
                  onChange={onTripChange}
                  placeholder="Datum"
                />
              </div>
              <div className="form-group">
                <label>Besteller: </label>
                <input
                  defaultValue={data.data ? data.data.orderer : undefined}
                  type="text"
                  name="orderer"
                  className="form-control"
                  onChange={onTripChange}
                  placeholder="Besteller"
                />
              </div>
              <div className="form-group">
                <label>Fahrzeugart: </label>
                <select onChange={handleTripValues}>
                  <option value="Bus">Bus</option>
                  <option value="Kombi">Kombi</option>
                  <option value="PKW">PKW</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kurierfahrer: </label>
                <select onChange={handleDrivers}>
                  <option disabled selected value>
                    {" "}
                    Wählen Sie einen Fahrer{" "}
                  </option>
                  {drivers.map((driver, i) => (
                    <option value={driver.driverID} key={i}>
                      {driver.firstName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Servicezeit: </label>
                <input
                  defaultValue={data.data ? data.data.serviceZeit : undefined}
                  type="text"
                  name="serviceZeit"
                  className="form-control"
                  onChange={onTripChange}
                  placeholder="Servicezeit"
                />
              </div>

              <button className="btn btn-success mb-3" onClick={calculatePrice}>
                Preis berechnen
              </button>
              <h6>Nettopreis: {trip.nettoPreis} €</h6>
              {error && <p>{error}</p>}
              <button className="btn btn-success mt-2 mr-2" onClick={addTrip}>
                Speichern
              </button>
              <button className="btn btn-danger mt-2" onClick={cancel}>
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
