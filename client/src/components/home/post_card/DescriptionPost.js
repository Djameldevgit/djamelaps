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
  const { t } = useTranslation('descripcion'); // Namespace para traducciones de posts
  const lang = languageReducer.language || 'fr'; // Default francés

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        {/* Header con título principal */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-globe text-primary me-2 fs-5"></i>
              <h4 className="mb-0 text-dark fw-bold">{post.title}</h4>
            </div>
            <Badge bg="primary" className="fs-6 mb-2">
              {t('type')}: {post.title}
            </Badge>
          </Col>
        </Row>

        <ListGroup variant="flush">
          {/* Contenido principal */}
          {post.content && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-file-alt text-muted me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('content')}</h6>
                  <p className="mb-0">{post.content}</p>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Fecha de publicación */}
          <ListGroupItem className="d-flex align-items-center border-0 px-0 py-2">
            <i className="fas fa-calendar-alt text-muted me-3" style={{ width: '20px' }}></i>
            <div className="d-flex flex-column">
              <span className="text-muted small">{t('publishedOn')}</span>
              <span className="fw-medium">
                {new Date(post.createdAt).toLocaleDateString(lang)} {t('at')} {new Date(post.createdAt).toLocaleTimeString(lang)}
              </span>
            </div>
          </ListGroupItem>

          {/* Precio y unidad */}
          {(post.price || post.unidaddeprecio) && (
            <ListGroupItem className="border-0 px-0 py-2">
              <div className="d-flex align-items-center">
                <i className="fas fa-tag text-success me-3" style={{ width: '20px' }}></i>
                <div className="d-flex align-items-center gap-2">
                  {post.price && (
                    <span className="fw-bold fs-5 text-success">
                      {post.price}
                    </span>
                  )}
                  {post.unidaddeprecio && (
                    <Badge bg="outline-success" text="success">
                      {t(`priceUnits.${post.unidaddeprecio}`, post.unidaddeprecio)}
                    </Badge>
                  )}
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Estadísticas */}
          {(post.vistas || post.likes?.length > 0 || post.comments?.length > 0) && (
            <ListGroupItem className="border-0 px-0 py-3">
              <h6 className="text-muted mb-2">{t('statistics')}</h6>
              <Row className="g-3">
                {/* Vistas */}
                {(post.vistas || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center">
                      <i className="fas fa-eye text-info mb-1"></i>
                      <div className="small text-muted">{t('views')}</div>
                      <div className="fw-bold">{post.vistas}</div>
                    </div>
                  </Col>
                )}

                {/* Likes */}
                {(post.likes || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center">
                      <i className="fas fa-thumbs-up text-danger mb-1"></i>
                      <div className="small text-muted">{t('likes')}</div>
                      <div className="fw-bold">{post.likes.length}</div>
                    </div>
                  </Col>
                )}

                {/* Commentaires */}
                {(post.comments || []).length > 0 && (
                  <Col xs={4}>
                    <div className="text-center">
                      <i className="fas fa-comments text-warning mb-1"></i>
                      <div className="small text-muted">{t('comments')}</div>
                      <div className="fw-bold">{post.comments.length}</div>
                    </div>
                  </Col>
                )}
              </Row>
            </ListGroupItem>
          )}

          {/* Description */}
          {post.description && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-align-left text-muted me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('description')}</h6>
                  <div className="card_body-content">
                    <p className="mb-2">
                      {post.description.length < 60
                        ? post.description
                        : readMore
                          ? post.description
                          : post.description.slice(0, 60) + '...'}
                    </p>
                    {post.description.length > 60 && (
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none fw-bold"
                        onClick={() => setReadMore(!readMore)}
                        size="sm"
                      >
                        {readMore ? 
                          <><i className="fas fa-chevron-up me-1"></i>{t('hideContent')}</> : 
                          <><i className="fas fa-chevron-down me-1"></i>{t('readMore')}</>
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Features/Características */}
          {post.features && post.features.length > 0 && (
            <ListGroupItem className="border-0 px-0 py-3">
              <div className="d-flex align-items-start">
                <i className="fas fa-star text-warning me-3 mt-1" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">{t('features')}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {post.features.map((feature, index) => (
                      <Badge key={index} bg="warning" text="dark" className="fs-6">
                        <i className="fas fa-check me-1"></i>
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ListGroupItem>
          )}

          {/* Offre */}
          {post.oferta && (
            <ListGroupItem className="d-flex align-items-center border-0 px-0 py-2">
              <i className="fas fa-tags text-success me-3" style={{ width: '20px' }}></i>
              <div className="d-flex flex-column">
                <span className="text-muted small">{t('offerType')}</span>
                <Badge bg="success" className="mt-1">
                  {t(`offerTypes.${post.oferta}`, post.oferta)}
                </Badge>
              </div>
            </ListGroupItem>
          )}

          {/* Lien */}
          {post.link && (
            <ListGroupItem className="border-0 px-0 py-2">
              <div className="d-flex align-items-center">
                <i className="fas fa-link text-primary me-3" style={{ width: '20px' }}></i>
                <div className="flex-grow-1">
                  <span className="text-muted small d-block">{t('link')}</span>
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
            </ListGroupItem>
          )}

          {/* Téléphone */}
          {post.telefono && (
            <ListGroupItem className="d-flex align-items-center border-0 px-0 py-2">
              <i className="fas fa-phone-alt text-info me-3" style={{ width: '20px' }}></i>
              <div className="d-flex flex-column">
                <span className="text-muted small">{t('phone')}</span>
                <a 
                  href={`tel:${post.telefono}`} 
                  className="fw-medium text-decoration-none text-dark"
                >
                  <i className="fas fa-phone me-1"></i>
                  {post.telefono}
                </a>
              </div>
            </ListGroupItem>
          )}

          {/* Información de imágenes */}
          {post.images && post.images.length > 0 && (
            <ListGroupItem className="border-0 px-0 py-2">
              <div className="d-flex align-items-center">
                <i className="fas fa-images text-secondary me-3" style={{ width: '20px' }}></i>
                <div className="d-flex flex-column">
                  <span className="text-muted small">{t('imageGallery')}</span>
                  <span className="fw-medium">
                    {post.images.length} {post.images.length > 1 ? t('images') : t('image')}
                  </span>
                </div>
              </div>
            </ListGroupItem>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default DescriptionPost;