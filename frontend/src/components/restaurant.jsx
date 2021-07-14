import React, { useState, useEffect } from 'react';
import RestaurantDataService from "../services/restaurant"
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';

Restaurant.propTypes = {

};

function Restaurant(props) {
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
    }
    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    const { id } = useParams();
    useEffect(() => {
        console.log(`id change: ${id}`)
        getRestaurant(id)
    }, [id]);

    async function getRestaurant(id) {
        try {
            const { data } = await RestaurantDataService.get(id);
            console.log(data);
            setRestaurant(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteReview(reviewId, userId, index) {
        try {
            await RestaurantDataService.deleteReview(reviewId, userId);
            setRestaurant(prevState => {
                debugger
                prevState.reviews.splice(index, 1);
                return ({
                    ...prevState
                })
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {
                restaurant ? (
                    <div>
                        <h5>{restaurant.name}</h5>
                        <p>
                            <strong>Cuisine: </strong>{restaurant.cuisine}<br />
                            <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                        </p>
                        <Link className="btn btn-primary" to={`/restaurants/${id}/review`}>Add Review</Link>
                        <h4>Reviews</h4>
                        <div className="row">
                            {
                                restaurant.reviews.length > 0 ? (
                                    restaurant.reviews.map((review, index) => {
                                        return (<div className="col-lg-4 pb-1" key={index}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        {review.text}<br />
                                                        <strong>User: </strong>{review.name}<br />
                                                        <strong>Date: </strong>{review.date}
                                                    </p>
                                                    {
                                                        props.user && props.user.id === review.user_id &&
                                                        <div className="row">
                                                            <button type="button" onClick={() => deleteReview(review._id, props.user.id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</button>
                                                            <Link to={{
                                                                pathname: `/restaurants/${id}/review`,
                                                                state: {
                                                                    currentReview: review
                                                                }
                                                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>)
                                    })
                                ) : (
                                    <div className="col-sm-4">
                                        <p>No reviews yet.</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>No restaurant selected.</p>
                    </div>
                )
            }
        </div>
    );
}

export default Restaurant;