import React from 'react';
import { Form } from 'react-bootstrap';

const TitleInput = ({ postData, handleChangeInput, placeholder = "Titre de l'annonce" }) => (
    <Form.Group className="mb-3">
        <Form.Label>Titre</Form.Label>
        <Form.Control
            type="text"
            name="title"
            value={postData.title}
            onChange={handleChangeInput}
            placeholder={placeholder}
            required
        />
    </Form.Group>
);

export default TitleInput;