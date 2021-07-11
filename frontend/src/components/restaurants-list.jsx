import React, { useState, useEffect } from 'react';
import RestaurantDataService from "../services/restaurant"
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

RestaurantsList.propTypes = {

};

function RestaurantsList(props) {
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(['All Cuisines']);

    useEffect(() => {
        retrieveRestaurants();
        retrieveCuisines();
    }, [])

    function onChangeSearchName(e) {
        const searchName = e.target.value;
        setSearchName(searchName);
    }

    function onChangeSearchZip(e) {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    }


    function onChangeSearchCuisine(e) {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    }

    async function refreshList() {
        await retrieveRestaurants();
    }


    async function retrieveRestaurants() {
        try {
            const { data } = await RestaurantDataService.getAll();
            console.log(data)
            setRestaurants(data.restaurants);

        } catch (error) {
            console.log(error)
        }
    }

    async function retrieveCuisines() {
        try {
            const { data } = await RestaurantDataService.getCuisines();
            console.log(data)
            setCuisines(['All Cuisines'].concat(data));

        } catch (error) {
            console.log(error)
        }
    }

    async function find(query, by) {
        try {
            const { data } = await RestaurantDataService.find(query, by);
            console.log(data)
            setRestaurants(data.restaurants);

        } catch (error) {
            console.log(error)
        }
    }

    async function findByName() {
        await find(searchName, "name");
    }

    async function findByZip() {
        await find(searchZip, "zipcode");
    }

    async function findByCuisine() {
        if (searchCuisine === "All Cuisines") {
            await refreshList();
        } else {
            await find(searchCuisine, "cuisine");
        }
    }

    return (
        <>
            <div className="row pb-1">
                <div className="input-group col-lg-4">
                    <input type="text" className="form-control" placeholder="Search by name" value={searchName} onChange={onChangeSearchName} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={findByName}>Search</button>
                    </div>
                </div>
                <div className="input-group col-lg-4">
                    <input type="text" className="form-control" placeholder="Search by zip" value={searchZip} onChange={onChangeSearchZip} />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={findByZip}>Search</button>
                    </div>
                </div>
                <div className="input-group col-lg-4">
                    <select onChange={onChangeSearchCuisine} className="form-control">
                        {
                            cuisines.map(cuisine => (<option value={cuisine} key={cuisine}>{cuisine.substr(0, 20)}</option>))
                        }
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={findByCuisine}>Search</button>
                    </div>
                </div>
            </div>

            <div className="row">
                {
                    restaurants.map(restaurant => {
                        const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;

                        return (
                            <div key={restaurant._id} className="col-lg-4 pb-1">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{restaurant.name}</h5>
                                        <p className="card-text">
                                            <strong>Cuisine: </strong>{restaurant.cuisine} <br />
                                            <strong>Address: </strong>{address}
                                        </p>
                                        <div className="row">
                                            <Link to={`restaurants/${restaurant._id}`} className="btn btn-primary col-lg-5 mx-1 mb-1">View Reviews</Link>
                                            <a target="_blank" href={`http://www.google.com/maps/place/${address}`} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}
export default RestaurantsList;