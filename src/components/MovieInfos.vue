<template>
     <div class="movie-details" :style="{
          backgroundImage: 'url(https://image.tmdb.org/t/p/original/' + movie.backdrop_path + ')',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundBlendMode: 'multiply'
     }">
          <img class="movie-detail-poster" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="">
          <div class="movie-detail-infos">
               <div style="display: flex; flex-direction: column">
                    <div class="movie-detail-infos-principal">
                         <div class="movie-detail-infos-titles">
                              <p class="movie-detail-title">{{ movie.title }}</p>
                              <p class="movie-detail-originalTitle">Título original: {{ movie.original_title }}</p>
                              <p class="movie-detail-tagline">{{ movie.tagline }}</p>
                         </div>
                         <div class="movie-detail-infos-datas">
                              <div class="movie-cards movie-detail-popularity">
                                   <p>popularidade</p>
                                   <p>{{ movie.popularity }}</p>
                              </div>
                              <div class="movie-cards movie-detail-popularity">
                                   <p>Votos</p>
                                   <p>{{ movie.vote_count }}</p>
                              </div>
                              <div class="movie-detail-voteAverage">
                                   <svg class="progress-ring-movie-infos" xmlns="http://www.w3.org/2000/svg" width="120"
                                        height="120" viewBox="0 0 141 140" fill="none">
                                        <g filter="url(#filter0_b_1239_940)">
                                             <circle class="ring" cx="70.5" cy="70" r="70" stroke="#bec3c4" stroke-width="15"
                                                  fill="black" fill-opacity="0.5" stroke-dashoffset="0">
                                             </circle>
                                             <circle cx="70.5" cy="70" r="70" stroke="#ffe000" stroke-width="15"
                                                  fill="transparent" fill-opacity="0.5" :stroke-dasharray="circumference"
                                                  :stroke-dashoffset="offset(movie.vote_average)">
                                             </circle>

                                        </g>
                                        <defs>
                                             <filter id="filter0_b_1239_940" x="-3.5" y="-4" width="148" height="148"
                                                  filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                                                  <feComposite in2="SourceAlpha" operator="in"
                                                       result="effect1_backgroundBlur_1239_940" />
                                                  <feBlend mode="normal" in="SourceGraphic"
                                                       in2="effect1_backgroundBlur_1239_940" result="shape" />
                                             </filter>
                                        </defs>

                                        <text x="50%" y="50%" text-anchor="middle" stroke="#ffe000" stroke-width="1px"
                                             dy=".3em" fill="#ffe000">{{ Math.floor(movie.vote_average * 10) }}%</text>
                                   </svg>
                              </div>
                         </div>
                    </div>
                    <div class="movie-detail-final">
                         <div class="movie-detail-about">
                              <div class="movie-cards movie-detail-sinopse">
                                   <p>SINOPSE</p>
                                   <p>{{ movie.overview }}</p>
                              </div>
                              <div class="movie-cards movie-detail-genre">
                                   <p class="genre-title">Gêneros</p>
                                   <span class="genre-span-sub">
                                        <p class="genre-sub" v-for="genre in movie.genres" :key="genre.id">{{
                                             genre.name }}</p>

                                   </span>
                              </div>
                         </div>
                         <div class="movie-detail-restInformartion">
                              <div class="movie-detail-info1">
                                   <span class="movie-detail-span">
                                        <div class="movie-cards movie-detail-sizes-info1">
                                             <p class="info1-title">LANÇAMENTO</p>
                                             <p class="info1-sub">{{ movie.release_date }}</p>
                                        </div>
                                        <div class="movie-cards movie-detail-sizes-info1">
                                             <p class="info1-title">DURAÇÃO</p>
                                             <p class="info1-sub">{{ movie.runtime }}</p>
                                        </div>
                                   </span>
                                   <span class="movie-detail-span">
                                        <div class="movie-cards movie-detail-sizes-info1">
                                             <p class="info1-title">SITUAÇÃO</p>
                                             <p class="info1-sub">{{ movie.status }}</p>
                                        </div>
                                        <div class="movie-cards movie-detail-sizes-info1">
                                             <p class="info1-title">IDIOMA</p>
                                             <p class="info1-sub">{{ languageMap[movie?.original_language] ||
                                                  movie.original_language }}</p>


                                        </div>



                                   </span>
                              </div>


                              <div class="movie-detail-info2">
                                   <div class="movie-cards movie-detail-sizes-info2">
                                        <p class="info1-title">ORÇAMENTO</p>
                                        <p class="info1-sub">${{ movie.budget }}</p>
                                   </div>
                                   <div class="movie-cards movie-detail-sizes-info2">
                                        <p class="info1-title">RECEITA</p>
                                        <p class="info1-sub">${{ movie.revenue }}</p>
                                   </div>
                                   <div class="movie-cards movie-detail-sizes-info2">
                                        <p class="info1-title">LUCRO</p>
                                        <p class="info1-sub">${{ movie.budget - movie.revenue }}</p>
                                   </div>

                              </div>
                         </div>
                    </div>

               </div>

          </div>
     </div>

     <div class="movie-video">
          <p>TRAILER</p>
          <iframe class="movie-video-yt" :src="'https://www.youtube.com/embed/' + (movieVideo.key || '')" frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen></iframe>
     </div>
