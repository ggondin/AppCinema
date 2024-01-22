<template>
  <div class="main-page-content">
    <SearchBar @search-query-updated="updateSearchQuery" @search-query-filter="updateSearchQueryByFilter" />
    <MovieCard ref="movieCard" />
  </div>
</template>

<script>
import tmdbService from '../services/tmdbSevice';
import MovieCard from '@/components/MovieCard.vue';
import SearchBar from '@/components/SearchBar.vue';
import { EventBus } from '../eventBus';

export default {
  name: 'MainPage',
  components: {
    MovieCard,
    SearchBar,
  },
  data() {
    return {
      searchResults: [],
    };
  },
  methods: {
    async updateSearchQuery(newQuery) {
      let movies = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await tmdbService.searchMovies(newQuery, page);
        movies = movies.concat(response.data.results);
        hasNextPage = response.data.page < response.data.total_pages;
        page++;
      }

      this.$refs.movieCard.movies = movies;
      console.log(this.$refs.movieCard.movies);
      EventBus.emit('filter-changed', newQuery);
    },

    async fetchMoviesByFilter(filteredQuery, page = 1, movies = []) {
      const response = await tmdbService.searchMoviesByArray(filteredQuery.page, filteredQuery.language, filteredQuery.sort_by, filteredQuery.include_adult, filteredQuery.include_video, filteredQuery.with_genres, filteredQuery.certification_country, filteredQuery.certification, filteredQuery.with_runtime, filteredQuery.vote_average, page);
      const newMovies = movies.concat(response.data.results);
      page++;

      if (page <= response.data.total_pages) {
        return this.fetchMoviesByFilter(filteredQuery, page, newMovies);
      } else {
        return newMovies;
      }
    },

    async updateSearchQueryByFilter(filteredQuery) {
      if (filteredQuery) {
        const movies = await this.fetchMoviesByFilter(filteredQuery);
        this.$refs.movieCard.movies = movies;
        console.log(this.$refs.movieCard.movies);
        EventBus.emit('filter-changed', filteredQuery);
      } else {
        const response = await tmdbService.getMovies(1);
        this.$refs.movieCard.movies = response.data.results;
        console.log(this.$refs.movieCard.movies);
        EventBus.emit('filter-changed', filteredQuery);
      }
    }



  },
}
</script>

<style>
.main-page-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>