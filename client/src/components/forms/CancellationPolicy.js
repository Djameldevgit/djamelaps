import React from 'react';
import { Form } from 'react-bootstrap';

const CancellationPolicy = ({ postData, handleChangeInput }) => (
    <Form.Group className="mb-3">
        <Form.Label>Politique d'Annulation</Form.Label>
        <Form.Select
            name="cancelarreserva"
            value={postData.cancelarreserva}
            onChange={handleChangeInput}
        >
            <option value="">Sélectionnez une politique...</option>
            <option value="Flexible">Flexible (annulation gratuite jusqu'à 24h avant)</option>
            <option value="Moderee">Modérée (50% de remboursement jusqu'à 7 jours avant)</option>
            <option value="Strict">Stricte (non remboursable)</option>
        </Form.Select>
    </Form.Group>
);

export default CancellationPolicy;