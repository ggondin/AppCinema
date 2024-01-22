<template>
     <div class="searchbar-content">
          <div class="searchbar-principal">
               <input placeholder="Pesquise por filmes" class="searchbar-input" type="text" v-model="searchQuery"
                    @keyup.enter="searchMovies">
               <div style="position: relative;" @click="searchMovies">
                    <svg class="searchbar-input-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 25 24" fill="none">
                         <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M11.5 18C15.366 18 18.5 14.866 18.5 11C18.5 7.13401 15.366 4 11.5 4C7.63401 4 4.5 7.13401 4.5 11C4.5 14.866 7.63401 18 11.5 18ZM11.5 6C10.8434 6 10.1932 6.12933 9.58658 6.3806C8.97995 6.63188 8.42876 7.00017 7.96447 7.46447C7.50017 7.92876 7.13188 8.47996 6.8806 9.08658C6.62933 9.69321 6.5 10.3434 6.5 11C6.5 11.5523 6.94772 12 7.5 12C8.05228 12 8.5 11.5523 8.5 11C8.5 10.606 8.5776 10.2159 8.72836 9.85195C8.87913 9.48797 9.1001 9.15726 9.37868 8.87868C9.65726 8.6001 9.98797 8.37913 10.3519 8.22836C10.7159 8.0776 11.106 8 11.5 8C12.0523 8 12.5 7.55228 12.5 7C12.5 6.44772 12.0523 6 11.5 6Z"
                              fill="#B5B2BC" />
                         <path d="M20.5 20L18.5 18" stroke="#B5B2BC" stroke-width="2" stroke-linecap="round" />
                    </svg>
               </div>

               <button class="searchbar-filter-button" @click="showFilters = !showFilters">
                    <img alt="Icone de Filtro" :src="require('../assets/icons/filter.svg')">
               </button>
          </div>
          <transition name="fade">
               <div class="search-filters" v-show="showFilters">
                    <div class="filters-content">
                         <div class="filter-checkbox">
                              <div class="filter-genres">
                                   <p>Gêneros</p>
                                   <div v-for="genre in genres" :key="genre.id">
                                        <input type="checkbox" :id="genre.id" v-model="selectedGenres" :value="genre.id">
                                        <label :for="genre.id">{{ genre.name }}</label>
                                   </div>
                              </div>
                              <div class="filter-certification">
                                   <p>Classificação</p>
                                   <div v-for="certification in certifications" :key="certification.id">
                                        <input type="checkbox" :id="certification.id" v-model="selectedCertifications"
                                             :value="certification.id">
                                        <label :for="certification.id">{{ certification.id }}</label>
                                   </div>

                              </div>
                         </div>
                         <div class="filter-input">
                              <div class="filter-input-content">
                                   <label for="runtime">Tempo (em minutos)</label>
                                   <input type="number" id="runtime" v-model.number="selectedRuntime" min="0" max="400">

                              </div>
                              <div class="filter-input-content">
                                   <label for="rating">Nota mínima:</label>
                                   <input type="number" id="rating" v-model="minRating" min="0" max="10" step="0.1">
                              </div>
                         </div>
                    </div>

                    <div class="search-filters-buttons">
                         <button @click="searchMovies" class="search-filters-button">
                              <img :src="require('../assets/icons/search.svg')" alt="">
                              <p>PESQUISAR</p>
                         </button>
                         <button @click="clearFilters" class="search-filters-button">
                              <img :src="require('../assets/icons/close.svg')" alt="">
                              <p>LIMPAR</p>
                         </button>
                    </div>
               </div>
          </transition>
     </div>
</template>

<script>
import tmdbService from '../services/tmdbSevice';
import _ from 'lodash'

