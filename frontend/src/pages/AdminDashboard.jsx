import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
} from "../services/tourService";

const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    distance: "",
    photo: "",
    desc: "",
    price: "",
    maxGroupSize: "",
    lat: "",
    lng: "",
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchTours();
  }, [user, navigate]);

  const fetchTours = async () => {
    try {
      const response = await getAllTours();
      setTours(response.data);
    } catch (error) {
      toast.error("Failed to fetch tours");
    }
  };

  const handleShowModal = (tour = null) => {
    if (tour) {
      setSelectedTour(tour);
      setFormData(tour);
    } else {
      setSelectedTour(null);
      setFormData({
        title: "",
        city: "",
        address: "",
        distance: "",
        photo: "",
        desc: "",
        price: "",
        maxGroupSize: "",
        lat: "",
        lng: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTour(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with location
      const dataToSend = {
        ...formData,
        location: {
          lat: formData.lat,
          lng: formData.lng,
        },
      };
      if (selectedTour) {
        await updateTour(selectedTour._id, dataToSend);
        toast.success("Tour updated successfully");
      } else {
        await createTour(dataToSend);
        toast.success("Tour created successfully");
      }
      handleCloseModal();
      fetchTours();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      try {
        await deleteTour(id);
        toast.success("Tour deleted successfully");
        fetchTours();
      } catch (error) {
        toast.error("Failed to delete tour");
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Add New Tour
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>City</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour._id}>
              <td>{tour.title}</td>
              <td>{tour.city}</td>
              <td>Rs.{tour.price}</td>
              <td>
                <Button
                  variant="info"
                  className="me-2"
                  onClick={() => handleShowModal(tour)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(tour._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTour ? "Edit Tour" : "Add New Tour"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Distance</Form.Label>
                  <Form.Control
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Group Size</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    name="lat"
                    step="any"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              {selectedTour ? "Update Tour" : "Add Tour"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
