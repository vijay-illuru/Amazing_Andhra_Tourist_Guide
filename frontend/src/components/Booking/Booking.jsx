import React, { useState, useContext } from "react";
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

const Booking = ({ tour, avgRating }) => {
  const { price, reviews, title } = tour;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    userId: user && user._id,
    userEmail: user && user.email,
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: 1,
    bookAt: "",
  });

  const handlerChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;

    if (id === "guestSize") {
      const parsed = parseInt(value, 10);
      newValue = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }

    setBooking((prev) => ({ ...prev, [id]: newValue }));
  };

  const serviceFee = 10;
  const totalAmount =
    Number(price) * Math.max(1, Number(booking.guestSize)) + Number(serviceFee);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      if (!user || user === undefined || user === null) {
        return alert("Please sign in");
      }

      const res = await fetch(`${BASE_URL}/booking`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(booking),
      });

      const result = await res.json();

      if (!res.ok) {
        return alert(result.message);
      }
      navigate("/thank-you");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          Rs.{price} <span>/per person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>

      {/*============== booking form =============*/}
      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              onChange={handlerChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder="Phone"
              id="phone"
              required
              onChange={handlerChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" id="bookAt" required onChange={handlerChange} />
            <input
              type="number"
              id="guestSize"
              placeholder="Guests"
              min="1"
              value={booking.guestSize}
              onChange={handlerChange}
              required
            />
          </FormGroup>
        </Form>
      </div>
      {/*============== booking end =============*/}

      {/*=============== booking bottom ============== */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              Rs.{price} <i className="ri-close-line"></i> {booking.guestSize}{" "}
              person
              {booking.guestSize > 1 ? "s" : ""}
            </h5>
            <span> Rs.{Number(price) * booking.guestSize}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service charge</h5>
            <span> Rs.{serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span> Rs.{totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Booking;
