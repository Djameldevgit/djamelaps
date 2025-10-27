import React from 'react';
import { Form } from 'react-bootstrap';

const PensionSelect = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Type de Pension</Form.Label>
        <Form.Select
            name="serviciosdelhotel"
            value={postData.serviciosdelhotel}
            onChange={handleChangeInput}
        >
            <option value="">Sélectionnez le type de pension...</option>
            <option value="Complète">Pension Complète</option>
            <option value="Demi-pension">Demi-pension</option>
            <option value="Petit déjeuner">Petit déjeuner uniquement</option>
            <option value="Sans repas">Sans repas</option>
        </Form.Select>
    </Form.Group>
);

export default PensionSelect;