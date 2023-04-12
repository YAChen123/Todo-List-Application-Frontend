import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";
import BASE_URL from "../config";

function AuthBox({ register }) {
  const { getCurrentUser, user } = useGlobalContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});

  useEffect(() => {
    if (user && navigate) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const resetErrors = () => {
    setRegisterErrors({});
    setLoginErrors({});
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    let data = {};

    if (register) {
      // Check if password and confirmPassword match
      if (password !== confirmPassword) {
        setRegisterErrors({ confirmPassword: "Passwords do not match" });
        setLoading(false);
        return;
      }
      data = {
        firstname,
        lastname,
        username,
        email,
        password,
        confirmPassword,
      };
    } else {
      data = {
        email,
        password,
      };
    }

    register &&
      axios
        .post(`${BASE_URL}/api/auth/register`, data)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem("token", token);
          getCurrentUser();
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data) {
            setRegisterErrors({ register: err.response.data });
          }
        });

    !register &&
      axios
        .post(`${BASE_URL}/api/auth/authenticate`, data)
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem("token", token);
          getCurrentUser();
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data) {
            setLoginErrors({login : err.response.data});
          }
        });
  };

  return (
    <div className="auth">
      <div className="auth__box">
        <div className="auth__header">
          <h1>{register ? "Register" : "Login"}</h1>
        </div>
        <form onSubmit={onSubmit}>
          {register && (
            <div className="auth__field">
              <label>First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
          )}
          {register && (
            <div className="auth__field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          )}
          {register && (
            <div className="auth__field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="auth__field">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth__field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {register && (
            <div className="auth__field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {registerErrors.confirmPassword && (
                <p className="auth__error">{registerErrors.confirmPassword}</p>
              )}
            </div>
          )}
          <div className="auth__footer">
            {registerErrors.register && (
              <p className="auth__error">{registerErrors.register}</p>
            )}

            {loginErrors.login && (
              <p className="auth__error">{loginErrors.login}</p>
            )}

            <button className="btn" type="submit">
              {register ? "Register" : "Login"}
            </button>
            {!register ? (
              <div className="auth__register">
                <p>
                  Not a member? <Link to="/register" onClick={resetErrors}>Register now</Link>
                </p>
              </div>
            ) : (
              <div className="auth__register">
                <p>
                  Already a member? <Link to="/" onClick={resetErrors}>Login now</Link>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthBox;
