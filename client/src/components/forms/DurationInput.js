import React from 'react';
import { Form } from 'react-bootstrap';

const DurationInput = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Durée du Séjour</Form.Label>
        <Form.Control
            type="text"
            name="duracionviaje"
            value={postData.duracionviaje}
            onChange={handleChangeInput}
            placeholder="Ex: 4 jours / 3 nuitées"
            required
        />
    </Form.Group>
);

export default DurationInput;