export default {
     name: 'SearchBar',
     data() {
          return {
               searchQuery: '',
               showFilters: false,
               selectedGenres: [],
               certifications: [
                    { id: 'L' },
                    { id: '10' },
                    { id: '12' },
                    { id: '14' },
                    { id: '16' },
                    { id: '18' }
               ],
               selectedCertifications: [],
               voteAverage: 0,
               selectedRuntime: 0,
               filteredMovies: []
          }
     },
     watch: {
          searchQuery: _.debounce(function (newQuery) {
               this.$emit('search-query-updated', newQuery);
          }, 1500),
          filteredMovies: _.debounce(function (filteredQuery) {
               this.$emit('search-query-filter', filteredQuery);
          }, 2000),
     },
     methods: {
          async searchMovies() {
               if (this.searchQuery) {
                    const response = await tmdbService.searchMovies(this.searchQuery, 1);
                    this.movies = response.data.results;
               } else {
                    const response = await tmdbService.searchMoviesByFilter(1, this.selectedGenres, this.selectedCertifications, this.selectedRuntime, this.voteAverage)
                    this.movies = response.data.results;
                    this.filteredMovies = {
                         page: 1,
                         language: "pt-BR",
                         sort_by: "popularity.desc",
                         include_adult: false,
                         include_video: false,
                         with_genres: this.selectedGenres,
                         certification_country: "BR",
                         certification: this.selectedCertifications,
                         with_runtime: { gte: this.selectedRuntime },
                         vote_average: { gte: this.voteAverage }
                    }
               }
          },
          async clearFilters() {
               this.filteredMovies = null;
          }
     }, async mounted() {
          const responseGenre = await tmdbService.getGenres();
          this.genres = responseGenre.data.genres;
     }
}
</script>

