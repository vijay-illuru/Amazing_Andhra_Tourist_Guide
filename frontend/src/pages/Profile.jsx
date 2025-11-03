import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import CommonSection from "../shared/CommonSection";
import Subtitle from "../shared/Subtitle";
import userImg from "../assets/images/user.png";
import "../styles/profile.css";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewing, setReviewing] = useState(null); // tourId being reviewed
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/users/profile/me`, {
          credentials: "include",
        });
        const result = await res.json();
        if (res.ok) {
          setProfile(result);
        } else {
          // If token is invalid, clear user and redirect to login
          if (result.message === "Token is invalid" || result.message === "You're not authorized") {
            dispatch({ type: "LOGOUT" });
            navigate("/login");
            return;
          }
          setError(result.message || "Failed to load profile");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate, submitting, dispatch]);

  const handleReviewSubmit = async (tourId) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/review/${tourId}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: user.username,
          reviewText,
          rating: reviewRating,
        }),
      });
      const result = await res.json();
      if (!res.ok) return alert(result.message);
      alert("Review submitted!");
      setReviewing(null);
      setReviewText("");
      setReviewRating(0);
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <CommonSection title={"My Profile"} />
        <section>
          <Container>
            <h4 className="text-center pt-5">Loading...</h4>
          </Container>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CommonSection title={"My Profile"} />
        <section>
          <Container>
            <div className="text-center pt-5">
              <h4 className="text-danger">Error: {error}</h4>
              <p>Please try refreshing the page.</p>
            </div>
          </Container>
        </section>
      </>
    );
  }

  if (!profile || !profile.user) {
    return (
      <>
        <CommonSection title={"My Profile"} />
        <section>
          <Container>
            <div className="text-center pt-5">
              <h4>No profile data available</h4>
              <p>Please try logging in again.</p>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const { user: userInfo, bookings = [] } = profile;

  return (
    <>
      <CommonSection title={"My Profile"} />
      <section>
        <Container>
          {/* Profile Info Section */}
          <Row className="mb-5">
            <Col lg="12">
              <div className="profile__header mb-5">
                <Subtitle subtitle={"User Information"} />
              </div>
            </Col>
            <Col lg="8" className="m-auto">
              <Card className="profile__card">
                <CardBody className="p-4">
                  <div className="profile__info">
                    <div className="profile__avatar">
                      <img src={userImg} alt="user avatar" />
                    </div>
                    <div className="profile__details">
                      <h3 className="profile__name">{userInfo.username}</h3>
                      <div className="profile__meta">
                        <span className="profile__meta-item">
                          <i className="ri-mail-line"></i> {userInfo.email}
                        </span>
                        <span className="profile__meta-item">
                          <i className="ri-user-settings-line"></i> {userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Booked Tours Section */}
          <Row>
            <Col lg="12">
              <div className="profile__header mb-4">
                <Subtitle subtitle={`My Bookings (${bookings.length})`} />
              </div>
            </Col>
            {bookings.length === 0 ? (
              <Col lg="12">
                <div className="no__bookings">
                  <i className="ri-calendar-check-line"></i>
                  <h4>No tours booked yet</h4>
                  <p>Start exploring amazing destinations and book your first tour!</p>
                  <Link to="/tours" className="primary__btn">
                    Explore Tours
                  </Link>
                </div>
              </Col>
            ) : (
              bookings.map((booking, idx) => (
                <Col lg="6" md="6" className="mb-4" key={idx}>
                  <Card className="booking__card">
                    {booking.tour && booking.tour.photo && (
                      <div className="booking__img">
                        <img src={booking.tour.photo} alt={booking.tour.title} />
                      </div>
                    )}
                    <CardBody>
                      <div className="booking__header">
                        <h5 className="booking__title">
                          {booking.tour ? (
                            <Link to={`/tours/${booking.tour._id}`}>{booking.tour.title}</Link>
                          ) : (
                            booking.tourName
                          )}
                        </h5>
                        {booking.tour && (
                          <span className="booking__location">
                            <i className="ri-map-pin-fill"></i> {booking.tour.city}
                          </span>
                        )}
                      </div>

                      <div className="booking__details">
                        <div className="booking__detail-item">
                          <i className="ri-calendar-event-line"></i>
                          <span>
                            <strong>Booking Date:</strong> {new Date(booking.bookAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="booking__detail-item">
                          <i className="ri-group-line"></i>
                          <span>
                            <strong>Guests:</strong> {booking.guestSize}
                          </span>
                        </div>
                        {booking.tour && (
                          <>
                            <div className="booking__detail-item">
                              <i className="ri-map-pin-2-line"></i>
                              <span>
                                <strong>Location:</strong> {booking.tour.address}
                              </span>
                            </div>
                            <div className="booking__detail-item">
                              <i className="ri-money-rupee-circle-line"></i>
                              <span>
                                <strong>Price:</strong> Rs.{booking.tour.price} <span className="text-muted">/per person</span>
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Review section */}
                      {booking.tour && (
                        <div className="booking__review mt-3 pt-3 border-top">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <strong>Your Review:</strong>
                            {booking.tour.reviews && booking.tour.reviews.some(r => r.username === user.username) ? (
                              <span className="review__status">
                                <i className="ri-checkbox-circle-fill"></i> Reviewed
                              </span>
                            ) : null}
                          </div>
                          {booking.tour.reviews && booking.tour.reviews.some(r => r.username === user.username) ? (
                            <div className="review__submitted">
                              <p className="text-success mb-0">
                                <i className="ri-check-line"></i> You have already reviewed this tour.
                              </p>
                            </div>
                          ) : reviewing === booking.tour._id ? (
                            <Form
                              onSubmit={e => {
                                e.preventDefault();
                                handleReviewSubmit(booking.tour._id);
                              }}
                            >
                              <div className="d-flex align-items-center gap-2 mb-3 rating__group">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className="rating__star"
                                  >
                                    {reviewRating && star <= reviewRating ? (
                                      <i className="ri-star-s-fill"></i>
                                    ) : (
                                      <i className="ri-star-s-line"></i>
                                    )}
                                  </span>
                                ))}
                              </div>
                              <div className="review__input-group">
                                <input
                                  type="text"
                                  className="form-control mb-2 review__input"
                                  placeholder="Write your review..."
                                  value={reviewText}
                                  onChange={e => setReviewText(e.target.value)}
                                  required
                                />
                                <div className="d-flex gap-2">
                                  <button className="btn primary__btn text-white btn-sm" type="submit" disabled={submitting}>
                                    Submit Review
                                  </button>
                                  <button
                                    className="btn secondary__btn btn-sm"
                                    type="button"
                                    onClick={() => {
                                      setReviewing(null);
                                      setReviewText("");
                                      setReviewRating(0);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </Form>
                          ) : (
                            <button
                              className="btn primary__btn text-white btn-sm"
                              onClick={() => setReviewing(booking.tour._id)}
                            >
                              <i className="ri-edit-box-line"></i> Write Review
                            </button>
                          )}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Profile; 