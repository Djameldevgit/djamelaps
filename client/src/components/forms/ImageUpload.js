import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const ImageUpload = ({ images, handleChangeImages, deleteImages, theme }) => {
    
    // Función para mostrar imagen/video
    const mediaShow = (src, isVideo = false) => {
        if (isVideo) {
            return (
                <video 
                    controls 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '150px',
                        filter: theme ? 'invert(1)' : 'invert(0)'
                    }}
                >
                    <source src={src} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
            );
        } else {
            return (
                <img 
                    src={src} 
                    alt="Preview" 
                    style={{ 
                        maxWidth: '100%', 
                        maxHeight: '150px',
                        filter: theme ? 'invert(1)' : 'invert(0)'
                    }}
                />
            );
        }
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">📷 Médias de l'Annonce</h5>
            </Card.Header>
            <Card.Body>
                {/* Preview des images */}
                {images.length > 0 && (
                    <div className="mb-3">
                        <h6>Médias sélectionnés ({images.length})</h6>
                        <Row>
                            {images.map((img, index) => (
                                <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                                    <div className="position-relative">
                                        {img.camera 
                                            ? mediaShow(img.camera)
                                            : img.url
                                                ? mediaShow(img.url, img.url.match(/video/i))
                                                : mediaShow(URL.createObjectURL(img), img.type.match(/video/i))
                                        }
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0"
                                            onClick={() => deleteImages(index)}
                                            style={{ transform: 'translate(50%, -50%)' }}
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Upload d'images */}
                <Form.Group>
                    <Form.Label className="btn btn-primary w-100">
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        Ajouter des Photos/Vidéos
                        <Form.Control 
                            type="file" 
                            multiple 
                            accept="image/*,video/*" 
                            onChange={handleChangeImages}
                            style={{ display: 'none' }}
                        />
                    </Form.Label>
                    <Form.Text className="text-muted">
                        Formats acceptés: JPG, PNG, MP4 (max. 5MB par fichier)
                    </Form.Text>
                </Form.Group>

                {/* Message si aucune image */}
                {images.length === 0 && (
                    <div className="text-center text-muted py-3">
                        <i className="fas fa-images fa-2x mb-2"></i>
                        <p>Aucun média sélectionné. Ajoutez des photos ou vidéos pour votre annonce.</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default ImageUpload;