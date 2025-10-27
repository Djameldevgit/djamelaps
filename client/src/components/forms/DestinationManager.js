import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

const DestinationManager = ({ postData, handleChangeInput }) => (
    <>
        {/* Destination 1 */}
        <Card className="mb-3">
            <Card.Header>
                <h6 className="mb-0">📍 Destination 1</h6>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ville Destination 1</Form.Label>
                            <Form.Select
                                name="destinacionvoyage1"
                                value={postData.destinacionvoyage1}
                                onChange={handleChangeInput}
                            >
                                <option value="">Choisir une destination...</option>
                                <option value="">Choisir une destination...</option>
                                <optgroup label="Destinations Nationales">
                                    <option value="Alger">Alger</option>
                                    <option value="Oran">Oran</option>
                                    <option value="Constantine">Constantine</option>
                                    <option value="Tlemcen">Tlemcen</option>
                                    <option value="Béjaïa">Béjaïa</option>
                                    <option value="Timimoun">Timimoun</option>
                                    <option value="Djanet">Djanet</option>
                                    <option value="Taghit">Taghit</option>
                                    <option value="Boussaâda">Boussaâda</option>
                                    <option value="Oued Souf">Oued Souf</option>
                                </optgroup>
                                <optgroup label="Destinations Internationales">
                                    <option value="Istanbul">Istanbul</option>
                                    <option value="Dubaï">Dubaï</option>
                                    <option value="Le Caire">Le Caire</option>
                                    <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                                    <option value="Tunis">Tunis</option>
                                    <option value="Sousse">Sousse</option>
                                    <option value="Djerba">Djerba</option>
                                    <option value="Moscou">Moscou</option>
                                    <option value="Saint Petersburg">Saint Petersburg</option>
                                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                                    <option value="Langkawi">Langkawi</option>
                                    <option value="Bakou">Bakou</option>
                                    <option value="Téhéran">Téhéran</option>
                                    <option value="Kashan">Kashan</option>
                                    <option value="Ispahan">Ispahan</option>
                                    <option value="Shiraz">Shiraz</option>
                                    <option value="New York">New York</option>
                                    <option value="Los Angeles">Los Angeles</option>
                                    <option value="Las Vegas">Las Vegas</option>
                                    <option value="San Francisco">San Francisco</option>
                                    <option value="Andalousie">Andalousie</option>
                                    <option value="Rome">Rome</option>
                                    <option value="Paris">Paris</option>
                                    <option value="Maldives">Maldives</option>
                                    <option value="Zanzibar">Zanzibar</option>
                                    <option value="Jordanie">Jordanie</option>
                                    <option value="Ouzbékistan">Ouzbékistan</option>
                                    <option value="Thaïlande">Thaïlande</option>
                                </optgroup>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type d'Hébergement</Form.Label>
                            <Form.Control
                                type="text"
                                name="voyage1hotel1"
                                value={postData.voyage1hotel1}
                                onChange={handleChangeInput}
                                placeholder="Hôtel, Appartement, Riad..."
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Nom de l'Établissement</Form.Label>
                    <Form.Control
                        type="text"
                        name="voyage1nombrehotel1"
                        value={postData.voyage1nombrehotel1}
                        onChange={handleChangeInput}
                        placeholder="Nom de l'hôtel ou appartement"
                    />
                </Form.Group>
            </Card.Body>
        </Card>

        {/* Destination 2 */}
        <Card className="mb-3">
            <Card.Header>
                <h6 className="mb-0">📍 Destination 2</h6>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ville Destination 2</Form.Label>
                            <Form.Select
                                name="destinacionvoyage2"
                                value={postData.destinacionvoyage2}
                                onChange={handleChangeInput}
                            >
                                <option value="">Choisir une destination...</option>
                                {/* Mismas opciones que Destination 1 */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type d'Hébergement</Form.Label>
                            <Form.Control
                                type="text"
                                name="voyage2hotel2"
                                value={postData.voyage2hotel2}
                                onChange={handleChangeInput}
                                placeholder="Hôtel, Appartement, Riad..."
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Nom de l'Établissement</Form.Label>
                    <Form.Control
                        type="text"
                        name="voyage1nombrehotel2"
                        value={postData.voyage1nombrehotel2}
                        onChange={handleChangeInput}
                        placeholder="Nom de l'hôtel ou appartement"
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    </>
);

export default DestinationManager;