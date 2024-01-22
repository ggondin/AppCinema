import axios from 'axios';

const tmdbService = {
  init() {
    axios.defaults.baseURL = 'https://api.themoviedb.org/3';
    axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWI5MjdlNDVlMTc0N2M4Y2QxZmFmZWMzMDExODAxNSIsInN1YiI6IjY1YTk1NGJhNmY5NzQ2MDEyOGQ5MTYwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EiRb9f2PDmHBEuHuO5cA_TSjYqbxw5xRQkOYeFFJNi0';
  },
  getMovies(page) {
    return axios.get(`/movie/popular`, { params: { page } });
  },
  getMovie(id) {
    const language = 'pt-BR'
    return axios.get(`/movie/${id}`, { params: { language } });
  },
  searchMovies(query, page) {
    const language = 'pt-BR'
    return axios.get(`/search/movie`, { params: { query, page, language } });
  },
  searchMoviesByFilter(page, selectedGenres, selectedCertifications, selectedRuntime, voteAverage) {
    const language = 'pt-BR'
    return axios.get(`/discover/movie`, {
      params: {
        page,
        language,
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        with_genres: selectedGenres.join(','),
        certification_country: 'BR',
        certification: selectedCertifications.join('|'),
        with_runtime: { gte: selectedRuntime },
        vote_average: { gte: voteAverage }
      }
    });
  },
  searchMoviesByArray(page, language, sort_by, include_adult, include_video, with_genres, certification_country, certification, with_runtime, vote_average) {
    return axios.get(`/discover/movie`, {
      params: {
        page,
        language,
        sort_by,
        include_adult,
        include_video,
        with_genres: with_genres.join(','),
        certification_country,
        certification: certification.join('|'),
        with_runtime,
        vote_average
      }
    });
  },
  getGenres() {
    const language = 'pt-BR'
    return axios.get('/genre/movie/list', { params: { language } })
  },
  getCertifications() {
    const language = 'pt-BR'
    return axios.get('/certification/movie/list', { params: { language } })
  },
  getMovieVideos(id) {
    const language = 'pt-BR'
    return axios.get(`/movie/${id}/videos`, { params: { language } });
  },
  getLanguages() {
    const language = 'pt-BR'
    return axios.get('/configuration/languages', { params: { language } });
  },



};

export default tmdbService;