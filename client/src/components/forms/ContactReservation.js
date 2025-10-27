import React from 'react';
import { Form } from 'react-bootstrap';

const ContactReservation = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Contact pour Réservation</Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            name="contacto"
            value={postData.contacto}
            onChange={handleChangeInput}
            placeholder="Téléphone, email, site web, réseaux sociaux..."
            required
        />
    </Form.Group>
);

export default ContactReservation;