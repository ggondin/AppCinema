<template>
     <div class="movie-card-content">
          <div v-for="movie in currentPageMovies" @click="goToMovie(movie.id)" :key="movie.id" class="movie-card">
               <div class="movie-card-poster" @mouseover="movie.showInfo = true" @mouseleave="movie.showInfo = false">

                    <svg v-if="movie.showInfo" class="progress-ring" xmlns="http://www.w3.org/2000/svg" width="120"
                         height="120" viewBox="0 0 141 140" fill="none">
                         <g filter="url(#filter0_b_1239_940)">
                              <circle class="ring" cx="70.5" cy="70" r="70" stroke="#bec3c4" stroke-width="15" fill="black"
                                   fill-opacity="0.5" stroke-dashoffset="0">
                              </circle>
                              <circle cx="70.5" cy="70" r="70" stroke="#ffe000" stroke-width="15" fill="transparent"
                                   fill-opacity="0.5" :stroke-dasharray="circumference"
                                   :stroke-dashoffset="offset(movie.vote_average)">
                              </circle>

                         </g>
                         <defs>
                              <filter id="filter0_b_1239_940" x="-3.5" y="-4" width="148" height="148"
                                   filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                   <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                   <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                   <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1239_940" />
                                   <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1239_940"
                                        result="shape" />
                              </filter>
                         </defs>

                         <text x="50%" y="50%" text-anchor="middle" stroke="#ffe000" stroke-width="1px" dy=".3em"
                              fill="#ffe000">{{ Math.floor(movie.vote_average * 10) }}%</text>
                    </svg>

                    <img v-if="movie.poster_path" class="movie-card-img"
                         :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Poster do filme">
                    <img v-else class="movie-card-img" src="../assets/unknown.svg" alt="Imagem padrão">
                    <div class="movie-card-span-texts">
                         <p class="movie-card-title">{{ movie.title }}</p>
                         <p v-if="movie.showInfo" class="movie-genres">{{ movie.genre_ids.filter(id => id &&
                              genres[id]).map(id => genres[id]).join(', ') }}</p>
                    </div>
               </div>
          </div>
     </div>

     <div class="movie-card-next-page">
          <button @click="previousPage" class="movie-card-next-page-button skip" :class="{ 'active': currentPage !== 0 }">
               <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none"
                    stroke="rgba(234, 230, 253, 0.43)">
                    <path d="M7.5 1.5L1.5 7.5L7.5 13.5" stroke="#EAE6FD" stroke-opacity="0.43" stroke-width="2" />
               </svg>
          </button>


          <button v-for="pageNum in pageNumbers()" :key="pageNum" @click="goToPage(pageNum)"
               v-bind:class="{ 'next': pageNum !== currentPage, 'movie-card-next-page-button': true }">
               <p>{{ pageNum + 1 }}</p>
          </button>

          <button @click="nextPage" class="movie-card-next-page-button next skip">
               <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
                    <path d="M1.5 1L7.5 7L1.5 13" stroke="rgba(234, 230, 253, 0.43)" stroke-width="2" />
               </svg>
          </button>
     </div>
</template>
   
<script>
import tmdbService from '../services/tmdbSevice';
import { EventBus } from '../eventBus.js';

export default {
     name: 'MovieCard',
     data() {
          return {
               movies: [],
               genres: [],
               movie: null,
               currentPage: 0,
               circumference: 2 * Math.PI * 58,
               displeyedMovies: [],
               filterActive: false,
          };
     },
     computed: {
          currentPageMovies() {
               return this.movies.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
          },
     },
     watch: {
          movies(newMovies) {
               if (newMovies.length > 0) {
                    this.displayedMovies = newMovies;
               } else {
                    this.fetchAllMovies();
               }
          },
     },
     methods: {
          async fetchAllMovies() {
               const response = await tmdbService.getMovies(1);
               this.displayedMovies = response.data.results.map(movie => ({ ...movie, showInfo: false }));
          },
          offset(vote_average) {
               const progress = vote_average / 10;
               return this.circumference * (1 - progress);
          },
          async nextPage() {
               if (!this.filterActive) {
                    this.goToPage(this.currentPage + 1);
               }
          },
          previousPage() {
               if (this.currentPage > 0) {
                    this.currentPage--;
               }
          },
          pageNumbers() {
               let start = Math.max(this.currentPage - 2, 0);
               let end = Math.min(start + 5, this.page);
               start = Math.max(end - 5, 0);
               return Array.from({ length: end - start }, (v, k) => k + start);
          },
          async goToPage(pageNum) {
               if (pageNum !== this.currentPage) {
                    this.currentPage = pageNum;
                    if ((this.currentPage + 1) * 10 >= this.movies.length && !this.filterActive) {
                         console.log('sou o goToPage', this.movies);
                         const nextPageNumber = Math.floor(this.movies.length / 20) + 1;
                         const response = await tmdbService.getMovies(nextPageNumber);
                         this.movies = this.movies.concat(response.data.results.map(movie => ({ ...movie, showInfo: false })));
                         console.log('sou o goToPage2', this.movies);
                    }
               }
          },
          goToMovie(movieId) {
               this.$router.push({ path: `/movie/${movieId}` });
          },
     },
     async created() {
          if (this.movies && this.movies.length > 0) {
               this.displayedMovies = this.movies;
          } else {
               this.fetchAllMovies();
          }
          tmdbService.init();
          const response = await tmdbService.getMovies(1);
          const genres = await tmdbService.getGenres();
          this.movies = response.data.results.map(movie => ({ ...movie, showInfo: false }));
          this.genres = genres.data.genres.reduce((map, genre) => {
               map[genre.id] = genre.name;
               return map;
          })
          this.page = response.data.total_pages;
          EventBus.on('filter-changed', (filter) => {
               this.filterActive = !!filter;
          });
     },
}
</script>

