<script>
    const apiKey = 'AIzaSyDlDBcOeQZZy1jbJEvBChrcpkxSRPLSufE';

    const generos = [
        { genero: 'pop', subgenero: 'pop rock' },
        { genero: 'rock', subgenero: 'hard rock' },
        { genero: 'jazz', subgenero: 'smooth jazz' },
        { genero: 'clásica', subgenero: 'barroca' },
        { genero: 'electrónica', subgenero: 'house' },
        { genero: 'hip hop', subgenero: 'rap' },
        { genero: 'reggae', subgenero: 'dancehall' },
        { genero: 'country', subgenero: 'bluegrass' },
        { genero: 'blues', subgenero: 'rhythm and blues' },
        { genero: 'latina', subgenero: 'salsa' },
        { genero: 'metal', subgenero: 'heavy metal' },
        { genero: 'folk', subgenero: 'folk rock' },
        { genero: 'funk', subgenero: 'disco' },
        { genero: 'gospel', subgenero: 'contemporary gospel' },
        { genero: 'soul', subgenero: 'neo soul' },
        { genero: 'punk', subgenero: 'punk rock' },
        { genero: 'techno', subgenero: 'minimal techno' },
        { genero: 'trance', subgenero: 'progressive trance' },
        { genero: 'dubstep', subgenero: 'brostep' },
        { genero: 'ambient', subgenero: 'dark ambient' },
        { genero: 'indie', subgenero: 'indie pop' },
        { genero: 'k-pop', subgenero: 'k-hip hop' },
        { genero: 'afrobeat', subgenero: 'afro house' },
        { genero: 'swing', subgenero: 'big band' },
        { genero: 'tango', subgenero: 'nuevo tango' },
        { genero: 'opera', subgenero: 'bel canto' },
        { genero: 'ska', subgenero: 'ska punk' },
        { genero: 'grunge', subgenero: 'post-grunge' },
        { genero: 'new wave', subgenero: 'synth-pop' },
        { genero: 'reggaeton', subgenero: 'latin trap' },
        { genero: 'trap', subgenero: 'trap latino' },
        { genero: 'house', subgenero: 'deep house' },
        { genero: 'drum and bass', subgenero: 'liquid funk' },
        { genero: 'garage', subgenero: 'garage rock' },
        { genero: 'emo', subgenero: 'emo pop' },
        { genero: 'industrial', subgenero: 'industrial metal' },
        { genero: 'world', subgenero: 'world fusion' },
        { genero: 'ANRI', subgenero: 'música de ANRI' },
        { genero: 'Miki Matsubara', subgenero: 'música de Miki Matsubara' }
    ];

    let generoActual = 0;
    let currentPlaylist = [];
    let currentSongIndex = 0;
    let player;

    function cargarListaGeneros() {
        const lista = document.getElementById('generos-list');
        lista.innerHTML = '';
        generos.forEach((gen, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${gen.genero} (${gen.subgenero})`;
            lista.appendChild(option);
        });
        lista.value = generoActual;
    }

    document.getElementById('generos-list').addEventListener('change', (event) => {
        generoActual = parseInt(event.target.value);
        cambiarGenero();
    });

    async function buscarVideos(genero, subgenero) {
        try {
            const respuesta = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${genero}+${subgenero}&key=${apiKey}&maxResults=50`);
            const datos = await respuesta.json();
            return datos.items.filter(video => video.snippet.title.includes("canción") || video.snippet.title.includes("music"));
        } catch (error) {
            console.error('Error al buscar videos:', error);
            return [];
        }
    }

    async function cambiarGenero() {
        const genero = generos[generoActual].genero;
        const subgenero = generos[generoActual].subgenero;
        const videos = await buscarVideos(genero, subgenero);
        reproducirVideoAleatorio(videos);
        document.getElementById('genero').innerText = `${genero} (${subgenero})`;
    }

    function reproducirVideoAleatorio(videos) {
        if (videos.length === 0) {
            console.error('No hay videos disponibles para este género.');
            return;
        }
        const videoAleatorio = videos[Math.floor(Math.random() * videos.length)];
        const videoId = videoAleatorio.id.videoId;
        const title = videoAleatorio.snippet.title;
        const thumbnailUrl = videoAleatorio.snippet.thumbnails.default.url;

        document.getElementById('title').innerText = title;
        document.getElementById('thumbnail').innerHTML = `<img src="${thumbnailUrl}" alt="Thumbnail">`;

        if (player) {
            player.loadVideoById(videoId);
        } else {
            player = new YT.Player('player', {
                height: '0',
                width: '0',
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            cambiarGenero();
        }
    }

    document.getElementById('iniciar-radio-btn').addEventListener('click', () => {
        cambiarGenero();
    });

    function onYouTubeIframeAPIReady() {
        cargarListaGeneros();
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
</script>
