import { useEffect, useState } from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function Restaurant(props){
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://restaurant-api-staging.herokuapp.com/api/restaurants/${props.id}`).then(res => res.json()).then(restaurant => {
            setLoading(false);
            if(restaurant.hasOwnProperty("_id")){
                setRestaurant(restaurant);
                console.log(restaurant);
            }
            else{
                setRestaurant(null);
            }
            
        });
    }, [props.id])

    if(!loading){
        if(restaurant){
            return (
                <>
                    <Card bg="light">
                        <Card.Body>
                            <Card.Title> {restaurant.name} </Card.Title>
                            <Card.Text> {restaurant.address.building} {restaurant.address.street} </Card.Text>
                        </Card.Body>
                    </Card>
                    <br />
                    <MapContainer style={{"height": "400px"}} center={[restaurant.address.coord[1], restaurant.address.coord[0]]} zoom={13} scrollWheelZoom={false}> <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> <Marker position={[ restaurant.address.coord[1], restaurant.address.coord[0]]}></Marker> </MapContainer>
                    <br />
                    <h4> Ratings </h4>
                    
                    <hr />
                    
                    <CardDeck>
                        {restaurant.grades.map((g) =>(
                            <Card key= {g.date}>
                                <Card.Body>
                                    <Card.Header> Grade: {g.grade} </Card.Header>
                                    <Card.Header> Date: {new Date(g.date).toLocaleDateString()}</Card.Header>
                                </Card.Body>
                            </Card>
                         ) )}
                        
                    </CardDeck>
                    <br />

                </>
            
            )
        }
        else{
            return <p>Unable to find Restaurant with id: {props.id}</p>
        }
    }
    else{
        return <p>Loading Restaurant Data...</p>
    }
    
    
}