import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
      try {
        const res = await fetch(`${BASE_URL}/users/profile/me`, {
          credentials: "include",
        });
        const result = await res.json();
        if (res.ok) {
          setProfile(result);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate, submitting]);

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

  if (loading) return <h4 className="text-center pt-5">Loading...</h4>;
  if (!profile) return null;

  const { user: userInfo, bookings } = profile;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col lg="6" className="m-auto">
          <Card>
            <CardBody>
              <h3>User Profile</h3>
              <p><strong>Name:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Role:</strong> {userInfo.role}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="8" className="m-auto">
          <h4 className="mb-3">Booked Tours</h4>
          {bookings.length === 0 ? (
            <p>No tours booked</p>
          ) : (
            bookings.map((booking, idx) => (
              <Card className="mb-3" key={idx}>
                <CardBody>
                  <h5>{booking.tour ? booking.tour.title : booking.tourName}</h5>
                  {booking.tour && (
                    <>
                      <p><strong>City:</strong> {booking.tour.city}</p>
                      <p><strong>Address:</strong> {booking.tour.address}</p>
                      <p><strong>Price:</strong> Rs.{booking.tour.price}</p>
                    </>
                  )}
                  <p><strong>Booking Date:</strong> {new Date(booking.bookAt).toLocaleDateString()}</p>
                  <p><strong>Guests:</strong> {booking.guestSize}</p>
                  {/* Review section */}
                  {booking.tour && (
                    <div className="mt-3">
                      <strong>Review:</strong>{" "}
                      {/* Check if user already reviewed this tour */}
                      {booking.tour.reviews && booking.tour.reviews.some(r => r.username === user.username) ? (
                        <span className="text-success ms-2">You already reviewed this tour.</span>
                      ) : (
                        reviewing === booking.tour._id ? (
                          <Form
                            onSubmit={e => {
                              e.preventDefault();
                              handleReviewSubmit(booking.tour._id);
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  style={{ cursor: 'pointer', fontSize: '1.3rem', color: '#ffb400' }}
                                >
                                  {reviewRating && star <= reviewRating ? (
                                    <i className="ri-star-s-fill"></i>
                                  ) : (
                                    <i className="ri-star-s-line"></i>
                                  )}
                                </span>
                              ))}
                            </div>
                            <input
                              type="text"
                              className="form-control mb-2"
                              placeholder="Write your review"
                              value={reviewText}
                              onChange={e => setReviewText(e.target.value)}
                              required
                            />
                            <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                              Submit
                            </button>
                            <button
                              className="btn btn-link btn-sm ms-2"
                              type="button"
                              onClick={() => setReviewing(null)}
                            >
                              Cancel
                            </button>
                          </Form>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm mt-2"
                            onClick={() => setReviewing(booking.tour._id)}
                          >
                            Write Review
                          </button>
                        )
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 