</template>

<script>
import tmdbService from '../services/tmdbSevice';

export default {
     name: 'MovieInfos',
     data() {
          return {
               movieId: '',
               movie: [],
               circumference: 2 * Math.PI * 58,
               movieVideo: {},
               languageMap: []
          };
     },
     methods: {
          offset(vote_average) {
               const progress = vote_average / 10;
               return this.circumference * (1 - progress);
          },
     },
     async mounted() {


          this.movieId = this.$route.params.id;
          const response = await tmdbService.getMovie(this.movieId);
          this.movie = response.data;
          this.movieInfo = response.data
          console.log(this.$route.query.myProp);
          console.log(this.movie);
          const videoResponse = await tmdbService.getMovieVideos(this.movie.id);
          this.movieVideo = videoResponse.data.results[0] || {};

          const languageResponse = await tmdbService.getLanguages();
          this.languageMap = languageResponse.data.reduce((map, language) => {
               map[language.iso_639_1] = language.english_name;
               return map;
          }, {});
          console.log('Original language:', this.movie.original_language);
          console.log('Language map:', this.languageMap, this.languageMap[this.movie.original_language]);

     },

}
</script>

<style>
.movie-details {
     display: flex;
     flex-direction: row;
     align-items: flex-start;
     margin: 1%;
     padding: 32px;
     gap: 32px;
     background-size: cover;
     background-repeat: no-repeat;
}
.movie-detail-poster {
     width: 24%;
     border-radius: var(--Radius-2, 4px);
     box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.20);
}
.movie-detail-infos {
     display: flex;
}
.movie-cards {
     display: flex;
     padding: 16px;
     flex-direction: column;
     align-items: flex-start;
     gap: 8px;
     border-radius: 4px;
     background: rgba(35, 34, 37, 0.60);
     backdrop-filter: blur(2px);
}
.movie-video {
     padding: 1%;
}
.movie-video p {
     display: flex;
     color: #FFF;
     font-family: Montserrat;
     font-size: 24px;
     font-weight: 700;
}
.movie-video-yt {
     width: 100%;
     height: 100vh;
}
.movie-detail-infos-principal {
     display: flex;
     align-items: center;
     justify-content: space-between;
}
.movie-detail-infos-titles {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
}
.movie-detail-title {
     color: #EEEEF0;
     font-family: Montserrat;
     font-size: 32px;
     font-weight: 600;
     margin: 0;
     padding: 0;
}
.movie-detail-originalTitle {
     color: #B5B2BC;
     font-family: Montserrat;
     font-size: 16px;
     font-weight: 400;
     margin: 1% 0 8% 0;
     padding: 0;
}
.movie-detail-tagline {
     color: #EEEEF0;
     font-family: Montserrat;
     font-size: 16px;
     font-style: italic;
     font-weight: 400;
     margin: 0 0 1% 0;
     padding: 0;
}
.movie-detail-infos-datas {
     display: flex;
     gap: 16px;
     align-items: center;
}
.movie-detail-popularity {}
.movie-detail-popularity p {
     margin: 0;
}
.movie-detail-popularity p:first-child {
     color: #B5B2BC;
     font-family: Montserrat;
     font-size: 12px;
     font-style: normal;
     font-weight: 700;
     line-height: normal;
     text-transform: uppercase;
}
.movie-detail-popularity p:nth-child(2) {
     color: #FFF;
     font-family: Montserrat;
     font-size: 14px;
     font-style: normal;
     font-weight: 600;
     line-height: 100%;
     text-transform: uppercase;
}
.progress-ring-movie-infos {
     width: 72% !important;
     height: 72% !important;
     backdrop-filter: blur(2px);
     border-radius: 60px;
}
.movie-detail-final {
     display: flex;
     align-items: flex-start;
     gap: 16px;
     justify-content: space-between;
}
.movie-detail-about {
     width: 50%;
}
.movie-detail-sinopse {
     display: flex;
     padding: 16px;
     flex-direction: column;
     align-items: flex-start;
     gap: 8px;
     height: 30vh;
}
.movie-detail-genre {
     margin-top: 4%;
     width: 70%;
}
.genre-title {
     color: #B5B2BC;
     font-family: Montserrat;
     font-size: 14px;
     font-weight: 700;
}
.genre-span-sub {
     display: flex;
     flex-wrap: wrap;
     justify-content: flex-start;
     width: 100%;
}
.genre-sub {
     color: #ECD9FA;
     font-family: Montserrat;
     font-size: 12px;
     font-weight: 600;
     text-transform: uppercase;
     display: flex;
     padding: 8px;
     flex-direction: column;
     align-items: flex-start;
     gap: 8px;
     border-radius: 2px;
     background: rgba(193, 80, 255, 0.18);
     backdrop-filter: blur(2px);
     width: auto;
     margin: 1%;
     margin-top: 4%;
     width: auto;
}
.movie-detail-sinopse p:first-child {
     color: #B5B2BC;
     font-family: Montserrat;
     font-size: 16px;
     font-weight: 700;
     text-transform: uppercase;
     margin: 0;
}
.movie-detail-sinopse p:nth-child(2) {
     color: #EEEEF0;
     font-family: Montserrat;
     font-size: 16px;
     font-weight: 400;
     text-align: left;
     margin: 0;
}
.movie-detail-restInformartion {
     width: 50%;
}
.movie-detail-span {
     display: flex;
}
.movie-detail-info1 {
     width: 100%;
     display: flex;
     gap: 16px;
     justify-content: center;
     flex-direction: column;
}
.movie-detail-sizes-info1 {
     margin: 0 4% 2% 0;
     width: 100%;
}
.info1-title {
     color: #B5B2BC;
     font-family: Montserrat;
     font-size: 12px;
     font-weight: 700;
     text-transform: uppercase;
     margin: 0;
}
.info1-sub {
     color: #EEEEF0;
     font-family: Montserrat;
     font-size: 14px;
     font-weight: 700;
     margin: 0;
}
.movie-detail-info2 {
     display: flex;
     flex-direction: row;
     gap: 16px;
}
.movie-detail-sizes-info2 {
     display: flex;
     width: 100%;
     padding: 16px;
     flex-direction: column;
     align-items: flex-start;
     margin: 0 4% 2% 0;
}
@media screen and (max-width: 600px) {
     .movie-details {
          background: #121113 !important;
          flex-direction: column;
     }
     .movie-detail-poster {
          width: 100%;
     }
     .movie-detail-about {
          width: 100%;
     }
     .movie-detail-sinopse {
          height: auto;
          margin-top: 3%;
     }
     .movie-detail-infos-datas {
          gap: 4%;
     }
     .progress-ring-movie-infos {
          width: 100% !important;
     }
     .movie-detail-infos-principal {
          flex-direction: column;
          align-items: flex-start;
     }
     .movie-detail-final {
          flex-direction: column;
     }
     .movie-detail-genre {
          width: auto;
     }
     .genre-sub {
          width: auto;
     }
     .movie-detail-restInformartion {
          display: flex;
          flex-direction: column;
          width: 100%;
     }
     .movie-detail-info1 {}
     .movie-detail-sizes-info1 {
          display: flex;
          margin: 0%;
     }
     .movie-detail-span {
          width: 100%;
          gap: 4%;
     }
     .movie-detail-info2 {
          margin-top: 4%;
          width: 100%;
          flex-direction: column;
     }
     .movie-detail-sizes-info2 {
          flex-direction: row;
          margin: 0;
          flex-wrap: wrap;
          gap: 1%;
          width: 90%;
          align-items: center;
          padding: 5%;
     }
     .movie-video-yt {
          width: 100%;
          height: 50vh;
     }
     .info1-sub {
          color: #EEEEF0;
          font-family: Montserrat;
          font-size: 14px;
          font-weight: 400;
     }
}
</style>

