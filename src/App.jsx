// mantine imports
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./App.css";
import { Route, Switch } from "wouter";
import { AuthProvider, Protected } from "./context/AuthContext";

// page imports
import Main from "./Pages/main-page/Main";
import Login from "./Pages/login-page/Login";
import Topics from "./Pages/topics-page/Topics";
import UserTopics from "./Pages/user-topics-page/UserTopics";
import ConceptsList from "./Pages/concepts-list-page/ConceptsList";
import Concept from "./Pages/concept-page/Concept";
import AccountHome from "./Pages/account-home/AccountHome";
import Admin from "./Pages/admin/Admin";

// mantine theming and styling
const Theme = createTheme({
  white: "#18052D",
  borderRadius: "1rem",
});

function App() {
  return (
    <MantineProvider theme={Theme}>
      {/* Routes for Pages */}
      <AuthProvider>
        <Switch>
          <Route path="/">
            <Main />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>
          {/* page for user topics (topics page after login) */}
          <Route path="/user-topics">
            <UserTopics />
          </Route>
          <Route path="/concepts/:topicSlug">
            <ConceptsList />
          </Route>
          <Route path="/concept/:slug">
            <Protected>
              <Concept />
            </Protected>
          </Route>
          <Route path="/account">
            <Protected>
              <AccountHome />
            </Protected>
          </Route>
          <Route path="/admin">
            <Protected>
              <Admin />
            </Protected>
          </Route>
        </Switch>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
