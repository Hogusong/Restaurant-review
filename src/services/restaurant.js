import http from '../http-common'

class RestaurantDataService {
  getByQuery(query = {}) {
    let endpoint = '/restaurants';
    const queryString = []
    if (!query.page) queryString.push(`page=0`);
    else queryString.push(`page=${query.page}`);

    if (!query.perPage) queryString.push(`perPage=20`);
    else queryString.push(`perPage=${query.perPage}`);

    if (query.cuisine) queryString.push(`cuisine=${query.cuisine}`);
    if (query.zipcode) queryString.push(`zipcode=${query.zipcode}`);
    if (query.name) queryString.push(`name=${query.name}`)
    if (queryString.length > 0) {
      endpoint += '?' + queryString.join('&');
    }
    return http.get(endpoint);
  }

  getById(id) {
    return http.get(`/restaurants/id/${id}`);
  }

  find(query, by = 'name', page = 0, perPage = 20) {
    return http.get(`/restaurants?${by}=${query}&page=${page}&perPage=${perPage}`);
  }

  getCuisines() {
    return http.get('/cuisines');
  }
  createReview(data) {
    return http.post('/review', data);
  }

  updateReview(data) {
    return http.put('/review', data);
  }

  deleteReview(data) {
    return http.delete('/review', { data });
  }
}

export default new RestaurantDataService();