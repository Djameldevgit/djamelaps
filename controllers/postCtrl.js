const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const { postData, images } = req.body
    
            if(!images || images.length === 0) {
                return res.status(400).json({msg: "Veuillez ajouter au moins une photo."})
            }
    
            if (!postData) {
                return res.status(400).json({msg: "Données du post manquantes."})
            }
    
            // Validación de campos requeridos
            if (!postData.subCategory) {
                return res.status(400).json({msg: "La catégorie est requise."})
            }
    
            if (!postData.wilaya || !postData.commune) {
                return res.status(400).json({msg: "La wilaya et la commune sont requises."})
            }
    
            // 🔥 CREAR NUEVO POST OPTIMIZADO - SOLO 3 CAMPOS ESPECÍFICOS
            const newPost = new Posts({
                ...postData, // ✅ TODOS los campos del frontend automáticamente
                images,
                user: req.user._id,
                
                // Solo asegurar campos críticos con valores por defecto
                category: postData.category || "Agence de Voyage",
                description: postData.description || postData.content || "",
                
                // Arrays que deben estar inicializados
                specifications: postData.specifications || [],
                tipodehabutaciones: postData.tipodehabutaciones || [],
                wifi: postData.wifi || [],
                language: postData.language || [],
                servicesInclus: postData.servicesInclus || [],
                activites: postData.activites || [],
                documentsRequises: postData.documentsRequises || [],
                optionsPaiement: postData.optionsPaiement || [],
                excursions: postData.excursions || []
            })
    
            await newPost.save()
    
            // 🔥 POPULATE OPTIMIZADO
            await newPost.populate('user', 'avatar username fullname followers')
    
            res.json({
                msg: 'Post créé avec succès!',
                newPost
            })
    
        } catch (err) {
            console.error('Error en createPost:', err)
            return res.status(500).json({msg: err.message})
        }
    },
    // ✅ UPDATE POST OPTIMIZADO
    updatePost: async (req, res) => {
        try {
            const { postData, images } = req.body

            if (!postData) {
                return res.status(400).json({msg: "Données de mise à jour manquantes."})
            }

            // Preparar datos de actualización
            const updateData = {
                ...postData, // ✅ TODOS los campos en una línea
                images
            }

            // Filtrar campos undefined (opcional, mongoose los ignora)
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key]
                }
            })

            const post = await Posts.findOneAndUpdate(
                { _id: req.params.id }, 
                updateData,
                { new: true } // Retornar el documento actualizado
            ).populate("user likes", "avatar username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if (!post) {
                return res.status(404).json({msg: "Post non trouvé."})
            }

            res.json({
                msg: "Post mis à jour avec succès!",
                newPost: post
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    likePost: async (req, res) => {
        try {
            const post = await Posts.find({_id: req.params.id, likes: req.user._id})
            if(post.length > 0) return res.status(400).json({msg: "You liked this post."})

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'Liked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikePost: async (req, res) => {
        try {

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'UnLiked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getPosts: async (req, res) => {
        try {
            const { 
                title, 
                subCategory, 
                destinacionvoyage1, 
                wilaya, 
                page, 
                limit 
            } = req.query;
    
            // 🔹 INICIALIZAR QUERY - Sin filtro de aprobado
            const query = {};
    
            // 🔹 Buscar por título
            if (title && title.trim() !== "") {
                query.title = { $regex: title.trim(), $options: "i" };
            }
    
            // 🔹 Filtros directos para VIAJES
            if (subCategory && subCategory.trim() !== "") {
                query.subCategory = { $regex: subCategory.trim(), $options: "i" };
            }
            if (destinacionvoyage1 && destinacionvoyage1.trim() !== "") {
                query.destinacionvoyage1 = { $regex: destinacionvoyage1.trim(), $options: "i" };
            }
            if (wilaya && wilaya.trim() !== "") {
                query.wilaya = { $regex: wilaya.trim(), $options: "i" };
            }
    
            console.log("Query final para viajes:", JSON.stringify(query, null, 2));
    
            // 🔥 Mantener paginación con APIfeatures
            const features = new APIfeatures(Posts.find(query), req.query).paginating();
    
            const posts = await features.query
                .sort("-createdAt")
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password",
                    },
                });
    
            res.json({
                msg: "Success!",
                result: posts.length,
                posts,
            });
        } catch (err) {
            console.error("Error en getPosts:", err);
            return res.status(500).json({ msg: err.message });
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
            .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if(!post) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPostsDicover: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = req.params.id;
            const userId = req.user._id;
    
            // 🔷 VERIFICAR SI EL USUARIO ES EL DUEÑO O ADMIN
            const post = await Posts.findById(postId);
            
            if (!post) {
                return res.status(404).json({msg: 'Post not found'});
            }
    
            // Permitir eliminar si es el dueño O admin
            if (post.user.toString() !== userId.toString() && req.user.role !== 'admin') {
                return res.status(403).json({msg: 'Not authorized to delete this post'});
            }
    
            // 🔷 GUARDAR IDs DE COMMENTS Y LIKES ANTES DE ELIMINAR
            const commentsToDelete = post.comments || [];
            const likesToCleanup = post.likes || [];
    
            // 🔷 ELIMINAR EL POST
            await Posts.findByIdAndDelete(postId);
    
            // 🔷 LIMPIAR DATOS RELACIONADOS
            if (commentsToDelete.length > 0) {
                await Comments.deleteMany({_id: {$in: commentsToDelete}});
            }
    
            // 🔷 OPCIONAL: Limpiar likes de usuarios
            if (likesToCleanup.length > 0) {
                await Users.updateMany(
                    {_id: {$in: likesToCleanup}},
                    {$pull: {likes: postId}}
                );
            }
    
            // 🔷 OPCIONAL: Eliminar de posts guardados
            await Users.updateMany(
                {saved: postId},
                {$pull: {saved: postId}}
            );
    
            res.json({
                msg: 'Post deleted successfully!',
                deletedPostId: postId
            });
    
        } catch (err) {
            console.error('Error in deletePost:', err);
            return res.status(500).json({msg: err.message});
        }
    },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({_id: req.user._id, saved: req.params.id})
            if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'Saved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'unSaved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: {$in: req.user.saved}
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = postCtrl