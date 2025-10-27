import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const AddressInput = ({ 
    postData, 
    handleChangeInput, 
    wilayasOptions, 
    communesOptions, 
    handleWilayaChange, 
    handleCommuneChange 
}) => (
    <>
        <Form.Group className="mb-3">
            <Form.Label>Adresse Complète</Form.Label>
            <Form.Control
                type="text"
                name="adress"
                value={postData.adress}
                onChange={handleChangeInput}
                placeholder="Adresse détaillée"
            />
        </Form.Group>

        <Row>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Wilaya</Form.Label>
                    <Form.Select
                        name="wilaya"
                        value={postData.wilaya}
                        onChange={handleWilayaChange}
                        required
                    >
                        <option value="">Sélectionnez une wilaya</option>
                        {wilayasOptions}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Commune</Form.Label>
                    <Form.Select
                        name="commune"
                        value={postData.commune}
                        onChange={handleCommuneChange}
                        required
                    >
                        <option value="">Sélectionnez la commune</option>
                        {communesOptions}
                    </Form.Select>
                </Form.Group>
            </Col>
        </Row>
    </>
);

export default AddressInput;