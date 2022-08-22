import "./App.css";
import CustomerComponent from "./components/Customer/CustomerComponent";
import { CreateCustomer } from "./components/Customer/CreateCustomer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateTrip } from "./components/Trip/CreateTrip";
import { UserComponent } from "./components/Customer/UserComponent";
import { CreatePDF } from "./components/Invoice/CreatePDF";
import DriverComponent from "./components/Driver/DriverComponent";
import CreateDriver from "./components/Driver/CreateDriver";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import Rechnungsübersicht from "./components/Invoice/Rechnungsübersicht";

function App() {
  return (
    <div className="container">
      <div>
        <HeaderComponent />
        <br></br>
        <Router>
          <div className="container">
            <Switch>
              <Route exact path="/" component={CustomerComponent}></Route>
              <Route path="/customers" component={CustomerComponent}></Route>
              <Route path="/drivers" component={DriverComponent}></Route>
              <Route
                path="/add-customer/:id"
                component={(props) => (
                  <CreateCustomer user={props.location.state} />
                )}
              />
              <Route
                path="/add-driver/:id"
                component={(props) => (
                  <CreateDriver driver={props.location.state} />
                )}
              />
              <Route
                path="/add-trip/:id"
                component={(props) => (
                  <CreateTrip data={props.location.state} />
                )}
              ></Route>
              <Route
                path="/createPDF"
                component={(props) => <CreatePDF pdf={props.location.state} />}
              ></Route>
              <Route
                path="/rechnungsübersicht"
                component={(props) => (
                  <Rechnungsübersicht invoicedata={props.location.state} />
                )}
              ></Route>
              <Route
                path="/:name"
                component={(props) => (
                  <UserComponent user={props.location.state} />
                )}
              ></Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
