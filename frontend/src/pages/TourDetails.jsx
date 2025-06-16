import React, { useEffect, useRef, useState, useContext } from "react";
import "../styles/tour-details.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";
import calculateAvgRating from "./../utils/avgRating";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking";
import useFetch from "./../hooks/useFetch";
import { BASE_URL } from "./../utils/config";
import { AuthContext } from "./../context/AuthContext";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const TourDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRatings] = useState(null);
  const { user } = useContext(AuthContext);

  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);

  // ✅ Destructure location properly
  const {
    photo,
    title,
    desc,
    price,
    address,
    reviews,
    city,
    distance,
    maxGroupSize,
    location,
  } = tour || {};

  // ✅ Safely access lat & lng from location
  const lat = location?.lat;
  const lng = location?.lng;

  const { totalRating, avgRating } = calculateAvgRating(reviews || []);
  const options = { day: "numeric", month: "long", year: "numeric" };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  console.log("Map Coordinates:", lat, lng);
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!user) return alert("Please sign in");

      const reviewObj = {
        username: user?.username,
        reviewText,
        rating: tourRating,
      };

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewObj),
      });

      const result = await res.json();
      if (!res.ok) return alert(result.message);
      alert(result.message);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);

  return (
    <section>
      <Container>
        {loading && <h4 className="text-center pt-5">Loading.....</h4>}
        {error && <h4 className="text-center pt-5">{error}</h4>}
        {!loading && !error && (
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i
                        className="ri-star-fill"
                        style={{ color: "var(--secondary-color)" }}
                      ></i>
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? (
                        "Not rated"
                      ) : (
                        <span>({reviews?.length})</span>
                      )}
                    </span>
                    <span>
                      <i className="ri-map-pin-user-fill"></i> {address}
                    </span>
                  </div>

                  <div className="tour__extra-details">
                    <span>
                      <i className="ri-map-pin-2-line"></i> {city}
                    </span>
                    <span>
                      <i className="ri-money-rupee-circle-line"></i> Rs {price}{" "}
                      /per person
                    </span>
                    <span>
                      <i className="ri-map-pin-time-line"></i> {distance}
                    </span>
                    <span>
                      <i className="ri-group-line"></i> {maxGroupSize} people
                    </span>
                  </div>

                  <h5>Description</h5>
                  <p>{desc}</p>

                  {/* ✅ MAP SECTION */}
                  <div className="tour__map mt-4">
                    <h5>Location</h5>
                    {isLoaded && lat && lng && (
                      <div
                        style={{
                          height: "400px",
                          width: "100%",
                          marginTop: "2rem",
                        }}
                      >
                        <GoogleMap
                          center={{
                            lat: parseFloat(lat),
                            lng: parseFloat(lng),
                          }}
                          zoom={13}
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                        >
                          <Marker
                            position={{
                              lat: parseFloat(lat),
                              lng: parseFloat(lng),
                            }}
                            icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                          />
                        </GoogleMap>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length} reviews)</h4>

                  {/* Only show review form for non-admin users */}
                  {user && user.role !== "admin" && (
                    <Form onSubmit={submitHandler}>
                      <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setTourRatings(star)}
                            style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#ffb400' }}
                          >
                            {tourRating && star <= tourRating ? (
                              <i className="ri-star-s-fill"></i>
                            ) : (
                              <i className="ri-star-s-line"></i>
                            )}
                          </span>
                        ))}
                      </div>

                      <div className="review__input">
                        <input
                          type="text"
                          ref={reviewMsgRef}
                          placeholder="Share your thoughts"
                          required
                        />
                        <button
                          className="btn primary__btn text-white"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  )}

                  <ListGroup className="user__reviews">
                    {reviews?.map((review, index) => (
                      <div className="review__item" key={index}>
                        <img src={avatar} alt="" />
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.username}</h5>
                              <p>
                                {new Date(review.createdAt).toLocaleDateString(
                                  "en-US",
                                  options
                                )}
                              </p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating} <i className="ri-star-s-fill"></i>
                            </span>
                          </div>
                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg="4">
              {/* Booking Section - only for non-admin users */}
              {user && user.role !== "admin" && (
                <Booking tour={tour} avgRating={avgRating} />
              )}
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default TourDetails;
