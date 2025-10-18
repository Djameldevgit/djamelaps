// src/pages/editpost.js
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { updatePost, getPost } from '../redux/actions/postAction'
import Icons from '../components/Icons'
import { imageShow } from '../utils/mediaShow'

const editpost = () => {
    const { auth, theme, post } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams() // Esto obtiene el ID de la URL
    
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Cargar el post existente
        const loadPostData = async () => {
            try {
                // Si ya tienes el post en el store, úsalo
                if(post.data && post.data._id === id) {
                    setContent(post.data.content)
                    setImages(post.data.images)
                    setLoading(false)
                } else {
                    // Si no, haz una petición para obtener el post
                    dispatch(getPost({id, auth}))
                    // Necesitarás manejar esto en tu reducer para actualizar el estado
                }
            } catch (error) {
                console.error('Error loading post:', error)
                history.push('/')
            }
        }
        
        loadPostData()
    }, [id, auth, history, dispatch, post.data])

    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if(!file) return err = "File does not exist."
            if(file.size > 1024 * 1024 * 5) {
                return err = "The image largest is 5mb."
            }
            return newImages.push(file)
        })

        if(err) dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err} })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validaciones básicas
        if(!content.trim() && images.length === 0) {
            return dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {error: "Please add content or images"} 
            })
        }

        dispatch(updatePost({
            content, 
            images, 
            auth, 
          
        }))
        
        history.push(`/edit-post/${post._id}`)
    }

    const handleCancel = () => {
        history.goBack()
    }

    if(loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="edit_post_page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="m-0">Edit Post</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handleCancel}
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="status_body">
                                        <textarea 
                                            name="content" 
                                            value={content}
                                            placeholder={`${auth.user.username}, what are you thinking?`}
                                            onChange={e => setContent(e.target.value)}
                                            className="form-control mb-3"
                                            rows="4"
                                            style={{
                                                filter: theme ? 'invert(1)' : 'invert(0)',
                                                color: theme ? 'white' : '#111',
                                                background: theme ? 'rgba(0,0,0,.03)' : '',
                                            }} 
                                        />

                                        <div className="d-flex mb-3">
                                            <div className="flex-fill"></div>
                                            <Icons setContent={setContent} content={content} theme={theme} />
                                        </div>

                                        <div className="show_images mb-3">
                                            {images.map((img, index) => (
                                                <div key={index} className="position-relative d-inline-block me-2 mb-2">
                                                    {img.url ? imageShow(img.url, theme) : imageShow(URL.createObjectURL(img), theme)}
                                                    <span 
                                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => deleteImages(index)}
                                                    >
                                                        &times;
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="input_images mb-3">
                                            <div className="file_upload">
                                                <label htmlFor="file" className="btn btn-outline-primary">
                                                    <i className="fas fa-image me-2" />
                                                    Add More Photos
                                                </label>
                                                <input 
                                                    type="file" 
                                                    name="file" 
                                                    id="file"
                                                    multiple 
                                                    accept="image/*" 
                                                    onChange={handleChangeImages} 
                                                    style={{display: 'none'}}
                                                />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary flex-fill"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                className="btn btn-primary flex-fill" 
                                                type="submit"
                                            >
                                                Update Post
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default editpost