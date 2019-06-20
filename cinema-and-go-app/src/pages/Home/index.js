import React, { useState, useEffect } from 'react'
import appLogic from '../../logic'
import { defaultPosition, getUserPosition } from '../../utils'

import { Circle, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import GoogleMaps from '../../components/Maps'
import CustomMarker from '../../components/Marker'
import CinemaModal from '../../components/CinemaModal'
import Header from '../../components/Header'

import userMarker from '../../assets/images/markers/user-marker.png'
import cinemaMarker from '../../assets/images/markers/cinema-marker.png'

import './index.scss'

const Home = () => {
    // Globals
    const defaultPos = defaultPosition()
    const userPosition = getUserPosition()
    const threshold = 2000
    // const userMarker = '../../assets/images/markers/user-marker.png'

    // State
    const [ cinemaPoi, setCinemaPoi ] = useState(null)
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ currentMarker, setCurrentMarker ] = useState(null)
    const [ destination, setDestination ] = useState(null)
    const [ response, setResponse ] = useState(null)

    // Handlers
    const directionsCallback = responseCb => {
        console.log(responseCb)

        if (responseCb !== null) {
            if (responseCb.status === 'OK') {
                    setResponse(responseCb)
            } else {
                console.log('response: ', responseCb)
            }
        }
    }
    const handleCloseModal = () => {
        setModalVisible(false)
    }
    const handlePopulate = () => {
        appLogic.populateDb()
    }
    const handleDirectionsService = (location) => {
        setDestination(location)
        setModalVisible(false)
    }

    // Lifecicle
    useEffect(() => {
        const cinemas = async () => {
            if(defaultPos) {
                const cinemaPoints = await appLogic.retrieveNearestCinemas(userPosition, threshold)
                sessionStorage.setItem('cinemaPoints', JSON.stringify(cinemaPoints))
                return setCinemaPoi(cinemaPoints)
            }
        }
        cinemas()
    },[])

    return (
        <section className="home">
            {modalVisible &&
                <CinemaModal onClose={handleCloseModal} id={currentMarker} onDirectionsService={handleDirectionsService}
            />}

            <span className="populate" onClick={handlePopulate}> Populate! </span>
            <Header />
            <section className="home__content">
            {defaultPos &&
                <section className="maps">
                    <GoogleMaps
                        customZoom={14.5}
                    >
                        <Circle
                            center={{
                                lat: defaultPos[0],
                                lng: defaultPos[1]
                            }}
                            options={{
                                strokeColor: '#ce9234',
                                strokeOpacity: 0.85,
                                strokeWeight: 2,
                                fillColor: '#ffd364',
                                fillOpacity: 0.35,
                                clickable: false,
                                draggable: false,
                                editable: false,
                                visible: !response,
                                radius: threshold,
                                zIndex: 1
                            }}
                        />

                        <CustomMarker
                            clickable={false}
                            customPosition={defaultPos}
                            visible={!response}
                            icon={userMarker}
                        />

                        {cinemaPoi &&
                            cinemaPoi.map (
                                ({ location, _id: id }) =>
                                    <CustomMarker
                                        key={id}
                                        customPosition={location.coordinates}
                                        customHandler={() => {
                                            setCurrentMarker(id)
                                            setModalVisible(true)
                                        }}
                                        visible={!response}
                                        icon={cinemaMarker}
                                    />
                            )
                        }

                        {
                            (
                              destination !== null
                            ) && (
                              <DirectionsService
                                options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                  destination: destination,
                                  origin: defaultPos.join(),
                                  travelMode: 'WALKING'
                                }}
                                callback={directionsCallback}
                              />
                            )
                          }

                          {
                            response !== null && (
                              <DirectionsRenderer
                                options={{ // eslint-disable-line react-perf/jsx-no-new-object-as-prop
                                  directions: response
                                }}
                              />
                            )
                          }
                    </GoogleMaps>
                </section>
            }
            </section>
        </section>
    )
}

export default Home
