import mongoose from 'mongoose'
import schemas from './schemas'

const {
  city,
  cinema,
  distance,
  movie,
  movieSessions,
  point,
  user,
} = schemas

export default {
  mongoose,
  City: mongoose.model('city', city),
  Cinema: mongoose.model('cinema', cinema),
  Distance: mongoose.model('distance', distance),
  Movie: mongoose.model('movie', movie),
  MovieSessions: mongoose.model('movieSessions', movieSessions, 'movie-sessions'),
  Point: mongoose.model('point', point),
  User: mongoose.model('user', user),
}
