import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurantId;
            const text = req.body.text;
            const userInfo = {
                name: req.body.name,
                id: req.body.userId,
            }

            const date = new Date();

            const reviewResponse = await ReviewsDAO.addReview(restaurantId, userInfo, text, date);
            res.json({ status: "success"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    static async apiPutReview(req, res, next) {
        try {
            const reviewId = req.body.reviewId;
            const text = req.body.text;
            const date = new Date();
            const userId = req.body.userId;

            const reviewResponse = await ReviewsDAO.updateReview(reviewId, userId, text, date);
            const { error } = reviewResponse;
            if(error) {
                res.status(400).json({error});
            }

            if(reviewResponse.modifiedCount === 0) {
                throw new Error('Unable to update review - user may not be original poster.')
            }

            res.json({ status: "success"});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.reviewId;
            const userId = req.body.userId;
            const deleteResponse = await ReviewsDAO.deleteReview(reviewId, userId);
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}