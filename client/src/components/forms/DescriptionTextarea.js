import React from 'react';
import { Form } from 'react-bootstrap';

const DescriptionTextarea = ({ postData, handleChangeInput, placeholder = "Description détaillée..." }) => (
    <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={postData.description}
            onChange={handleChangeInput}
            placeholder={placeholder}
            required
        />
    </Form.Group>
);

export default DescriptionTextarea;