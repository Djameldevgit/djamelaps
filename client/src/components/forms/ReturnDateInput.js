import React from 'react';
import { Form } from 'react-bootstrap';

const ReturnDateInput = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Date de Retour</Form.Label>
        <Form.Control
            type="date"
            name="fecharegreso"
            value={postData.fecharegreso}
            onChange={handleChangeInput}
            required
        />
    </Form.Group>
);

export default ReturnDateInput;