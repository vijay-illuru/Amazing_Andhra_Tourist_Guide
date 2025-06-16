import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";

import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
    role: "user",
    adminSecretKey: undefined,
  });

  const [showAdminFields, setShowAdminFields] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setCredentials((prev) => ({
      ...prev,
      role,
      adminSecretKey: role === "user" ? undefined : prev.adminSecretKey,
    }));
    setShowAdminFields(role === "admin");
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      dispatch({ type: "REGISTER_SUCCESS" });
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Register</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <select
                      id="role"
                      className="form-control"
                      onChange={handleRoleChange}
                      value={credentials.role}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </FormGroup>
                  {showAdminFields && (
                    <FormGroup>
                      <input
                        type="password"
                        placeholder="Admin Secret Key"
                        required
                        id="adminSecretKey"
                        onChange={handleChange}
                      />
                    </FormGroup>
                  )}
                  <Button className="btn secondary__btn auth__btn" type="submit">
                    Create Account
                  </Button>
                </Form>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
