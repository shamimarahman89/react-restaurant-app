import { useEffect, useState } from "react";
import queryString from "query-string";
import { Card, Pagination, Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Restaurants(props) {
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(1);
  const history = useHistory();

  function previousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }
  function nextPage() {
    setPage(page + 1);
  }

  useEffect(() => {
    var parsed = queryString.parse(props.query);
    if (parsed.borough === undefined || parsed.borough === "") {
      fetch(
        `https://restaurant-api-staging.herokuapp.com/api/restaurants?page=${page}&perPage=10`
      )
        .then((res) => res.json())
        .then((restaurants) => {
          setRestaurants(restaurants);
        });
    } else {
      
      fetch(
        `https://restaurant-api-staging.herokuapp.com/api/restaurants?page=${page}&perPage=10&borough=${parsed.borough}`
      )
        .then((res) => res.json())
        .then((restaurants) => {
          setRestaurants(restaurants);
        });
    }
  }, [page, props.query]);

  if (restaurants) {
    if(restaurants.length === 0){
      return(
        <>
          <Card bg="light">
            <Card.Body>
              <Card.Text>
                No Restaurants Found
              </Card.Text>
            </Card.Body>
          </Card>
      </>
      );
    }
    else{
      return (
        <>
          <Card bg="light">
            <Card.Body>
              <Card.Title> Restaurant List </Card.Title>
              <Card.Text>
                Full list of restaurants. Optionally sorted by borough
              </Card.Text>
            </Card.Body>
          </Card>
          <br />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Borough</th>
                <th>Cuisine</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr
                  onClick={() => {
                    history.push(`/restaurant/${restaurant._id}`);
                  }}
                  key={restaurant._id}
                >
                  <td>{restaurant.name}</td>
                  <td>
                    {restaurant.address.building} {restaurant.address.street}
                  </td>
                  <td>{restaurant.borough}</td>
                  <td>{restaurant.cuisine}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.Prev onClick={previousPage}/>
            <Pagination.Item> {page} </Pagination.Item>
            <Pagination.Next onClick={nextPage}/>
          </Pagination>
        </>
      );
    }
    
  } else {
    return <p>Loading Restaurants...</p>;
  }
}
