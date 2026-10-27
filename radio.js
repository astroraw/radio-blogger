/*! radio.js v1.0.7 | (c) 2026, astroRAW | MIT License | astrotuner.blogspot.com */
document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const currentStationName = document.getElementById('current-station-name');
    const radioListEl = document.getElementById('radio-list');
    const playerEl = document.querySelector('.radio-player');

    let sound = null;
    let isPlaying = false;
    let currentStation = null;

    const radioStations = [{
        name: '99.7 | Bío Bío ⭐',
        src: 'https://unlimited3-cl.dps.live/biobiosantiago/aac/icecast.audio'
    }, {
        name: '91.3 | Conquistador ⭐',
        src: 'https://stream10.usastreams.com/9314/stream'
    }, {
        name: '88.1 | Imagina',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/IMAGINA_SC'
    }, {
        name: '88.5 | Concierto',
        src: 'https://27343.live.streamtheworld.com/CONCIERTOAAC_SC'
    }, {
        name: '88.9 | Futuro',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/FUTUROAAC_SC'
    }, {
        name: '89.7 | Duna',
        src: 'https://mdstrm.com/audio/67f42f96e464d19a6eda3c7d/icecast.audio'
    }, {
        name: '90.5 | Pudahuel',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/PUDAHUEL_SC'
    }, {
        name: '91.7 | ADN',
        src: 'https://27433.live.streamtheworld.com/ADNAAC_SC'
    }, {
        name: '92.1 | Agricultura',
        src: 'https://unlimited4-us.dps.live/agricultura/mp3/icecast.audio'
    }, {
        name: '92.5 | RadioActiva',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ACTIVA_SC'
    }, {
        name: '93.3 | Cooperativa',
        src: 'https://unlimited3-cl.dps.live/cooperativafm/mp3/icecast.audio'
    }, {
        name: '93.7 | Universo',
        src: 'https://unlimited3-cl.dps.live/universo/mp3/icecast.audio'
    }, {
        name: '94.1 | Rock & Pop',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ROCK_AND_POP_SC'
    }, {
        name: '95.3 | Disney',
        src: 'https://mdstrm.com/audio/67fe714d82a1ac0e129ae3cc/icecast.audio'
    }, {
        name: '95.9 | Tiempo',
        src: 'https://mdstrm.com/audio/639b7943e0a27908a55dbf9e/icecast.audio'
    }, {
        name: '98.5 | FM Dos',
        src: 'https://27423.live.streamtheworld.com/FMDOSAAC_SC'
    }, {
        name: '99.3 | Carolina',
        src: 'https://mdstrm.com/audio/637f68ddce4b1208597d8a86/icecast.audio'
    }, {
        name: '101.1 | Infinita',
        src: 'https://mdstrm.com/audio/639b791cea22540890cd1d8b/icecast.audio'
    }, {
        name: '101.3 | Corazón',
        src: 'https://playerservices.streamtheworld.com/api/livestream-redirect/CORAZON_SC'
    }, {
        name: '101.7 | Los 40',
        src: 'https://27343.live.streamtheworld.com/LOS40_CHILE_SC'
    }, {
        name: '102.1 | Oasis',
        src: 'https://mdstrm.com/audio/5c915497c6fd7c085b29169d/icecast.audio'
    }, {
        name: '104.1 | Romántica',
        src: 'https://mdstrm.com/audio/639b78f7ff35df084fa7f964/icecast.audio'
    }, {
        name: '92.6 | RTHK 1 🇭🇰',
        src: 'https://stm.rthk.hk/radio1'
    }, {
        name: '94.8 | RTHK 2 🇭🇰',
        src: 'https://stm.rthk.hk/radio2'
    }, ];

    function setPlayerState({ loading = false, playing = false, error = false }) {
        playerEl.classList.toggle('loading', loading);
        playerEl.classList.toggle('playing', playing);
        playerEl.classList.toggle('error', error);
        playPauseBtn.disabled = loading || error;
    }

    function clearActiveStations() {
        document.querySelectorAll('.radio-list li').forEach(li => {
            li.classList.remove('active');
            li.setAttribute('aria-selected', 'false');
        });
    }

    function playStation(station, listItem) {
        if (sound) {
            sound.stop();
            sound.unload();
            sound = null;
        }

        clearActiveStations();
        listItem.classList.add('active');
        listItem.setAttribute('aria-selected', 'true');
        
        currentStation = station;
        isPlaying = false;
        setPlayerState({ loading: true, playing: false, error: false });
        currentStationName.textContent = `Cargando: ${station.name}...`;

        sound = new Howl({
            src: [station.src],
            html5: true,
            format: ['aac', 'mp3', 'ogg', 'wav'],
            autoplay: true,
            onplay: () => {
                isPlaying = true;
                setPlayerState({ playing: true });
                currentStationName.textContent = station.name;
            },
            onend: () => {
                isPlaying = false;
                setPlayerState({ playing: false });
                currentStationName.textContent = `Fin de ${station.name}`;
                sound = null;
            },
            onloaderror: handleError,
            onplayerror: handleError,
        });
    }

    function handleError(id, error) {
        console.error('Error de reproducción/carga:', error, currentStation);
        isPlaying = false;
        setPlayerState({ error: true, playing: false, loading: false });
        currentStationName.textContent = `Error con: ${currentStation?.name || 'la radio'}`;
        sound = null;
    }

    function loadRadioList() {
        const fragment = document.createDocumentFragment();
        radioStations.forEach((station, index) => {
            const li = document.createElement('li');
            li.textContent = station.name;
            li.dataset.index = index;
            li.tabIndex = 0;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');

            li.addEventListener('click', () => playStation(station, li));
            li.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playStation(station, li);
                }
            });
            fragment.appendChild(li);
        });
        radioListEl.innerHTML = '';
        radioListEl.appendChild(fragment);
    }

    playPauseBtn.addEventListener('click', () => {
        if (!currentStation || !sound) {
            const firstListItem = radioListEl.querySelector('li');
            if (firstListItem) {
                firstListItem.click();
            }
            return;
        }

        if (isPlaying) {
            sound.pause();
            isPlaying = false;
            setPlayerState({ playing: false });
        } else {
            sound.play();
        }
    });

    loadRadioList();
});
