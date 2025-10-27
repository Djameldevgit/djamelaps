import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Horariodesalida = ({ postData, handleChangeInput }) => (
    <Row>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Date de Départ</Form.Label>
                <Form.Control
                    type="date"
                    name="datedepar"
                    value={postData.datedepar}
                    onChange={handleChangeInput}
                    required
                />
            </Form.Group>
        </Col>
        <Col md={6}>
            <Form.Group className="mb-3">
                <Form.Label>Heure de Départ</Form.Label>
                <Form.Control
                    type="time"
                    name="horadudepar"
                    value={postData.horadudepar}
                    onChange={handleChangeInput}
                    required
                />
            </Form.Group>
        </Col>
    </Row>
);

export default Horariodesalida;