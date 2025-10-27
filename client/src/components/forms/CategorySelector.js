import React from 'react';
import { Form } from 'react-bootstrap';

const CategorySelector = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Catégorie de Publication</Form.Label>
        <Form.Select 
            name="subCategory" 
            value={postData.subCategory} 
            onChange={handleChangeInput}
            size="lg"
            required
        >
            <option value="">Sélectionnez une catégorie...</option>
            <option value="Voyage_Organise">Voyage Organisé</option>
            <option value="Location_Vacances">Location Vacances</option>
            <option value="hadj_Omra">Hadj & Omra</option>
            <option value="Reservations_Visa">Réservations & Visa</option>
            <option value="Sejour">Séjour</option>
            <option value="Croisiere">Croisière</option>
            <option value="Autre">Autre</option>
        </Form.Select>
        <Form.Text className="text-danger">Ce champ est requis</Form.Text>
    </Form.Group>
);

export default CategorySelector;