<style>
.movie-card-content {
     display: flex;
     flex-wrap: wrap;
     justify-content: space-around;
     align-items: flex-start;
     padding: 24px;
     border-radius: 4px;
     gap: 24px;
     background: rgba(235, 234, 248, 0.08);
}
.movie-card {
     flex: 1 0 18%;
     display: flex;
     justify-content: center;
     width: 100%;
}
.movie-card-poster {
     position: relative;
     width: 235px;
     height: 355px;
     display: flex;
     justify-content: center;
     flex-direction: column;
     align-items: center;
     background-size: cover;
     background-position: center;
     border-radius: 4px;
     box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.20);
     cursor: pointer;
}
.movie-card-span-texts {
     display: flex;
     position: absolute;
     bottom: 0;
     left: 0;
     width: 100%;
     height: 46%;
     border-radius: 4px;
     background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.50) 50%, #000 100%);
     flex-direction: column;
     justify-content: flex-end;
     align-items: flex-start
}
.movie-card-title {
     color: white;
     display: flex;
     text-align: left;
     align-items: flex-end;
     padding: 2% 4%;
     margin: 0;
     font-size: 20px;
     font-weight: 600;
     font-family: Montserrat;
     text-transform: uppercase;
}
.movie-genres {
     color: #B4B4B4;
     font-family: Montserrat;
     font-size: 12.8px;
     font-style: normal;
     font-weight: 400;
     margin: 0 4% 4% 4%;
}
.movie-card-img {
     width: 235px;
     height: 355px;
     border-radius: 4px;
}
.progress-ring {
     position: absolute;
     z-index: 1;
     fill: rgba(0, 0, 0, 0.50);
     backdrop-filter: blur(2px);
     border-radius: 60px;
}
text {
     font-size: 24px;
     fill: #ffe000;
     font-family: 'Montserrat';
     z-index: 1;
}
.movie-card-next-page {
     display: flex;
     justify-content: center;
     padding: 24px;
     gap: 12px;
     width: auto;
}
.movie-card-next-page-button {
     display: flex;
     align-items: flex-start;
     align-items: center !important;
     background: rgba(235, 234, 248, 0.08);
     min-height: 44px;
     padding: 12px 20px;
     gap: 12px;
     border-radius: 2px;
     border: none;
     outline: none;
     cursor: pointer;
}
.movie-card-next-page-button p {
     text-align: center;
     font-family: 'Roboto';
     font-size: 16px;
     color: rgba(234, 230, 253, 0.43);
     margin: 0;
}
.movie-card-next-page-button:hover {
     transition: all 0.3s ease;
     background: #9A5CD0;
}
.movie-card-next-page-button:active {
     background: #8457AA;
}
.next {
     color: #fff !important;
     background: #8E4EC6;
}
.next p,
.next svg {
     color: #fff !important;
     stroke: #fff !important;
}
.active {
     color: #fff !important;
     background: #8E4EC6;
}
@media screen and (max-width: 600px) {
     .movie-card-content {
          display: flex;
          width:  350px;
          padding: 4px;
          justify-content: center;
          align-items: center;
          align-content: center;
          gap: 1px;
          flex-wrap: wrap;
     }
     .movie-card-poster {
          display: flex;
          width: 165px !important;
          height: 265px !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
     }
     .movie-card {
          display: flex;
          width: 183px !important;
          height: 281px !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0;
     }
     .movie-card-img {
          display: flex;
          width: 165px !important;
          height: 264px !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
     }
     .movie-card-span-texts {
          display: flex;
          width: 133px !important;
          height: 157px !important;
          padding: 16px !important;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          gap: 8px;
     }
     .movie-card-title {
          color: #EEE;
          font-size: 14px;
          text-transform: uppercase;
          margin: 0 1% 0 8%;
     }
     .movie-genres {
          font-size: 12.8px;
     }
     .movie-card-next-page {
          display: flex;
          width: 100%;
          padding: 1% 0;
          justify-content: center;
          align-items: center;
          gap: 6px;
     }
     .movie-card-next-page-button {
          display: flex;
          min-height: 44px;
          width: 3%;
          padding: 12px 20px;
          justify-content: center;
          align-items: center;
     }
     .skip{
          width: 15%;
     }
     .movie-card-next-button svg {
          width: 9px;
          height: 14;
     }
}
</style>