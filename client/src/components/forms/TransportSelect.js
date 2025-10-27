import React from 'react';
import { Form } from 'react-bootstrap';

const TransportSelect = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Moyen de Transport</Form.Label>
        <Form.Select
            name="transporte"
            value={postData.transporte}
            onChange={handleChangeInput}
            required
        >
            <option value="">Sélectionnez...</option>
            <option value="Avion">Avion</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Voiture">Voiture</option>
            <option value="Bateau">Bateau</option>
        </Form.Select>
    </Form.Group>
);

export default TransportSelect;