import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useParams, useLocation } from "react-router-dom";

const AddReview = props => {
  let initialReview = ""
  let editing = false;
  const location = useLocation();
  if (location.state) {
    editing = true;
    initialReview = location.state.review;
  }

  const { restaurant_id } = useParams();
  const [review, setReview] = useState(initialReview);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      review: review,
      username: props.user.name,
      user_id: props.user.id,
      restaurant_id: restaurant_id
    };

    if (editing) {
      data.review_id = location.state._id
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + restaurant_id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;