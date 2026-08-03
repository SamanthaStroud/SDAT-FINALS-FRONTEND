import { useState } from "react";
import { useLocation } from "wouter";
import { TextInput, PasswordInput, Button, Anchor, Text } from "@mantine/core";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header/header";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Login failed.");
        return;
      }
      login(data.user);
      navigate("/account");
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error ?? "Something went wrong.");
        return;
      }
      setForgotMessage(data.message);
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    if (registerPassword !== registerConfirm) {
      setRegisterError("Passwords do not match.");
      return;
    }
    if (registerPassword.length < 8) {
      setRegisterError("Password must be at least 8 characters.");
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.error ?? "Registration failed.");
        return;
      }
      setRegisterSuccess(true);
    } catch {
      setRegisterError("Something went wrong. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header hideNav hideAuth />
      <div className="login-content">
        <div className="login-shape login-shape-1" />
        <div className="login-shape login-shape-2" />
        <div className="login-shape login-shape-3" />

        <div className="login-card">
          <div className="login-logo">
            <h1 className="login-title">
              Software Study
              <br />
              Scripts
            </h1>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === "login" ? "login-tab-active" : ""}`}
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
            >
              Sign In
            </button>
            <button
              className={`login-tab ${activeTab === "register" ? "login-tab-active" : ""}`}
              onClick={() => {
                setActiveTab("register");
                setRegisterError("");
              }}
            >
              Register
            </button>
          </div>

          {activeTab === "login" && showForgotPassword && (
            <form onSubmit={handleForgotPassword} className="login-form">
              <p
                style={{
                  color: "#e9d5ff",
                  fontSize: "0.85rem",
                  margin: "0 0 0.5rem",
                }}
              >
                Enter your email and we'll send you a link to reset your
                password.
              </p>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                withAsterisk={false}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.currentTarget.value)}
                classNames={{ input: "login-input", label: "login-label" }}
              />
              {forgotError && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    margin: "0.25rem 0",
                  }}
                >
                  {forgotError}
                </p>
              )}
              {forgotMessage && (
                <p
                  style={{
                    color: "#4ade80",
                    fontSize: "0.85rem",
                    margin: "0.25rem 0",
                  }}
                >
                  {forgotMessage}
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                className="login-button"
                loading={forgotLoading}
              >
                Send Reset Link
              </Button>
              <Text className="login-switch-text">
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="login-switch-link"
                >
                  ← Back to Sign In
                </Anchor>
              </Text>
            </form>
          )}

          {activeTab === "login" && !showForgotPassword && (
            <form onSubmit={handleLogin} className="login-form">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                withAsterisk={false}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.currentTarget.value)}
                classNames={{ input: "login-input", label: "login-label" }}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                withAsterisk={false}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.currentTarget.value)}
                classNames={{
                  input: "login-input",
                  label: "login-label",
                  innerInput: "login-inner-input",
                }}
              />
              <button
                type="button"
                className="login-forgot"
                onClick={() => {
                  setShowForgotPassword(true);
                  setForgotEmail(loginEmail);
                  setForgotMessage("");
                  setForgotError("");
                }}
              >
                Forgot password?
              </button>
              {loginError && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    margin: "0.25rem 0",
                  }}
                >
                  {loginError}
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                className="login-button"
                loading={loginLoading}
              >
                Sign In
              </Button>
              <Text className="login-switch-text">
                Don&apos;t have an account?{" "}
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="login-switch-link"
                >
                  Register
                </Anchor>
              </Text>
            </form>
          )}

          {activeTab === "register" && registerSuccess && (
            <div className="login-form" style={{ textAlign: "center" }}>
              <p style={{ color: "#e9d5ff", fontSize: "0.95rem" }}>
                Account created! Check <strong>{registerEmail}</strong> for a
                verification link before logging in.
              </p>
            </div>
          )}

          {activeTab === "register" && !registerSuccess && (
            <form onSubmit={handleRegister} className="login-form">
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                withAsterisk={false}
                value={registerName}
                onChange={(e) => setRegisterName(e.currentTarget.value)}
                classNames={{ input: "login-input", label: "login-label" }}
              />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
                required
                withAsterisk={false}
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.currentTarget.value)}
                classNames={{ input: "login-input", label: "login-label" }}
              />
              <PasswordInput
                label="Password"
                placeholder="Min 8 characters"
                required
                withAsterisk={false}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.currentTarget.value)}
                classNames={{
                  input: "login-input",
                  label: "login-label",
                  innerInput: "login-inner-input",
                }}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                withAsterisk={false}
                value={registerConfirm}
                onChange={(e) => setRegisterConfirm(e.currentTarget.value)}
                classNames={{
                  input: "login-input",
                  label: "login-label",
                  innerInput: "login-inner-input",
                }}
              />
              {registerConfirm.length > 0 && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    margin: "-0.5rem 0 0",
                    color:
                      registerConfirm === registerPassword
                        ? "#4ade80"
                        : "#f87171",
                  }}
                >
                  {registerConfirm === registerPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match yet"}
                </p>
              )}
              {registerError && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.85rem",
                    margin: "0.25rem 0",
                  }}
                >
                  {registerError}
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                className="login-button"
                loading={registerLoading}
              >
                Create Account
              </Button>
              <Text className="login-switch-text">
                Already have an account?{" "}
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="login-switch-link"
                >
                  Sign In
                </Anchor>
              </Text>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
