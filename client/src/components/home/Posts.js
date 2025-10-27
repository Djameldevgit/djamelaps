import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from '../PostCard';
import LoadIcon from '../../images/loading.gif';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { POST_TYPES } from '../../redux/actions/postAction';

const Posts = ({ filters = [] }) => {
    const { homePosts, auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    // Si filters tiene datos (búsqueda aplicada), usar filters, sino usar homePosts.posts
    const postsToDisplay = filters && filters.length > 0 ? filters : homePosts.posts;

    // 🔷 FILTRADO SIMPLIFICADO - SOLO 3 CAMPOS
    const filteredPosts = postsToDisplay.filter(post => {
        // Si no hay posts, retornar array vacío
        if (!postsToDisplay || postsToDisplay.length === 0) return false;

        // Si filters es un array de posts (resultado de búsqueda), mostrar todos
        if (Array.isArray(filters) && filters.length > 0) {
            return true;
        }

        // Si estamos en homePosts, aplicar filtros individuales
        const searchFilters = typeof filters === 'object' && !Array.isArray(filters) ? filters : {};

        // 🔷 FILTRO 1: SUBCATEGORÍA
        if (searchFilters.subCategory && 
            post.subCategory?.toLowerCase() !== searchFilters.subCategory.toLowerCase()) {
            return false;
        }

        // 🔷 FILTRO 2: DESTINO DEL VIAJE
        if (searchFilters.destinacionvoyage1 && 
            !post.destinacionvoyage1?.toLowerCase().includes(searchFilters.destinacionvoyage1.toLowerCase())) {
            return false;
        }

        // 🔷 FILTRO 3: WILAYA
        if (searchFilters.wilaya && 
            post.wilaya?.toLowerCase() !== searchFilters.wilaya.toLowerCase()) {
            return false;
        }

        return true;
    });

    const handleLoadMore = async () => {
        setLoad(true);
        const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token);

        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: { ...res.data, page: homePosts.page + 1 },
        });

        setLoad(false);
    };

    return (
        <div>
            <div className="post_thumb">
                {/* Mostrar mensaje si no hay resultados */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-4">
                        <p>No se encontraron viajes que coincidan con tu búsqueda.</p>
                    </div>
                )}

                {/* Mostrar los posts filtrados */}
                {filteredPosts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme} />
                ))}

                {/* Mostrar el ícono de carga */}
                {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
            </div>

            {/* Solo mostrar LoadMoreBtn si estamos en home (no en búsqueda) */}
            {(!filters || filters.length === 0) && (
                <LoadMoreBtn
                    result={homePosts.result}
                    page={homePosts.page}
                    load={load}
                    handleLoadMore={handleLoadMore}
                />
            )}
        </div>
    );
};

export default Posts;