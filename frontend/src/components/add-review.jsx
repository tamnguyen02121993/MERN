import React, { useState, useEffect } from 'react';
import RestaurantDataService from "../services/restaurant";
import { Link, useParams } from "react-router-dom";

function AddReview(props) {
    let initialReviewState = "";
    let editing = false;

    if (props.location.state && props.location.state.currentReview) {
        editing = true;
        initialReviewState = props.location.state.currentReview.text;
    }

    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false);
    const { id: restaurantId } = useParams();
    function handleInputChange(e) {
        setReview(e.target.value);
    }

    async function saveReview() {
        console.log(props.user)
        let data = {
            text: review,
            name: props.user.name,
            userId: props.user.id,
            restaurantId
        }

        if (editing) {
            data.reviewId = props.location.state.currentReview._id;
            try {
                const response = await RestaurantDataService.updateReview(data);
                setSubmitted(true);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const response = await RestaurantDataService.createReview(data);
                setSubmitted(true);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    }
    return (
        <div>
            {
                props.user ? (
                    <div className="submit-form">
                        {
                            submitted ? (
                                <div>
                                    <h4>Your submitted successfully!</h4>
                                    <Link to={`/restaurants/${restaurantId}`} className="btn btn-success">Back to Restaurant</Link>
                                </div>
                            ) : (
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="description">
                                            {editing ? "Edit" : "Create"} Review
                                        </label>
                                        <input type="text" className="form-control"
                                                id="text"
                                                required
                                                value={review}
                                                onChange={handleInputChange}
                                                name="text"
                                        />
                                        <button onClick={saveReview} className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div>Please log in.</div>
                )
            }
        </div>
    );
}

export default AddReview;