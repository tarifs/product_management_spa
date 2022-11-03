import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import AppUrl from "../../service/AppUrl";
import Api from "../../service/Api";
import { toast } from "react-toastify";
import AppStorage from "../../service/AppStorage";

function RegisterModal(props) {
  const [errors, setErrors] = useState("");
  const [processing, setProcessing] = useState(false);

  const initialState = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const [userData, setUserData] = useState(initialState);

  const changeHandler = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setProcessing(true);
    axios
      .post(AppUrl.userRegister, userData, Api.getHeadersWithoutAuth())
      .then((res) => {
        if (res.data && res.data.status === "success") {
          AppStorage.clearUser();
          AppStorage.storeUser(res.data.token, res.data.user);
          setUserData({ ...initialState });
          document.getElementById("signup-form").reset();
          toast.success(res.data.message);
          setProcessing(false);
          setErrors("");
          props.onHide();
          props.afterRegistration(res.data);
        }
      })
      .catch((error) => {
        setProcessing(false);
        setErrors(error.response.data.errors);
      });
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="auth-modal auth-modal-content"
    >
      <Modal.Body>
        <button
          type="button"
          className="close menu-show-btn"
          onClick={() => props.onHide()}
        >
          <i className="bi bi-x-lg text-danger text-large"></i>
        </button>
        <div className="modal-body auth-modal-body">
          <div className="container">
            <div className="form-container sign-in-container text-center">
              <h1 className="auth-modal-title">Registration</h1>
              <form onSubmit={submitHandler} id="signup-form">
                <div className="my-3">
                  <label htmlFor="name" className="auth-modal-label form-label">
                    Full Name
                  </label>
                  <div className="shadow input-group">
                    <span className="auth-modal-input-icon input-group-text bg-primary">
                      <i className="icon fas fa-user" />
                    </span>
                    <input
                      id="name"
                      placeholder="Enter your full name"
                      type="name"
                      className="auth-modal-input form-control"
                      name="name"
                      required
                      onChange={changeHandler}
                    />
                  </div>
                  {errors && errors.name && (
                    <h5 className="validation-error">{errors.name[0]}</h5>
                  )}
                </div>
                <div className="my-3">
                  <label
                    htmlFor="email"
                    className="auth-modal-label form-label"
                  >
                    Email Address
                  </label>
                  <div className="shadow input-group">
                    <span className="auth-modal-input-icon input-group-text bg-primary">
                      <i className="icon fas fa-envelope" />
                    </span>
                    <input
                      id="email"
                      placeholder="Enter email address"
                      type="email"
                      className="auth-modal-input form-control"
                      name="email"
                      required
                      onChange={changeHandler}
                    />
                  </div>
                  {errors && errors.email && (
                    <h5 className="validation-error">{errors.email[0]}</h5>
                  )}
                </div>
                <div className="my-3">
                  <label
                    htmlFor="password"
                    className="auth-modal-label form-label"
                  >
                    Password
                  </label>
                  <div className="shadow input-group">
                    <span className="auth-modal-input-icon input-group-text bg-primary">
                      <i className="icon fas fa-lock" />
                    </span>
                    <input
                      id="password"
                      placeholder="Enter password"
                      type="password"
                      className="auth-modal-input form-control"
                      name="password"
                      required
                      onChange={changeHandler}
                    />
                  </div>
                  {errors && errors.password && (
                    <h5 className="validation-error">{errors.password[0]}</h5>
                  )}
                </div>
                <div className="my-3">
                  <label
                    htmlFor="password"
                    className="auth-modal-label form-label"
                  >
                    Confirm Password
                  </label>
                  <div className="shadow input-group">
                    <span className="auth-modal-input-icon input-group-text bg-primary">
                      <i className="icon fas fa-lock" />
                    </span>
                    <input
                      id="password_confirmation"
                      placeholder="Enter password again"
                      type="password"
                      className="auth-modal-input form-control"
                      name="password_confirmation"
                      required
                      onChange={changeHandler}
                    />
                  </div>
                  {errors && errors.password_confirmation && (
                    <h5 className="validation-error">
                      {errors.password_confirmation[0]}
                    </h5>
                  )}
                </div>
                <button
                  className="auth-modal-btn my-5 shadow"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <i className="fa fa-spin fa-spinner mr-2" />
                      Processing...
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;