<style>
body {
     font-family: Roboto;
     color: white;
}
.searchbar-content {
     display: flex;
     padding: 24px;
     justify-content: center;
     align-items: center;
     gap: 10px;
     flex-direction: column;
     width: 100%;
}
.searchbar-principal {
     display: flex;
     flex-direction: row;
     width: 100%;
     justify-content: center;
     gap: 0.5%;
}
.searchbar-input {
     max-width: 488px;
     padding: 16px;
     padding-right: 40px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     flex: 1 0 0;
     border-radius: 4px;
     border: 1px solid #49474E;
     background: #1A191B;
     font-family: Roboto;
     font-size: 16px;
     font-weight: 400;
     color: #fff;
     outline: transparent;
}
.searchbar-input:focus {
     transition: all 0.5s ease;
     border: 1px solid #8E4EC6;
}
.searchbar-input-logo {
     position: absolute;
     right: 20px;
     top: 50%;
     transform: translateY(-50%);
     cursor: pointer;
}
.searchbar-filter-button {
     border: none;
     display: flex;
     width: 55px;
     min-height: 44px;
     padding: 12px 20px;
     justify-content: center;
     align-items: center;
     gap: 12px;
     flex-shrink: 0;
     align-self: stretch;
     border-radius: 2px;
     background: rgba(183, 68, 247, 0.08);
     backdrop-filter: blur(2px);
}
.searchbar-filter-button:hover {
     transition: all 0.5s ease;
     border-radius: 2px;
     background: rgba(193, 80, 255, 0.18);
     backdrop-filter: blur(2px);
     cursor: pointer;
}
.searchbar-filter-button:active {
     border-radius: 2px;
     background: rgba(180, 18, 249, 0.04);
     backdrop-filter: blur(2px);
}
.searchbar-filter-button img {
     filter: brightness(0) invert(1);
}
.search-filters {
     display: flex;
     width: 40%;
     padding: var(--Space-6, 32px);
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 16px;
     border-radius: var(--Radius-2, 4px);
     border: 1px solid #E5484D;
     background: rgba(26, 25, 27, 0.60);
     backdrop-filter: blur(2px);
}
.fade-enter-active,
.fade-leave-active {
     transition: opacity .3s;
}
.fade-enter,
.fade-leave-to {
     opacity: 0;
}
.search-filters-buttons {
     display: flex;
     width: 100%;
     justify-content: flex-end;
     align-items: center;
}
.search-filters-buttons img {
     width: 24px !important;
     height: 24px !important;
     filter: brightness(0) invert(1);
}
.search-filters-buttons p {
     color: #FFF;
     font-family: Roboto;
     margin: 0;
}
.search-filters-button {
     display: flex;
     min-height: 44px;
     padding: 12px 20px;
     justify-content: center;
     border-radius: 2px;
     background: #8E4EC6;
     border: none;
     outline: none;
     width: 20%;
     align-items: center;
     margin: 0.5%;
     cursor: pointer;
}
.search-filters-button:hover {
     transition: all 0.5s ease;
     background: #9A5CD0;
}
.search-filters-button:active {
     background: #8457AA;
}
.filters-content {
     display: flex;
     align-items: baseline;
     flex-direction: column;
}
.filter-checkbox {
     display: flex;
}
.filter-genres {
     display: flex;
     flex-direction: row;
     flex-wrap: wrap;
     width: 100%;
     border-radius: 2px;
}
.filter-genres p {
     width: 80%;
     display: flex;
     justify-content: space-between;
     margin: 0;
     padding: 1%;
}
.filter-genres>div {
     width: 27%;
     display: flex;
     min-height: 22px;
     padding: 10px 15px;
     gap: 12px;
     border-radius: 2px;
     background: rgba(183, 68, 247, 0.08);
     -webkit-backdrop-filter: blur(2px);
     backdrop-filter: blur(2px);
     margin: 0.5%;
     align-items: center;
}
.filter-genres>div input[type="checkbox"] {
     appearance: none;
     width: 20px;
     height: 20px;
     background: #f2f2f2;
     border-radius: 50%;
     position: relative;
}
.filter-genres>div input[type="checkbox"]:checked::before {
     opacity: 1;
}
.filter-genres>div input[type="checkbox"]::before {
     content: '';
     position: absolute;
     top: 5px;
     left: 5px;
     width: 10px;
     height: 10px;
     border-radius: 50%;
     background: #000;
     opacity: 0;
     transition: opacity 0.1s ease;
}
.filter-certification {
     width: 15%;
}
.filter-certification p {
     width: 80%;
     display: flex;
     margin: 0;
     padding-bottom: 16%;
}
.filter-certification>div {
     width: 65%;
     display: flex;
     min-height: 22px;
     padding: 10px 15px;
     gap: 12px;
     border-radius: 2px;
     background: rgba(183, 68, 247, 0.08);
     -webkit-backdrop-filter: blur(2px);
     backdrop-filter: blur(2px);
     margin-bottom: 7%;
     align-items: center;
}
.filter-certification>div input[type="checkbox"] {
     appearance: none;
     width: 20px;
     height: 20px;
     background: #f2f2f2;
     border-radius: 50%;
     position: relative;
}
.filter-certification>div input[type="checkbox"]::before {
     content: '';
     position: absolute;
     top: 5px;
     left: 5px;
     width: 10px;
     height: 10px;
     border-radius: 50%;
     background: #000;
     opacity: 0;
     transition: opacity 0.2s ease;
}
.filter-certification>div input[type="checkbox"]:checked::before {
     opacity: 1;
}
.filter-input {
     width: 100%;
     height: 130px;
     display: flex;
     margin-left: 1%;
     flex-direction: row;
}
.filter-input-content {
     display: flex;
     flex-direction: column;
     width: 50%;
}
.filter-input label {
     width: 80%;
     display: flex;
     justify-content: space-between;
     padding-bottom: 1%;
     padding-top: 1%;
}
.filter-input input {
     min-height: 30px;
     width: 54%;
     padding: 1.5%;
     border-radius: var(--Radius-2, 4px);
     border: 1px solid #3C393F;
     background: #1A191B;
     font-family: Roboto;
     color: #fff;
     font-weight: 500;
}
.filter-avarage {
     width: 5%;
}
@media screen and (max-width: 600px) {
     .filters-content {
          align-items: center;
     }
     .search-filters {
          width: 80%;
     }
     .filter-genres {
          flex-direction: column;
     }
     .filter-genres p {
          width: auto;
          justify-content: center;
     }
     .filter-genres>div {
          width: 85%;
     }
     .filter-checkbox {
          flex-direction: column;
     }
     .filter-certification {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
     }
     .filter-certification p {
          width: 100%;
          margin: 3% 0;
          padding: 0;
          justify-content: center;
     }
     .filter-certification>div {
          width: 35%;
          margin-bottom: 1%;
     }
     .filter-input {
          flex-direction: column;
     }
     .filter-input label {
          justify-content: center;
     }
     .filter-input-content {
          width: 100%;
          align-items: center;
     }
     .search-filters-buttons {
          justify-content: center;
     }
     .search-filters-button {
          width: 50%;
     }
}
</style>

