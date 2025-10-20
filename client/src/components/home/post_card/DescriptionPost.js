import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Row, 
  Col, 
  Badge, 
  Button,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

const DescriptionPost = ({ post }) => {
  const [readMore, setReadMore] = useState(false);
  const { languageReducer } = useSelector(state => state);
  const { t } = useTranslation(['descripcion', 'createpost']); // Múltiples namespaces
  const lang = languageReducer.language || 'fr'; // Default francés

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        {/* Header con título principal */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-globe text-primary me-2 fs-5"></i>
              <h4 className="mb-0 text-dark fw-bold">{post.title || t('createpost:app_otro')}</h4>
            </div>
            
            {/* Badges para tipo de app y oferta */}
            <div className="d-flex flex-wrap gap-2 mb-2">
              {/* Tipo de Aplicación */}
              {post.appType && (
                <Badge bg="primary" className="fs-6">
                  <i className="fas fa-mobile-alt me-1"></i>
                  {t(`createpost:app_${post.appType.replace(/-/g, '_')}`, post.appType)}
                </Badge>
              )}
              
              {/* Tipo de Oferta */}
              {post.offerType && (
                <Badge bg="success" className="fs-6">
                  <i className="fas fa-tag me-1"></i>
                  {t(`createpost:${post.offerType}_price`, post.offerType)}
                </Badge>
              )}
            </div>
          </Col>
        </Row>

        <ListGroup variant="flush">
          {/* Tipo de Aplicación - Detallado */}
          {post.appType && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-layer-group text-info me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('createpost:app_type_label')}</h6>
                  <div className="d-flex align-items-center">
                    <Badge bg="info" className="me-2 fs-6">
                      {t(`createpost:app_${post.appType.replace(/-/g, '_')}`, post.appType)}
                    </Badge>
                    <span className="text-muted small">
                      {t('app_type_description')}
                    </span>
                  </div>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Contenido principal */}
          {post.content && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-file-alt text-muted me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('content')}</h6>
                  <p className="mb-0 text-dark">{post.content}</p>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Información de Precios */}
          {(post.price || post.priceType) && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-money-bill-wave text-success me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-3">{t('createpost:pricing_section')}</h6>
                  
                  <Row className="g-3">
                    {/* Precio */}
                    {post.price && (
                      <Col xs={12} md={4}>
                        <div className="text-center p-3 border rounded">
                          <i className="fas fa-dollar-sign text-success fs-4 mb-2"></i>
                          <div className="small text-muted">{t('createpost:price_label')}</div>
                          <div className="fw-bold fs-4 text-success">{post.price}</div>
                        </div>
                      </Col>
                    )}

                    {/* Moneda */}
                    {post.priceType && (
                      <Col xs={12} md={4}>
                        <div className="text-center p-3 border rounded">
                          <i className="fas fa-coins text-warning fs-4 mb-2"></i>
                          <div className="small text-muted">{t('createpost:currency_label')}</div>
                          <div className="fw-bold fs-5">
                            {t(`createpost:${post.priceType.replace(/-/g, '_')}`, post.priceType)}
                          </div>
                        </div>
                      </Col>
                    )}

                    {/* Tipo de Oferta */}
                    {post.offerType && (
                      <Col xs={12} md={4}>
                        <div className="text-center p-3 border rounded">
                          <i className="fas fa-handshake text-primary fs-4 mb-2"></i>
                          <div className="small text-muted">{t('createpost:offer_type_label')}</div>
                          <div className="fw-bold fs-5">
                            {t(`createpost:${post.offerType}_price`, post.offerType)}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Features/Características */}
          {post.features && post.features.length > 0 && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-cogs text-warning me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-3">{t('createpost:features_section')}</h6>
                  <Row className="g-2">
                    {post.features.map((feature, index) => (
                      <Col key={index} xs={12} sm={6} lg={4}>
                        <div className="d-flex align-items-center p-2 border rounded">
                          <i className="fas fa-check text-success me-2"></i>
                          <span className="text-dark small">
                            {t(`createpost:feature_${feature.replace(/-/g, '_')}`, feature)}
                          </span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div className="text-center mt-3">
                    <Badge bg="warning" text="dark" className="fs-6">
                      {post.features.length} {t('features_selected')}
                    </Badge>
                  </div>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Información de Multimedia */}
          {post.images && post.images.length > 0 && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-images text-purple me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('createpost:media_section')}</h6>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="fw-medium text-dark">
                        {post.images.length} {post.images.length > 1 ? t('images') : t('image')}
                      </span>
                      <span className="text-muted small ms-2">
                        {t('image_gallery_description')}
                      </span>
                    </div>
                    <Badge bg="purple" className="fs-6">
                      <i className="fas fa-camera me-1"></i>
                      {t('gallery')}
                    </Badge>
                  </div>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Fecha de publicación */}
          <ListGroupItem className="d-flex align-items-center border-0 px-0 py-2">
            <i className="fas fa-calendar-alt text-muted me-3" style={{ width: '20px' }}></i>
            <div className="d-flex flex-column">
              <span className="text-muted small">{t('publishedOn')}</span>
              <span className="fw-medium text-dark">
                {new Date(post.createdAt).toLocaleDateString(lang)} {t('at')} {new Date(post.createdAt).toLocaleTimeString(lang)}
              </span>
            </div>
          </ListGroupItem>

          {/* Estadísticas */}
          {(post.vistas || post.likes?.length > 0 || post.comments?.length > 0) && (
            <ListGroupItem className="border-0 px-0 py-3">
              <h6 className="text-muted mb-3">{t('statistics')}</h6>
              <Row className="g-3">
                {/* Vistas */}
                {(post.vistas || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center p-2 border rounded">
                      <i className="fas fa-eye text-info fs-5 mb-1"></i>
                      <div className="small text-muted">{t('views')}</div>
                      <div className="fw-bold fs-6 text-dark">{post.vistas}</div>
                    </div>
                  </Col>
                )}

                {/* Likes */}
                {(post.likes || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center p-2 border rounded">
                      <i className="fas fa-thumbs-up text-danger fs-5 mb-1"></i>
                      <div className="small text-muted">{t('likes')}</div>
                      <div className="fw-bold fs-6 text-dark">{post.likes.length}</div>
                    </div>
                  </Col>
                )}

                {/* Commentaires */}
                {(post.comments || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center p-2 border rounded">
                      <i className="fas fa-comments text-warning fs-5 mb-1"></i>
                      <div className="small text-muted">{t('comments')}</div>
                      <div className="fw-bold fs-6 text-dark">{post.comments.length}</div>
                    </div>
                  </Col>
                )}
              </Row>
            </ListGroupItem>
          )}

          {/* Información Adicional */}
          {(post.link || post.telefono) && (
            <ListGroupItem className="border-0 px-0 py-3">
              <h6 className="text-muted mb-3">{t('additional_info')}</h6>
              
              {/* Lien */}
              {post.link && (
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-link text-primary me-3" style={{ width: '20px' }}></i>
                  <div className="flex-grow-1">
                    <Button
                      href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      size="sm"
                      className="mt-1"
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      {t('visitSite')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Téléphone */}
              {post.telefono && (
                <div className="d-flex align-items-center">
                  <i className="fas fa-phone-alt text-info me-3" style={{ width: '20px' }}></i>
                  <div className="d-flex flex-column">
                    <a 
                      href={`tel:${post.telefono}`} 
                      className="fw-medium text-decoration-none text-dark"
                    >
                      <i className="fas fa-phone me-1"></i>
                      {post.telefono}
                    </a>
                  </div>
                </div>
              )}
            </ListGroupItem>
          )}

          {/* Botón de acción */}
      
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default DescriptionPost;