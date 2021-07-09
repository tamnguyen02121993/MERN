import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }

        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection('reviews');
        } catch (error) {
            console.error(`Unable to establish collection handles in reviewDAO: ${error}`)
        }
    }
    static async addReview(restaurantId, userInfo, text, date) {
        try {
            const reviewDoc = {
                name: userInfo.name,
                user_id: userInfo.id,
                date,
                text,
                restaurant_id: ObjectID(restaurantId)
            }

            return await reviews.insertOne(reviewDoc);
        } catch (error) {
            console.error(`Unable to post review: ${error}`)
            return { error };
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne({
                user_id: userId, _id: ObjectID(reviewId)
            }, {
                $set: {
                    text,
                    date
                }
            });

            return updateResponse;
        } catch (error) {
            console.error(`Unable to update review: ${error}`)
            return { error };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                user_id: userId,
                _id: ObjectID(reviewId)
            });
            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete review: ${error}`)
            return { error };
        }
    }
}