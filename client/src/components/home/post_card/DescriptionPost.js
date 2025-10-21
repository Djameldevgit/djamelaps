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
  ListGroupItem,
  Container
} from 'react-bootstrap';

const DescriptionPost = ({ post }) => {
  const [readMore, setReadMore] = useState(false);
  const { languageReducer, theme } = useSelector(state => state);
  const { t, i18n } = useTranslation('createpost');
  const lang = languageReducer.language || 'fr';
  const isRTL = i18n.language === 'ar'; // Detectar si es árabe

  // Función para obtener iconos basados en RTL
  const getIconClass = (iconName) => {
    return isRTL ? `${iconName} ms-2` : `${iconName} me-2`;
  };

  // Función para obtener clases de alineación
  const getAlignClass = () => {
    return isRTL ? 'text-end' : 'text-start';
  };

  // Función para obtener clases flex
  const getFlexClass = () => {
    return isRTL ? 'flex-row-reverse' : 'flex-row';
  };

  return (
    <Container fluid className="px-0">
      <Card className={`border-0 shadow-sm ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
        <Card.Body className="p-4">
          {/* Header con título principal y link */}
          <Row className="mb-4">
            <Col>
              <div className={`d-flex align-items-center justify-content-between mb-3 ${getFlexClass()}`}>
                <div className={`d-flex align-items-center ${getFlexClass()}`}>
                  <i className={getIconClass("fas fa-globe text-primary fs-5")}></i>
                  <h4 className="mb-0 fw-bold">{post.title || t('createpost:app_otro')}</h4>
                </div>
                
                {/* Botón de link a la aplicación */}
                {post.link && (
                  <Button
                    href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="success"
                    size="sm"
                    className={`d-flex align-items-center ${getFlexClass()}`}
                  >
                    <i className={getIconClass("fas fa-external-link-alt")}></i>
                    {t('visit_live_app')}
                  </Button>
                )}
              </div>
              
              {/* Badges para tipo de app y oferta */}
              <div className={`d-flex flex-wrap gap-2 mb-3 ${isRTL ? 'justify-content-end' : ''}`}>
                {/* Tipo de Aplicación */}
                {post.appType && (
                  <Badge bg="primary" className="fs-6 d-flex align-items-center">
                    <i className={getIconClass("fas fa-mobile-alt")}></i>
                    {t(`createpost:app_${post.appType.replace(/-/g, '_')}`, post.appType)}
                  </Badge>
                )}
                
                {/* Tipo de Oferta */}
                {post.offerType && (
                  <Badge bg="success" className="fs-6 d-flex align-items-center">
                    <i className={getIconClass("fas fa-tag")}></i>
                    {t(`createpost:${post.offerType}_price`, post.offerType)}
                  </Badge>
                )}

                {/* Badge para indicar que tiene link */}
                {post.link && (
                  <Badge bg="info" className="fs-6 d-flex align-items-center">
                    <i className={getIconClass("fas fa-link")}></i>
                    {t('live_demo')}
                  </Badge>
                )}
              </div>
            </Col>
          </Row>

          <ListGroup variant="flush" className={getAlignClass()}>
            {/* ENLACE DE LA APLICACIÓN - Nueva sección destacada */}
            {post.link && (
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-center ${getFlexClass()}`}>
                  <i className="fas fa-rocket text-success fs-4" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-2">{t('app_link')}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1 me-3">
                        <code className={`p-2 rounded ${theme ? 'bg-secondary text-light' : 'bg-light text-dark'}`}>
                          {post.link}
                        </code>
                      </div>
                      <Button
                        href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        size="sm"
                        className={`d-flex align-items-center ${getFlexClass()}`}
                      >
                        <i className={getIconClass("fas fa-external-link-alt")}></i>
                        {t('open_app')}
                      </Button>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      <i className={getIconClass("fas fa-info-circle")}></i>
                      {t('app_link_description')}
                    </small>
                  </div>
                </div>
              </ListGroupItem>
            )}

            {/* Tipo de Aplicación - Detallado */}
            {post.appType && (
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-start ${getFlexClass()}`}>
                  <i className="fas fa-layer-group text-info mt-1" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-2">{t('createpost:app_type_label')}</h6>
                    <div className={`d-flex align-items-center ${getFlexClass()}`}>
                      <Badge bg="info" className="fs-6 me-2">
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
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-start ${getFlexClass()}`}>
                  <i className="fas fa-file-alt text-muted mt-1" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-2">{t('content')}</h6>
                    <p className="mb-0">
                      {readMore ? post.content : `${post.content.substring(0, 200)}...`}
                      {post.content.length > 200 && (
                        <Button
                          variant="link"
                          className="p-0 ms-2 text-decoration-none"
                          onClick={() => setReadMore(!readMore)}
                        >
                          {readMore ? t('show_less') : t('read_more')}
                        </Button>
                      )}
                    </p>
                  </div>
                </div>
              </ListGroupItem>
            )}

            {/* Información de Precios */}
            {(post.price || post.priceType) && (
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-start ${getFlexClass()}`}>
                  <i className="fas fa-money-bill-wave text-success mt-1" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-3">{t('createpost:pricing_section')}</h6>
                    
                    <Row className="g-3">
                      {/* Precio */}
                      {post.price && (
                        <Col xs={12} md={4}>
                          <div className={`text-center p-3 border rounded ${theme ? 'border-secondary' : ''}`}>
                            <i className="fas fa-dollar-sign text-success fs-4 mb-2"></i>
                            <div className="small text-muted">{t('createpost:price_label')}</div>
                            <div className="fw-bold fs-4 text-success">{post.price}</div>
                          </div>
                        </Col>
                      )}

                      {/* Moneda */}
                      {post.priceType && (
                        <Col xs={12} md={4}>
                          <div className={`text-center p-3 border rounded ${theme ? 'border-secondary' : ''}`}>
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
                          <div className={`text-center p-3 border rounded ${theme ? 'border-secondary' : ''}`}>
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
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-start ${getFlexClass()}`}>
                  <i className="fas fa-cogs text-warning mt-1" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-3">{t('createpost:features_section')}</h6>
                    <Row className="g-2">
                      {post.features.map((feature, index) => (
                        <Col key={index} xs={12} sm={6} lg={4}>
                          <div className={`d-flex align-items-center p-2 border rounded ${theme ? 'border-secondary' : ''} ${getFlexClass()}`}>
                            <i className="fas fa-check text-success"></i>
                            <span className="small ms-2">
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
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <div className={`d-flex align-items-start ${getFlexClass()}`}>
                  <i className="fas fa-images text-purple mt-1" style={{ width: '24px' }}></i>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="text-muted mb-2">{t('createpost:media_section')}</h6>
                    <div className={`d-flex align-items-center justify-content-between ${getFlexClass()}`}>
                      <div>
                        <span className="fw-medium">
                          {post.images.length} {post.images.length > 1 ? t('images') : t('image')}
                        </span>
                        <span className="text-muted small ms-2">
                          {t('image_gallery_description')}
                        </span>
                      </div>
                      <Badge bg="purple" className="fs-6">
                        <i className={getIconClass("fas fa-camera")}></i>
                        {t('gallery')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            )}

            {/* Fecha de publicación */}
            <ListGroupItem className={`d-flex align-items-center border-0 px-0 py-2 ${theme ? 'bg-dark' : ''} ${getFlexClass()}`}>
              <i className="fas fa-calendar-alt text-muted" style={{ width: '24px' }}></i>
              <div className="d-flex flex-column ms-3">
                <span className="text-muted small">{t('publishedOn')}</span>
                <span className="fw-medium">
                  {new Date(post.createdAt).toLocaleDateString(lang)} {t('at')} {new Date(post.createdAt).toLocaleTimeString(lang)}
                </span>
              </div>
            </ListGroupItem>

            {/* Estadísticas */}
            {(post.vistas || post.likes?.length > 0 || post.comments?.length > 0) && (
              <ListGroupItem className={`border-0 px-0 py-3 ${theme ? 'bg-dark' : ''}`}>
                <h6 className="text-muted mb-3">{t('statistics')}</h6>
                <Row className="g-3">
                  {/* Vistas */}
                  {(post.vistas || []).length > 0 && (
                    <Col xs={4}>
                      <div className={`text-center p-2 border rounded ${theme ? 'border-secondary' : ''}`}>
                        <i className="fas fa-eye text-info fs-5 mb-1"></i>
                        <div className="small text-muted">{t('views')}</div>
                        <div className="fw-bold fs-6">{post.vistas}</div>
                      </div>
                    </Col>
                  )}

                  {/* Likes */}
                  {(post.likes || []).length > 0 && (
                    <Col xs={4}>
                      <div className={`text-center p-2 border rounded ${theme ? 'border-secondary' : ''}`}>
                        <i className="fas fa-thumbs-up text-danger fs-5 mb-1"></i>
                        <div className="small text-muted">{t('likes')}</div>
                        <div className="fw-bold fs-6">{post.likes.length}</div>
                      </div>
                    </Col>
                  )}

                  {/* Commentaires */}
                  {(post.comments || []).length > 0 && (
                    <Col xs={4}>
                      <div className={`text-center p-2 border rounded ${theme ? 'border-secondary' : ''}`}>
                        <i className="fas fa-comments text-warning fs-5 mb-1"></i>
                        <div className="small text-muted">{t('comments')}</div>
                        <div className="fw-bold fs-6">{post.comments.length}</div>
                      </div>
                    </Col>
                  )}
                </Row>
              </ListGroupItem>
            )}

            {/* Botón de acción principal para el link */}
            {post.link && (
              <ListGroupItem className={`border-0 px-0 py-4 ${theme ? 'bg-dark' : ''}`}>
                <div className="text-center">
                  <Button
                    href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="success"
                    size="lg"
                    className={`px-5 py-3 fw-bold ${getFlexClass()}`}
                  >
                    <i className={getIconClass("fas fa-rocket")}></i>
                    {t('launch_app')}
                    <small className="d-block mt-1 opacity-75">
                      {t('experience_live_demo')}
                    </small>
                  </Button>
                </div>
              </ListGroupItem>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DescriptionPost;