<!-- {
     "adult": false,
     "backdrop_path": "/hMANgfPHR1tRObNp2oPiOi9mMlz.jpg",
     "belongs_to_collection": null,
     "budget": 135000000,
     "genres": [
         {
             "id": 28,
             "name": "Ação"
         },
         {
             "id": 12,
             "name": "Aventura"
         },
         {
             "id": 878,
             "name": "Ficção científica"
         }
     ],
     "homepage": "",
     "id": 424783,
     "imdb_id": "tt4701182",
     "original_language": "en",
     "original_title": "Bumblebee",
     "overview": "Cybertron foi derrotado. Quando Optimus Prime envia Bumblebee para defender a Terra, tem início sua jornada até se tornar um herói. Charlie Watson, uma adolescente que procura seu espaço no mundo, descobre e repara o robô, cheio de danos e disfarçado de Fusca. Enquanto os Decepticons caçam os Autobots sobreviventes, com a ajuda de uma agência secreta liderada pelo Agente Burns, Bumblebee e Charlie se unem para proteger o mundo.",
     "popularity": 47.263,
     "poster_path": "/x9vAcoPsyFQ6m3Re5S9DQSbudyi.jpg",
     "production_companies": [@media screen and (max-width: 600px) {
         {
             "id": 4,
             "logo_path": "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png",
             "name": "Paramount",
             "origin_country": "US"
         },
         {
             "id": 57031,
             "logo_path": "/1ai3zndjxL3BonlOJVS75GjTOuW.png",
             "name": "Allspark Pictures",
             "origin_country": "US"
         },
         {
             "id": 6734,
             "logo_path": null,
             "name": "Bay Films",
             "origin_country": "US"
         },
         {
             "id": 435,
             "logo_path": "/AjzK0s2w1GtLfR4hqCjVSYi0Sr8.png",
             "name": "di Bonaventura Pictures",
             "origin_country": "US"
         },
         {
             "id": 38831,
             "logo_path": null,
             "name": "Tom DeSanto/Don Murphy Production",
             "origin_country": ""
         }
     ],
     "production_countries": [
         {
             "iso_3166_1": "US",
             "name": "United States of America"
         }
     ],
     "release_date": "2018-12-15",
     "revenue": 467989645,
     "runtime": 114,
     "spoken_languages": [
         {
             "english_name": "English",
             "iso_639_1": "en",
             "name": "English"
         }
     ],
     "status": "Released",
     "tagline": "Todo herói tem um começo.",
     "title": "Bumblebee",
     "video": false,
     "vote_average": 6.726,
     "vote_count": 5771
 } -->