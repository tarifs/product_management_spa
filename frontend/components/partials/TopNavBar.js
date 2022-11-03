import { Container, Navbar, NavDropdown, Nav } from "react-bootstrap";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import SignInModal from "../auth/SignInModal";
import RegisterModal from "../auth/RegisterModal";
import Logout from "../auth/Logout";
import AppStorage from "../../service/AppStorage";
import { useRouter } from "next/router";

function TopNavBar(props) {
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [registerModalShow, setRegisterModalShow] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState({});

  const afterLogout = () => {
    setUser({});
  };

  const afterSignIn = (user) => {
    setUser(user);
  };

  const afterRegistration = (data) => {
    if (data && data.status === "success") {
      AppStorage.clearUser();
      AppStorage.storeUser(data.token, data.user);
      router.push("/products");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(AppStorage.getUser());
    }
  }, [typeof window !== "undefined"]);

  return (
    <>
      <Navbar className="nav" variant="dark" style={props.style}>
        <Container>
          <Navbar.Brand href="/">
            <Link href="/" passHref>
              <h1 className="text-dark">Appnap Store</h1>
            </Link>
          </Navbar.Brand>
          <Nav className="ml-auto">
            <div
              className={
                "nav-icons d-flex align-items-center " +
                (mobileMenu ? "nav-icons-show" : "nav-icons-hide")
              }
            >
              <Nav>
                <NavDropdown
                  title={<i className="bi bi-person-circle" />}
                  id="nav-dropdown"
                >
                  {(!user || !Object.keys(user).length) && (
                    <>
                      <NavDropdown.Item onClick={() => setLoginModalShow(true)}>
                        <a href="#">Login</a>
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => setRegisterModalShow(true)}
                      >
                        <a href="#">Register</a>
                      </NavDropdown.Item>
                    </>
                  )}
                  {user && Object.keys(user).length > 0 && (
                    <>
                      <Link
                        className="text-danger"
                        href={`/products`}
                        passHref
                      >
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </Link>
                      <Logout afterLogout={afterLogout} />
                    </>
                  )}
                </NavDropdown>
              </Nav>
            </div>
            <i
              onClick={() => {
                setMobileMenu(!mobileMenu);
              }}
              className="bi bi-three-dots-vertical mobile-menu"
            />
          </Nav>
        </Container>
      </Navbar>
      <SignInModal
        afterSignIn={afterSignIn}
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
      />
      <RegisterModal
        afterRegistration={afterRegistration}
        show={registerModalShow}
        onHide={() => setRegisterModalShow(false)}
      />
      <div className="py-2 bg-primary"></div>
    </>
  );
}

export default TopNavBar;
