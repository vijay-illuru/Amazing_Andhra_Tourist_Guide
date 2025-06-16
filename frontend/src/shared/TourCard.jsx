import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import calculateAvgRating from "../utils/avgRating";

import "./tour-card.css";

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, featured, reviews } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  return (
    <div className="tour__card h-100">
      <Card className="h-100 d-flex flex-column">
        <div className="tour__img">
          <img src={photo} alt="tour-img" />
          {featured && <span>Featured</span>}
        </div>

        <CardBody className="d-flex flex-column justify-content-between flex-grow-1">
          <div>
            <div className="card__top d-flex align-items-center justify-content-between">
              <span className="tour__location d-flex align-items-center gap-1">
                <i className="ri-map-pin-fill"></i> {city}
              </span>
              <span className="tour__rating d-flex align-items-center gap-1">
                <i className="ri-star-fill"></i>{" "}
                {avgRating === 0 ? null : avgRating}
                {totalRating === 0 ? (
                  "Not rated"
                ) : (
                  <span>({reviews.length})</span>
                )}
              </span>
            </div>

            <h5 className="tour__title mt-2">
              <Link to={`/tours/${_id}`}>{title}</Link>
            </h5>
          </div>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              Rs.{price} <span>/per person</span>
            </h5>

            <button className="btn booking__btn">
              <Link to={`/tours/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
