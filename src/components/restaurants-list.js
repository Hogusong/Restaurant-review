import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import RestaurantDataService from '../services/restaurant'

const RestaurantsList = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [searchCuisine, setSearchCuisine] = useState('');
  const [cuisines, setCuisines] = useState(['All Cuisines']);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchZip = e => {
    const searchZip = e.target.value;
    setSearchZip(searchZip);
  }

  const onChangeSearchCuisine = e => {
    const searchCuisine = e.target.value;
    setSearchCuisine(searchCuisine);
  }

  const retrieveRestaurants = () => {
    const query = { page, perPage };
    if (searchCuisine) query.cuisine = searchCuisine;
    if (searchZip) query.zipcode = searchZip;
    if (searchName) query.name = searchName;
    RestaurantDataService.getByQuery(query)
      .then(res => {
        setRestaurants(res.data.restaurants);
        setTotalCount(res.data.total_result);
      })
      .catch(e => { console.log(e)})
  }

  const retrieveCuisines = () => {
    RestaurantDataService.getCuisines()
      .then(res => {
        setCuisines(['All Cuisines', ...res.data]);
      })
      .catch(e => { console.log(e)})
  }

  const refreshList = () => {  
    retrieveCuisines();
  }

  const previousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      retrieveRestaurants();
    }
  }

  const nextPage = () => {
    const maxPage = Math.ceil(totalCount / perPage) - 1;
    if (page < maxPage) {
      setPage(page + 1);
      retrieveRestaurants();
    }
  }

  const find = (query, by) => {
    setPage(0);
    RestaurantDataService.find(query, by, page, perPage)
      .then(res => {
        setRestaurants(res.data.restaurants);
        setTotalCount(res.data.total_result);
      })
      .catch(e => { console.log(e) });
  }

  const findByAll = () => {
    setPage(0);
    retrieveRestaurants();
  }

  const findByName = () => {
    find(searchName, 'name');
  }

  const findByZip = () => {
    find(searchZip, 'zipcode');
  }

  const findByCuisine = () => {
    if (searchCuisine === 'All Cuisines') {
      refreshList();
    } else {
      find(searchCuisine, 'cuisine');
    }
  }

  return (
    <div>
      <div className='row pb-1'>
        <div className='input-group col-lg-4'>
          <input className='form-control'
            type='text'
            placeholder='search by name'
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' type='button' onClick={findByName}>
              Search
            </button>
          </div>
        </div>
        <div className='input-group col-lg-4'>
          <input className='form-control'
            type='text'
            placeholder='Search by zip'
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' type='button' onClick={findByZip}>
              Search
            </button>
          </div>
        </div>
        <div className='input-group col-lg-4'>
          <select onChange={onChangeSearchCuisine}>
            {cuisines.map(cuisine => {
              return (
                <option value={cuisine}> {cuisine.substring(0,20)} </option>
              )
            })}
          </select>
          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' type='button' onClick={findByCuisine}>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className='row pb-1'>
        <div className='input-group col-lg-6'>
          <button className='btn btn-outline-secondary' type='button' onClick={findByAll}>
            {`Search by Name -> ${searchName || 'All names'}, & zipcode -> ${searchZip || 'All'}, & Cuisine -> ${searchCuisine || 'All cuisines'}`}
          </button>
        </div>
        <div className='input-group col-lg-2'>
            {`Current Page: ${page + 1}`}
        </div>
        <div className='input-group col-lg-2'>
            {`Total count: ${totalCount}`}
        </div>
        <div className='input-group col-lg-2'>
          <button className='btn btn-outline-secondary' type='button' onClick={previousPage}>
            {'<--- '}
          </button>
          <button className='btn btn-outline-secondary' type='button' onClick={nextPage}>
            {'--->'}
          </button>
        </div>
      </div>
      <div className='row'>
        {restaurants.map(restaurant => {
          let address = ''
          if (restaurant.address) {
            address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`
          }
          return (
            <div className='col-lg-4 pb-1' key={restaurant._id}>
              <div className='card'>
                <div className='card-body'>
                  <h5 className='card-title'> {restaurant.name} </h5>
                  <p className='card-text'>
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{address}
                  </p>
                  <div className='row'>
                    <Link to={`/restaurants/${restaurant._id}`} 
                      className='btn btn-primary col-lg-5 mx-1 mb-1'>
                      View Reviews
                    </Link>
                    <a 
                      target="_blank" 
                      rel="noreferrer"
                      href={'https://www.google.com/maps/place/' + address}
                      className='btn btn-primary col-lg-5 mx-1 mb-1'
                    >
                      View map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default RestaurantsList;
