class TebakGambarGame {
    constructor() {
        this.gameData = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedAnswers = 0;
        this.hintUsed = false;
        this.hintsRemaining = 3;
        this.secondHintsRemaining = 2;

        this.gameSettings = {
            difficulty: 'all',
            questionsPerGame: 5,
            theme: 'dark',
            soundEnabled: true,
            backgroundType: 'random',
            selectedBackground: 0,
            hintLimit: '5',
            secondHintEnabled: true,
            secondHintLimit: '5'
        };

        this.animeBackgrounds = [];
        this.loadLocalBackgrounds();

        this.timerInterval = null;
        this.timerDuration = 60; // 60 seconds
        this.timeRemaining = this.timerDuration;
        this.serverStartTime = Date.now(); // Track when the app started
        this.uptimeInterval = null;

        // Music player properties
        this.backgroundMusic = null;
        this.musicToggle = null;
        this.volumeSlider = null;
        this.musicProgress = null;
        this.isPlaying = false;
        this.currentSongIndex = 0;

        // Music library
        this.musicLibrary = [
            {
                title: "三原色 (Sangenai)",
                artist: "YOASOBI (Ayase & ikura)",
                file: "./MUSIK/YOASOBI「三原色」Official Music Video [nhOhFOoURnE] (1).mp3",
                details: {
                    judul: "🎵 三原色 (Sangenshoku) / RGB",
                    artis: "👥 YOASOBI (Ayase & ikura)",
                    rilisDigital: "📅 2 Juli 2021",
                    rilisCD: "💿 Termasuk dalam EP The Book 2 (1 Desember 2021)",
                    anime: "🎌 Tidak terkait dengan anime",
                    inspirasi: "💡 Tema warna primer RGB dan emosi manusia",
                    mv: "🎬 Dirilis 2 Juli 2021, visual RGB yang mendalam",
                    views: "👀 200+ juta views di YouTube",
                    penghargaan: "🏆 Billboard Japan Hot 100 #4, Oricon Digital #1",
                    durasi: "⏱️ 3:44",
                    key: "🎹 RGB Color Theme",
                    bpm: "🥁 134 BPM",
                    genre: "🎼 J-Pop"
                }
            },
            {
                title: "ラブレター (Love Letter)",
                artist: "YOASOBI (Ayase & ikura)",
                file: "./MUSIK/YOASOBI「ラブレター」Official Music Video [mnta9Pp2LqA].mp3",
                details: {
                    judul: "💌 ラブレター (Love Letter)",
                    artis: "👥 YOASOBI (Ayase & ikura)",
                    rilisDigital: "📅 9 Agustus 2021",
                    rilisCD: "💿 9 November 2021",
                    anime: "🎌 Tidak terkait dengan anime",
                    inspirasi: "📝 Surat siswa kelas 6 dalam Letter Song Project",
                    mv: "🎬 Dirilis akhir Agustus 2021 (MV animasi penuh makna simbolis)",
                    views: "👀 150+ juta views di YouTube",
                    penghargaan: "🏆 #1 Digital Oricon, #3 Combined, Billboard Japan #4 Hot 100",
                    durasi: "⏱️ 3:32",
                    key: "🎹 G major",
                    bpm: "🥁 100 BPM",
                    kolaborator: "🎺 Osaka Tōin High School Brass Band",
                    versiInggris: "🇺🇸 Masuk E-SIDE 2, dirilis 18 November 2022",
                    genre: "🎼 J-Pop"
                }
            },
            {
                title: "祝福 (Shukufuku)",
                artist: "YOASOBI (Ayase & ikura)",
                file: "./MUSIK/YOASOBI「祝福」Official Music Video (『機動戦士ガンダム 水星の魔女』オープニングテーマ) [3eytpBOkOFA] (1).mp3",
                details: {
                    judul: "🌟 祝福 (Shukufuku) / The Blessing",
                    artis: "👥 YOASOBI (Ayase & ikura)",
                    rilisDigital: "📅 1 Oktober 2022",
                    rilisCD: "💿 9 November 2022 (dengan versi Inggris)",
                    anime: "🤖 Opening Mobile Suit Gundam: The Witch from Mercury (Season 1)",
                    inspirasi: "📖 Berdasarkan Yurikago no Hoshi oleh Ichirō Ōkouchi",
                    mv: "🎬 Official Music Video untuk Gundam: The Witch from Mercury",
                    views: "👀 180+ juta views di YouTube",
                    penghargaan: "🏆 Oricon #3, Billboard Japan #2; Platinum (download), Triple Platinum (streaming)",
                    durasi: "⏱️ 3:16",
                    key: "🎹 Electropop / Dance-pop",
                    bpm: "🥁 128 BPM",
                    genre: "🎼 Electropop / Dance-pop"
                }
            },
            {
                title: "Mr. (ミスター)",
                artist: "YOASOBI (Ayase, Ikura)",
                file: "./MUSIK/YOASOBI「ミスター」Official Music Video [2-c0DFt6vK4].mp3",
                details: {
                    judul: "Mr. (ミスター)",
                    artis: "YOASOBI (Ayase, Ikura)",
                    rilis: "Jepang: 16 Feb 2022; Inggris: 12 Apr 2024",
                    asalKisah: "Berdasarkan cerita pendek Watashi Dake no Shoyūsha",
                    genre: "City Pop, nuansa melankolis & puitis",
                    durasi: "±3:07",
                    tempo: "120 BPM",
                    key: "C♯ minor",
                    prestasiChart: "#11 Billboard Japan; #19 Oricon",
                    versiInggris: "Hadir di EP E-SIDE 3"
                }
            }
        ];

        this.init();
    }

    async init() {
        // Load actual game data
        await this.loadGameData();
        // Load local backgrounds after game data
        await this.loadLocalBackgrounds();
        this.setupEventListeners();
        this.loadSettings();
        this.updateTheme();
        this.updateStats(); // Update stats after data is loaded
        this.startClock();
        this.setupExitConfirmation();
        this.initMusicPlayer();
    }

    async loadLocalBackgrounds() {
        try {
            // Daftar lengkap gambar yang ada di folder IMG - hanya simpan nama, tidak validasi
            const allImages = [
                '09076df59a560188c167200dd3bfe8b9.jpg',
                '0bcbc5ba40ef40089c2cca90d67ed739.jpg',
                '2f4c23ac0ae39c7fd3a51d949a5944d1.jpg',
                '3b56c674d5deffdc3e6afe6363831756.jpg',
                '434a23bf0d43a7de013c9962250ce220.jpg',
                '46ee7286dacead1df762b13c9beb0f60.jpg',
                '477165a04c5ebfb6f544ad90bc64dd9a.jpg',
                '78017a493e91f82e8a96accb576e7437.jpg',
                '7a7d7f9d3779362bc3afb2e7eada7a74.jpg',
                '7cfa688dcab66a322a7205553fcdbbe0.jpg',
                '8de99dbdb1d5a17a78d5dfbd39fd0aca.jpg',
                '96c3e837c82264c7fffbf86fb4ae3cff.jpg',
                '9d7950a2838b11d83146143936a7361d.jpg',
                '9dabf16a82cec4a1ebd465285d3426f1.jpg',
                'Anime-Girl-iPhone-Wallpaper-1.jpg',
                'Anime-World-Clouds-iPhone-Wallpaper-HD (1).jpg',
                'a393964c4358a125a51701c30936fd54.jpg',
                'anime-night-sky-illustration.jpg',
                'b42ca0e8432b0a6eef4082e6a8ed2c11.jpg',
                'bdabdba633c8460b6dec8c4b5c7a6c0e.jpg',
                'ce8cc0d8e6b3be67efb6bbfc67f7535c.jpg',
                'ec6f8852ee208898d36a73a17687ba6c.jpg',
                'f9720598e9d84ebc02a4f15e9dffca40.jpg'
            ];

            // Langsung set backgrounds tanpa validasi untuk mengurangi HTTP requests
            this.animeBackgrounds = allImages.map(imageName => `./IMG/${imageName}`);

            // Log minimal tanpa detail per file
            console.log(`🎨 Backgrounds loaded: ${allImages.length}/23 images available`);

        } catch (error) {
            console.error('Error loading backgrounds:', error);
            // Fallback ke beberapa gambar default
            this.animeBackgrounds = [
                './IMG/477165a04c5ebfb6f544ad90bc64dd9a.jpg',
                './IMG/7a7d7f9d3779362bc3afb2e7eada7a74.jpg',
                './IMG/anime-night-sky-illustration.jpg',
                './IMG/ce8cc0d8e6b3be67efb6bbfc67f7535c.jpg'
            ];
        }
    }

    checkImageExists(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = imagePath;
        });
    }

    async loadGameData() {
        try {
            const response = await fetch('./tebakgambar.json');
            this.gameData = await response.json();
            console.log(`Loaded ${this.gameData.length} questions`);
        } catch (error) {
            console.error('Error loading game data:', error);
            this.showError('Gagal memuat data permainan. Silakan refresh halaman.');
        }
    }

    setupEventListeners() {
        // Main menu buttons - with null checks
        const startGameBtn = document.getElementById('startGameBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const helpBtn = document.getElementById('helpBtn');
        const aboutBtn = document.getElementById('aboutBtn');
        const developerBtn = document.getElementById('developerBtn');
        const uptimeBtn = document.getElementById('uptimeBtn');
        const themeToggle = document.getElementById('themeToggle');

        if (startGameBtn) startGameBtn.addEventListener('click', () => this.startGame());
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.showSettings());
        if (helpBtn) helpBtn.addEventListener('click', () => this.showHelp());
        if (aboutBtn) aboutBtn.addEventListener('click', () => this.showAbout());
        if (developerBtn) developerBtn.addEventListener('click', () => this.showDeveloper());
        if (uptimeBtn) uptimeBtn.addEventListener('click', () => this.showUptime());

        // Music player button
        const musicPlayerBtn = document.getElementById('musicPlayerBtn');
        if (musicPlayerBtn) musicPlayerBtn.addEventListener('click', () => this.showMusicPlayerModal());

        // Header music controls
        const headerPreviousBtn = document.getElementById('headerPreviousBtn');
        const headerNextBtn = document.getElementById('headerNextBtn');

        if (headerPreviousBtn) headerPreviousBtn.addEventListener('click', () => this.previousSong());
        if (headerNextBtn) headerNextBtn.addEventListener('click', () => this.nextSong());

        // Theme toggle
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());

        // Settings
        const closeSettings = document.getElementById('closeSettings');
        const saveSettings = document.getElementById('saveSettings');
        const resetSettings = document.getElementById('resetSettings');

        // Website Settings
        const saveWebsiteSettings = document.getElementById('saveWebsiteSettings');
        const resetWebsiteSettings = document.getElementById('resetWebsiteSettings');
        const websiteName = document.getElementById('websiteName');
        const websiteIcon = document.getElementById('websiteIcon');

        if (closeSettings) closeSettings.addEventListener('click', () => this.hideSettings());
        if (saveSettings) saveSettings.addEventListener('click', () => this.saveSettingsAndClose());
        if (resetSettings) resetSettings.addEventListener('click', () => this.resetToDefault());

        // Website Settings Handlers
        if (saveWebsiteSettings) saveWebsiteSettings.addEventListener('click', () => this.saveWebsiteSettings());
        if (resetWebsiteSettings) resetWebsiteSettings.addEventListener('click', () => this.resetWebsiteSettings());

        // Background refresh button
        const refreshBackgrounds = document.getElementById('refreshBackgrounds');
        if (refreshBackgrounds) refreshBackgrounds.addEventListener('click', () => this.refreshBackgrounds());

        // Auto-save website settings on input
        if (websiteName) {
            websiteName.addEventListener('input', () => {
                if (typeof websiteSettings !== 'undefined') {
                    websiteSettings.siteName = websiteName.value || "Tebak Gambar - Game Seru";
                    websiteSettings.save();
                    this.showFeedback('⚡', 'Auto Simpan!', 'Nama website diubah', true);
                }
            });
        }

        if (websiteIcon) {
            websiteIcon.addEventListener('input', () => {
                if (typeof websiteSettings !== 'undefined') {
                    websiteSettings.siteIcon = websiteIcon.value || "https://i.postimg.cc/jd2DDHJR/b306e87340b6ec34db1828deb534208b.jpg";
                    websiteSettings.save();
                    this.showFeedback('⚡', 'Auto Simpan!', 'Icon website diubah', true);
                }
            });
        }
        const difficultySelect = document.getElementById('difficultySelect');
        const questionsPerGame = document.getElementById('questionsPerGame');
        const hintLimit = document.getElementById('hintLimit');
        const soundToggle = document.getElementById('soundToggle');
        const secondHintToggle = document.getElementById('secondHintEnabled');
        const secondHintLimit = document.getElementById('secondHintLimit');

        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.gameSettings.difficulty = e.target.value;
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Tingkat kesulitan diubah', true);
            });
        }

        if (questionsPerGame) {
            questionsPerGame.addEventListener('change', (e) => {
                this.gameSettings.questionsPerGame = parseInt(e.target.value);
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Jumlah soal diubah', true);
            });
        }

        if (hintLimit) {
            hintLimit.addEventListener('change', (e) => {
                this.gameSettings.hintLimit = e.target.value;
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Batas bantuan diubah', true);
            });
        }

        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.gameSettings.soundEnabled = e.target.checked;
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Efek suara diubah', true);
            });
        }

        if (secondHintToggle) {
            secondHintToggle.addEventListener('change', (e) => {
                this.gameSettings.secondHintEnabled = e.target.checked;
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Petunjuk kedua diubah', true);
            });
        }

        if (secondHintLimit) {
            secondHintLimit.addEventListener('change', (e) => {
                this.gameSettings.secondHintLimit = e.target.value;
                this.saveSettings();
                this.showFeedback('⚡', 'Auto Simpan!', 'Batas petunjuk kedua diubah', true);
            });
        }

        // Background settings
        const backgroundTypeSelect = document.getElementById('backgroundType');
        const backgroundSelect = document.getElementById('backgroundSelect');

        if (backgroundTypeSelect) {
            backgroundTypeSelect.addEventListener('change', (e) => {
                this.gameSettings.backgroundType = e.target.value;
                this.saveSettings();
                this.updateBackground();
                this.showFeedback('⚡', 'Auto Simpan!', 'Jenis background diubah', true);
            });
        }

        if (backgroundSelect) {
            backgroundSelect.addEventListener('change', (e) => {
                this.gameSettings.selectedBackground = parseInt(e.target.value);
                this.saveSettings();
                this.updateBackground();
                this.showFeedback('⚡', 'Auto Simpan!', 'Background anime diubah', true);
            });
        }

        // Theme options
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameSettings.theme = e.target.dataset.theme;
                this.saveSettings();
                this.updateTheme();
                this.showFeedback('⚡', 'Auto Simpan!', 'Tema tampilan diubah', true);
            });
        });

        // Game controls - with null checks
        const exitGameBtn = document.getElementById('exitGameBtn');
        const showHintBtn = document.getElementById('showHintBtn');
        const showSecondHintBtn = document.getElementById('showSecondHintBtn');
        const submitAnswerBtn = document.getElementById('submitAnswerBtn');
        const skipQuestionBtn = document.getElementById('skipQuestionBtn');
        const answerInput = document.getElementById('answerInput');

        if (exitGameBtn) exitGameBtn.addEventListener('click', () => this.showExitConfirmation());
        if (showHintBtn) showHintBtn.addEventListener('click', () => this.showHint());
        if (showSecondHintBtn) showSecondHintBtn.addEventListener('click', () => this.showSecondHint());
        if (submitAnswerBtn) submitAnswerBtn.addEventListener('click', () => this.submitAnswer());
        if (skipQuestionBtn) skipQuestionBtn.addEventListener('click', () => this.skipQuestion());

        // Answer input
        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }

        // Modal controls - with null checks
        const closeHelp = document.getElementById('closeHelp');
        const closeAbout = document.getElementById('closeAbout');
        const closeDeveloper = document.getElementById('closeDeveloper');
        const closeUptime = document.getElementById('closeUptime');
        const closeMusicPlayer = document.getElementById('closeMusicPlayer');
        const closeMusicPlayerBtn = document.getElementById('closeMusicPlayerBtn');
        const closeSongDetails = document.getElementById('closeSongDetails');
        const closePlaylist = document.getElementById('closePlaylist');
        const refreshStats = document.getElementById('refreshStats');
        const testConnection = document.getElementById('testConnection');
        const playAgainBtn = document.getElementById('playAgainBtn');
        const backToMenuBtn = document.getElementById('backToMenuBtn');

        if (closeHelp) closeHelp.addEventListener('click', () => this.hideHelp());
        if (closeAbout) closeAbout.addEventListener('click', () => this.hideAbout());
        if (closeDeveloper) closeDeveloper.addEventListener('click', () => this.hideDeveloper());
        if (closeUptime) closeUptime.addEventListener('click', () => this.hideUptime());
        if (closeMusicPlayer) closeMusicPlayer.addEventListener('click', () => this.hideMusicPlayerModal());
        if (closeMusicPlayerBtn) closeMusicPlayerBtn.addEventListener('click', () => this.hideMusicPlayerModal());
        if (closeSongDetails) closeSongDetails.addEventListener('click', () => this.hideSongDetails());
        if (closePlaylist) closePlaylist.addEventListener('click', () => this.hidePlaylist());
        if (refreshStats) refreshStats.addEventListener('click', () => this.refreshUptimeStats());
        if (testConnection) testConnection.addEventListener('click', () => this.testConnection());
        if (playAgainBtn) playAgainBtn.addEventListener('click', () => this.startGame());
        if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => this.showMainMenu());

        // Music player modal controls
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playFullscreenBtn = document.getElementById('playFullscreenBtn');
        const modalVolumeSlider = document.getElementById('modalVolumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const modalProgressTrack = document.getElementById('modalProgressTrack');
        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');
        const songDetailsBtn = document.getElementById('songDetailsBtn');
        const seekBackwardBtn = document.getElementById('seekBackwardBtn');
        const seekForwardBtn = document.getElementById('seekForwardBtn');
        const playlistBtn = document.getElementById('playlistBtn');

        if (playPauseBtn) playPauseBtn.addEventListener('click', () => this.toggleMusic());
        if (playFullscreenBtn) playFullscreenBtn.addEventListener('click', () => this.toggleMusic());
        if (previousBtn) previousBtn.addEventListener('click', () => this.previousSong());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSong());
        if (songDetailsBtn) songDetailsBtn.addEventListener('click', () => this.showSongDetails());
        if (seekBackwardBtn) seekBackwardBtn.addEventListener('click', () => this.seekBackward());
        if (seekForwardBtn) seekForwardBtn.addEventListener('click', () => this.seekForward());
        if (playlistBtn) playlistBtn.addEventListener('click', () => this.showPlaylist());

        // Additional playlist button in modal
        const playlistBtnModal = document.getElementById('playlistBtnModal');
        if (playlistBtnModal) playlistBtnModal.addEventListener('click', () => this.showPlaylist());

        if (modalVolumeSlider) {
            modalVolumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
                this.updateModalVolumeDisplay(e.target.value);
            });
        }
        if (muteBtn) muteBtn.addEventListener('click', () => this.toggleMute());
        if (modalProgressTrack) {
            modalProgressTrack.addEventListener('click', (e) => {
                if (this.backgroundMusic && this.backgroundMusic.duration) {
                    const rect = modalProgressTrack.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * this.backgroundMusic.duration;
                    this.backgroundMusic.currentTime = newTime;
                }
            });
        }

        // Music player controls
        const musicToggle = document.getElementById('musicToggle');
        const volumeSlider = document.getElementById('volumeSlider');

        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleMusic());
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
                this.updateVolumeDisplay(e.target.value);
            });
        }

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('tebakGambarSettings');
        if (savedSettings) {
            this.gameSettings = { ...this.gameSettings, ...JSON.parse(savedSettings) };
        }

        // Apply settings to UI - with null checks
        const difficultySelect = document.getElementById('difficultySelect');
        const questionsPerGame = document.getElementById('questionsPerGame');
        const soundToggle = document.getElementById('soundToggle');
        const backgroundType = document.getElementById('backgroundType');
        const backgroundSelect = document.getElementById('backgroundSelect');
        const hintLimit = document.getElementById('hintLimit');
        const secondHintToggle = document.getElementById('secondHintEnabled');
        const secondHintLimitInput = document.getElementById('secondHintLimit');

        if (difficultySelect) difficultySelect.value = this.gameSettings.difficulty;
        if (questionsPerGame) questionsPerGame.value = this.gameSettings.questionsPerGame;
        if (soundToggle) soundToggle.checked = this.gameSettings.soundEnabled;
        if (backgroundType) backgroundType.value = this.gameSettings.backgroundType;
        if (backgroundSelect) backgroundSelect.value = this.gameSettings.selectedBackground;
        if (hintLimit) hintLimit.value = this.gameSettings.hintLimit;
        if (secondHintToggle) secondHintToggle.checked = this.gameSettings.secondHintEnabled; // Apply second hint setting
        if (secondHintLimitInput) secondHintLimitInput.value = this.gameSettings.secondHintLimit; // Apply second hint limit setting

        // Update theme option buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.gameSettings.theme);
        });

        // Set dark theme as default active
        if (!savedSettings) {
            const darkThemeBtn = document.querySelector('.theme-option[data-theme="dark"]');
            const autoThemeBtn = document.querySelector('.theme-option[data-theme="auto"]');
            if (darkThemeBtn) darkThemeBtn.classList.add('active');
            if (autoThemeBtn) autoThemeBtn.classList.remove('active');
        }

        // Update background after all settings are loaded
        setTimeout(() => {
            this.updateBackground();
        }, 100);

        // Load website settings if available
        this.loadWebsiteSettings();
    }

    saveSettings() {
        localStorage.setItem('tebakGambarSettings', JSON.stringify(this.gameSettings));
    }

    updateTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');

        if (this.gameSettings.theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '🌙';
        } else if (this.gameSettings.theme === 'light') {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '☀️';
        } else {
            // Auto theme based on time
            const hour = new Date().getHours();
            if (hour >= 18 || hour < 6) {
                body.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '🌙';
            } else {
                body.removeAttribute('data-theme');
                themeIcon.textContent = '☀️';
            }
        }
    }

    updateBackground() {
        const body = document.body;
        const backgroundSelect = document.getElementById('backgroundSelect');

        // Show/hide background selector based on type
        if (backgroundSelect) {
            if (this.gameSettings.backgroundType === 'anime') {
                backgroundSelect.style.display = 'block';
            } else {
                backgroundSelect.style.display = 'none';
            }
        }

        // Clear existing background first
        body.style.backgroundImage = '';
        body.style.backgroundSize = '';
        body.style.backgroundPosition = '';
        body.style.backgroundRepeat = '';
        body.style.backgroundAttachment = '';
        body.classList.remove('has-background');

        // Apply background based on type
        if (this.gameSettings.backgroundType === 'anime') {
            const bgUrl = this.animeBackgrounds[this.gameSettings.selectedBackground];
            if (bgUrl) {
                body.style.backgroundImage = `url('${bgUrl}')`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundRepeat = 'no-repeat';
                body.style.backgroundAttachment = 'fixed';
                body.classList.add('has-background');
            }
        } else if (this.gameSettings.backgroundType === 'random') {
            const randomIndex = Math.floor(Math.random() * this.animeBackgrounds.length);
            const bgUrl = this.animeBackgrounds[randomIndex];
            if (bgUrl) {
                body.style.backgroundImage = `url('${bgUrl}')`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundRepeat = 'no-repeat';
                body.style.backgroundAttachment = 'fixed';
                body.classList.add('has-background');
            }
        } else {
            // Default background - no image
            body.classList.remove('has-background');
        }
    }

    toggleTheme() {
        if (this.gameSettings.theme === 'light') {
            this.gameSettings.theme = 'dark';
        } else if (this.gameSettings.theme === 'dark') {
            this.gameSettings.theme = 'auto';
        } else {
            this.gameSettings.theme = 'light';
        }

        // Update active theme option
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.gameSettings.theme);
        });

        this.saveSettings();
        this.updateTheme();
    }

    updateStats() {
        const totalQuestions = this.gameData.length;
        const highScore = localStorage.getItem('tebakGambarHighScore') || 0;

        const totalQuestionsElement = document.getElementById('totalQuestionsCount');
        const highScoreElement = document.getElementById('highScoreDisplay');

        if (totalQuestionsElement) totalQuestionsElement.textContent = totalQuestions;
        if (highScoreElement) highScoreElement.textContent = highScore;

        // Debug log to check if data is loaded
        console.log('Total questions:', totalQuestions);
    }

    getFilteredQuestions() {
        let filtered = [...this.gameData];

        if (this.gameSettings.difficulty !== 'all') {
            const difficultyRanges = {
                easy: [0, 199],    // Level 1-10 (20 questions each)
                medium: [200, 399], // Level 11-20 (20 questions each)
                hard: [400, 699]    // Level 21-35 (20 questions each)
            };

            const [start, end] = difficultyRanges[this.gameSettings.difficulty];
            filtered = filtered.filter(q => q.index >= start && q.index <= end);
        }

        return filtered;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startGame() {
        // Get filtered and shuffled questions
        const availableQuestions = this.getFilteredQuestions();
        const shuffledQuestions = this.shuffleArray(availableQuestions);

        // Select questions for this game
        this.currentQuestions = shuffledQuestions.slice(0, this.gameSettings.questionsPerGame);

        // Reset game state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedAnswers = 0;
        this.hintUsed = false;

        // Initialize hint system - FIXED: Now properly reads from settings
        if (this.gameSettings.hintLimit === 'unlimited') {
            this.hintsRemaining = 999;
        } else {
            this.hintsRemaining = parseInt(this.gameSettings.hintLimit);
        }

        // Initialize second hint system - FIXED: Now properly reads from settings
        if (this.gameSettings.secondHintLimit === 'unlimited') {
            this.secondHintsRemaining = 999;
        } else {
            this.secondHintsRemaining = parseInt(this.gameSettings.secondHintLimit);
        }

        // Debug log to verify settings are being used
        console.log('Game started with hint settings:', {
            hintLimit: this.gameSettings.hintLimit,
            hintsRemaining: this.hintsRemaining,
            secondHintLimit: this.gameSettings.secondHintLimit,
            secondHintsRemaining: this.secondHintsRemaining
        });

        // Update UI
        this.updateScore();
        this.showGameArea();
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.endGame();
            return;
        }

        // Change background if random mode is enabled
        if (this.gameSettings.backgroundType === 'random') {
            this.updateBackground();
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        const questionCounter = document.getElementById('questionCounter');
        const progressFill = document.getElementById('progressFill');
        const questionImage = document.getElementById('questionImage');
        const imageLoader = document.getElementById('imageLoader');
        const answerInput = document.getElementById('answerInput');
        const hintText = document.getElementById('hintText');
        const hintBtn = document.getElementById('showHintBtn');
        const timerDisplay = document.getElementById('timerDisplay');
        const secondHintBtn = document.getElementById('showSecondHintBtn'); // New button

        // Update progress
        questionCounter.textContent = `${this.currentQuestionIndex + 1} / ${this.currentQuestions.length}`;
        const progressPercent = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;

        // Reset question state
        answerInput.value = '';
        hintText.classList.remove('show');
        this.hintUsed = false;

        // Update hint button based on remaining hints - FIXED: Now shows correct values
        if (this.hintsRemaining > 0) {
            hintBtn.disabled = false;
            if (this.gameSettings.hintLimit === 'unlimited') {
                hintBtn.textContent = '💡 Tampilkan Petunjuk';
            } else {
                hintBtn.textContent = `💡 Petunjuk (${this.hintsRemaining})`;
            }
        } else {
            hintBtn.disabled = true;
            hintBtn.textContent = '💡 Bantuan Habis';
        }

        // Update second hint button - FIXED: Now shows correct values
        if (this.gameSettings.secondHintEnabled && this.secondHintsRemaining > 0) {
            secondHintBtn.disabled = false;
            if (this.gameSettings.secondHintLimit === 'unlimited') {
                secondHintBtn.textContent = '🔑 Petunjuk Kedua';
            } else {
                secondHintBtn.textContent = `🔑 Petunjuk Kedua (${this.secondHintsRemaining})`;
            }
        } else if (!this.gameSettings.secondHintEnabled) {
            secondHintBtn.disabled = true;
            secondHintBtn.textContent = '🔑 Tidak Diaktifkan';
        } else {
            secondHintBtn.disabled = true;
            secondHintBtn.textContent = '🔑 Bantuan Habis';
        }

        // Debug log to check button values
        console.log('Button values updated:', {
            hintBtnText: hintBtn.textContent,
            secondHintBtnText: secondHintBtn.textContent,
            hintsRemaining: this.hintsRemaining,
            secondHintsRemaining: this.secondHintsRemaining
        });


        // Load image
        imageLoader.style.display = 'block';
        questionImage.style.display = 'none';

        questionImage.onload = () => {
            imageLoader.style.display = 'none';
            questionImage.style.display = 'block';
            answerInput.focus();
        };

        questionImage.onerror = () => {
            imageLoader.textContent = 'Gagal memuat gambar';
            console.error('Failed to load image:', question.img);
        };

        questionImage.src = question.img;
        questionImage.alt = `Tebak Gambar ${this.currentQuestionIndex + 1}`;
        timerDisplay.textContent = this.formatTime(this.timeRemaining);
    }

    startTimer() {
        // Stop any existing timer first
        this.stopTimer();

        this.timeRemaining = this.timerDuration;
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            // Check if game area is still active
            const gameArea = document.getElementById('gameArea');
            if (!gameArea || !gameArea.classList.contains('active')) {
                this.stopTimer();
                return;
            }

            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.skipQuestion();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = this.formatTime(this.timeRemaining);
        }

        // Additional safety check - if timer display is null, stop the timer
        if (!timerDisplay && this.timerInterval) {
            console.log('Timer display not found, stopping timer');
            this.stopTimer();
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showHint() {
        if (this.hintsRemaining <= 0) {
            this.showFeedback('❌', 'Bantuan Habis!', 'Anda sudah menggunakan semua bantuan', false);
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        const hintText = document.getElementById('hintText');
        const hintBtn = document.getElementById('showHintBtn');

        hintText.textContent = question.deskripsi;
        hintText.classList.add('show');
        hintBtn.disabled = true;
        hintBtn.textContent = '💡 Petunjuk Ditampilkan';
        this.hintUsed = true;

        // Decrease remaining hints
        if (this.gameSettings.hintLimit === 'unlimited') {
            this.hintsRemaining = 999;
        } else {
            this.hintsRemaining--;
        }

        this.playSound('hint');
    }

    showSecondHint() {
        if (!this.gameSettings.secondHintEnabled) {
            this.showFeedback('❌', 'Fitur Tidak Aktif', 'Petunjuk kedua tidak diaktifkan di pengaturan.', false);
            return;
        }

        if (this.secondHintsRemaining <= 0) {
            this.showFeedback('❌', 'Bantuan Habis!', 'Anda sudah menggunakan semua petunjuk kedua', false);
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        const secondHintText = document.getElementById('secondHintText');
        const secondHintBtn = document.getElementById('showSecondHintBtn');

        if (!secondHintText || !secondHintBtn) return;

        // Create censored version of the answer
        let secondHint = question.jawaban;
        if (question.jawaban) {
            // Replace every 2nd and 3rd character with underscore for censoring effect
            const words = question.jawaban.split(' ');
            const censoredWords = words.map(word => {
                if (word.length <= 2) return word;
                return word.split('').map((char, index) => {
                    return (index + 1) % 2 === 0 || (index + 1) % 3 === 0 ? '_' : char;
                }).join('');
            });
            secondHint = `🔑 Petunjuk Kedua: ${censoredWords.join(' ')}`;
        } else {
            secondHint = "🔑 Tidak ada petunjuk kedua tersedia";
        }

        secondHintText.textContent = secondHint;
        secondHintText.classList.add('show');
        secondHintBtn.disabled = true;
        secondHintBtn.textContent = '🔑 Petunjuk Kedua Digunakan';

        // Decrease remaining second hints
        if (this.gameSettings.secondHintLimit !== 'unlimited') {
            this.secondHintsRemaining--;
        }

        this.playSound('hint');
    }


    submitAnswer() {
        this.stopTimer();
        const answerInput = document.getElementById('answerInput');
        const userAnswer = answerInput.value.trim().toLowerCase();

        if (!userAnswer) {
            this.showFeedback('❌', 'Silakan masukkan jawaban!', '', false);
            answerInput.classList.add('shake');
            setTimeout(() => answerInput.classList.remove('shake'), 500);
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        const correctAnswer = question.jawaban.toLowerCase();

        // Check if answer is correct (allow some flexibility)
        const isCorrect = this.checkAnswer(userAnswer, correctAnswer);

        if (isCorrect) {
            const points = this.hintUsed ? 5 : 10;
            this.score += points;
            this.correctAnswers++;
            this.updateScore();

            this.showFeedback('✅', 'Benar!', `Jawaban: ${question.jawaban}`, true);
            this.playSound('correct');
        } else {
            this.wrongAnswers++;
            this.showFeedback('❌', 'Salah!', `Jawaban yang benar: ${question.jawaban}`, false);
            this.playSound('wrong');
        }

        setTimeout(() => this.nextQuestion(), 2000);
    }

    checkAnswer(userAnswer, correctAnswer) {
        // Direct match
        if (userAnswer === correctAnswer) return true;

        // Remove common words and check
        const commonWords = ['dan', 'atau', 'yang', 'di', 'ke', 'dari', 'pada', 'untuk'];
        const cleanUser = userAnswer.split(' ').filter(word => !commonWords.includes(word)).join(' ');
        const cleanCorrect = correctAnswer.split(' ').filter(word => !commonWords.includes(word)).join(' ');

        if (cleanUser === cleanCorrect) return true;

        // Check if user answer contains the key words
        const userWords = userAnswer.split(' ');
        const correctWords = correctAnswer.split(' ');
        const matchCount = correctWords.filter(word => userWords.includes(word)).length;

        // Consider correct if most key words match
        return matchCount >= Math.ceil(correctWords.length * 0.7);
    }

    skipQuestion() {
        this.stopTimer();
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.skippedAnswers++;

        this.showFeedback('⏭️', 'Dilewati', `Jawaban: ${question.jawaban}`, false);
        this.playSound('skip');

        setTimeout(() => this.nextQuestion(), 2000);
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        // Reset hint text displays
        const hintText = document.getElementById('hintText');
        const secondHintText = document.getElementById('secondHintText');

        if (hintText) hintText.classList.remove('show');
        if (secondHintText) secondHintText.classList.remove('show');

        this.loadQuestion();
        this.startTimer();
    }

    endGame() {
        this.stopTimer();
        const totalQuestions = this.currentQuestions.length;
        const percentage = Math.round((this.correctAnswers / totalQuestions) * 100);

        // Update high score
        const currentHighScore = parseInt(localStorage.getItem('tebakGambarHighScore') || 0);
        if (this.score > currentHighScore) {
            localStorage.setItem('tebakGambarHighScore', this.score);
            this.updateStats();
        }

        // Show results
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('wrongAnswers').textContent = this.wrongAnswers;
        document.getElementById('skippedAnswers').textContent = this.skippedAnswers;

        // Result message based on performance
        let resultTitle, resultIcon, resultMessage;

        if (percentage >= 90) {
            resultTitle = 'Luar Biasa! 🏆';
            resultIcon = '🎉';
            resultMessage = 'Kamu adalah master tebak gambar! Skor sempurna!';
        } else if (percentage >= 70) {
            resultTitle = 'Bagus Sekali! 🌟';
            resultIcon = '👏';
            resultMessage = 'Prestasi yang mengesankan! Kamu sangat pintar!';
        } else if (percentage >= 50) {
            resultTitle = 'Tidak Buruk! 👍';
            resultIcon = '😊';
            resultMessage = 'Lumayan bagus! Terus berlatih untuk hasil yang lebih baik!';
        } else {
            resultTitle = 'Semangat! 💪';
            resultIcon = '🤔';
            resultMessage = 'Jangan menyerah! Coba lagi dan kamu pasti bisa lebih baik!';
        }

        document.getElementById('resultTitle').textContent = resultTitle;
        document.getElementById('resultIcon').textContent = resultIcon;
        document.getElementById('resultMessage').textContent = resultMessage;

        this.showResult();
        this.playSound('gameEnd');
    }

    showFeedback(icon, text, answer, isCorrect) {
        const feedback = document.getElementById('feedback');
        const feedbackIcon = document.getElementById('feedbackIcon');
        const feedbackText = document.getElementById('feedbackText');
        const feedbackAnswer = document.getElementById('feedbackAnswer');

        feedbackIcon.textContent = icon;
        feedbackText.textContent = text;
        feedbackAnswer.textContent = answer;

        feedback.className = 'feedback show';
        if (!isCorrect) {
            feedback.classList.add('error');
        }

        setTimeout(() => {
            feedback.classList.remove('show', 'error');
        }, 1800);
    }

    playSound(type) {
        if (!this.gameSettings.soundEnabled) return;

        // Create audio context for simple sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const frequencies = {
            correct: [523, 659, 784], // C, E, G
            wrong: [330, 294], // E, D
            hint: [440], // A
            skip: [392], // G
            gameEnd: [523, 659, 784, 1047] // C, E, G, C
        };

        const freq = frequencies[type] || [440];

        freq.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 100);
        });
    }

    updateScore() {
        const scoreElement = document.getElementById('scoreValue');
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }

        // Update high score in real-time if current score is higher
        const currentHighScore = parseInt(localStorage.getItem('tebakGambarHighScore') || 0);
        if (this.score > currentHighScore) {
            localStorage.setItem('tebakGambarHighScore', this.score);
            const highScoreElement = document.getElementById('highScoreDisplay');
            if (highScoreElement) {
                highScoreElement.textContent = this.score;
            }
        }
    }

    // UI Navigation Methods

    showGameArea() {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('gameArea').classList.add('active');
        document.body.classList.add('in-game');
    }

    showMainMenu() {
        // Stop timer when returning to main menu
        this.stopTimer();

        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('gameArea').classList.remove('active');
        document.getElementById('resultModal').classList.remove('active');
        document.body.classList.remove('in-game');

        // Update stats when returning to main menu
        this.updateStats();
    }

    saveSettingsAndClose() {
        this.saveSettings();
        this.hideSettings();
        this.showFeedback('💾', 'Data tersimpan otomatis!', 'Pengaturan telah disimpan dengan sukses', true);
    }

    resetToDefault() {
        this.gameSettings = {
            difficulty: 'all',
            questionsPerGame: 5,
            theme: 'dark',
            soundEnabled: true,
            backgroundType: 'random',
            selectedBackground: 0,
            hintLimit: '5',
            secondHintEnabled: true,
            secondHintLimit: '5'
        };

        // Apply settings to UI
        document.getElementById('difficultySelect').value = this.gameSettings.difficulty;
        document.getElementById('questionsPerGame').value = this.gameSettings.questionsPerGame;
        document.getElementById('soundToggle').checked = this.gameSettings.soundEnabled;
        document.getElementById('backgroundType').value = this.gameSettings.backgroundType;
        document.getElementById('backgroundSelect').value = this.gameSettings.selectedBackground;
        document.getElementById('hintLimit').value = this.gameSettings.hintLimit;
        document.getElementById('secondHintToggle').checked = this.gameSettings.secondHintEnabled; // Update new toggle
        document.getElementById('secondHintLimit').value = this.gameSettings.secondHintLimit; // Update second hint limit input

        // Update theme option buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.gameSettings.theme);
        });

        this.saveSettings();
        this.updateTheme();
        this.updateBackground();
        this.showFeedback('🔄', 'Data dikembalikan ke default!', 'Semua pengaturan telah direset', true);
    }

    showSettings() {
        document.getElementById('settingsPanel').classList.add('active');
    }

    hideSettings() {
        document.getElementById('settingsPanel').classList.remove('active');
    }

    showHelp() {
        document.getElementById('helpModal').classList.add('active');
    }

    hideHelp() {
        document.getElementById('helpModal').classList.remove('active');
    }

    showAbout() {
        document.getElementById('aboutModal').classList.add('active');
    }

    hideAbout() {
        document.getElementById('aboutModal').classList.remove('active');
    }

    showDeveloper() {
        document.getElementById('developerModal').classList.add('active');
    }

    hideDeveloper() {
        document.getElementById('developerModal').classList.remove('active');
    }

    showResult() {
        document.getElementById('resultModal').classList.add('active');
    }

    setupExitConfirmation() {
        const exitModal = document.getElementById('exitModal');
        const confirmExitBtn = document.getElementById('confirmExitBtn');
        const cancelExitBtn = document.getElementById('cancelExitBtn');

        if (confirmExitBtn) {
            confirmExitBtn.addEventListener('click', () => {
                this.stopTimer();
                this.showMainMenu();
                exitModal.classList.remove('active');
            });
        }

        if (cancelExitBtn) {
            cancelExitBtn.addEventListener('click', () => {
                exitModal.classList.remove('active');
            });
        }

        // Close modal if clicking outside
        if (exitModal) {
            exitModal.addEventListener('click', (e) => {
                if (e.target === exitModal) {
                    exitModal.classList.remove('active');
                }
            });
        }
    }

    showExitConfirmation() {
        const currentQuestion = this.currentQuestionIndex + 1;
        const currentScore = this.score;

        // Update exit modal stats
        const exitCurrentQuestion = document.getElementById('exitCurrentQuestion');
        const exitCurrentScore = document.getElementById('exitCurrentScore');

        if (exitCurrentQuestion) exitCurrentQuestion.textContent = currentQuestion;
        if (exitCurrentScore) exitCurrentScore.textContent = currentScore;

        const exitModal = document.getElementById('exitModal');
        if (exitModal) {
            exitModal.classList.add('active');
        }
    }

    showError(message) {
        alert(message); // Simple error handling, could be improved with custom modal
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    showUptime() {
        document.getElementById('uptimeModal').classList.add('active');
        this.loadUptimeStats();
    }

    hideUptime() {
        document.getElementById('uptimeModal').classList.remove('active');
    }

    loadUptimeStats() {
        const startTime = Date.now();

        // Calculate uptime
        this.updateUptime();

        // Get browser and device info
        this.getBrowserInfo();
        this.getDeviceInfo();
        this.getConnectionInfo();

        // Get performance metrics
        this.getPerformanceMetrics();

        // Calculate load speed
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        document.getElementById('loadSpeed').textContent = `${loadTime}ms`;

        // Simulate server stats
        this.simulateServerStats();

        // Update last check time
        this.updateLastCheck();

        // Set interval to update uptime every second
        if (this.uptimeInterval) {
            clearInterval(this.uptimeInterval);
        }
        this.uptimeInterval = setInterval(() => {
            this.updateUptime();
            this.updateLastCheck();
        }, 1000);
    }

    updateUptime() {
        const now = Date.now();
        const uptime = now - (this.serverStartTime || now);

        const seconds = Math.floor(uptime / 1000) % 60;
        const minutes = Math.floor(uptime / (1000 * 60)) % 60;
        const hours = Math.floor(uptime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        let uptimeString = '';
        if (days > 0) uptimeString += `${days}d `;
        if (hours > 0) uptimeString += `${hours}h `;
        if (minutes > 0) uptimeString += `${minutes}m `;
        uptimeString += `${seconds}s`;

        document.getElementById('uptimeValue').textContent = uptimeString;
        document.getElementById('uptimeDetail').textContent = `Online since session start`;
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = '';

        if (userAgent.indexOf('Chrome') > -1) {
            browserName = 'Chrome';
            browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.indexOf('Safari') > -1) {
            browserName = 'Safari';
            browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
        } else if (userAgent.indexOf('Edge') > -1) {
            browserName = 'Edge';
            browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || '';
        }

        document.getElementById('browserInfo').textContent = `${browserName} ${browserVersion}`;
        document.getElementById('userAgent').textContent = userAgent.slice(0, 50) + '...';
    }

    getDeviceInfo() {
        const platform = navigator.platform;
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const colorDepth = screen.colorDepth;

        let deviceType = 'Desktop';
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            deviceType = 'Mobile';
        } else if (/iPad/i.test(navigator.userAgent)) {
            deviceType = 'Tablet';
        }

        document.getElementById('deviceInfo').textContent = `${deviceType} (${platform})`;
        document.getElementById('screenInfo').textContent = `${screenWidth}x${screenHeight} (${colorDepth}-bit)`;
    }

    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const type = connection.effectiveType || connection.type || 'Unknown';
            const downlink = connection.downlink ? `${connection.downlink} Mbps` : '';
            document.getElementById('connectionInfo').textContent = `${type.toUpperCase()} ${downlink}`.trim();
        } else {
            document.getElementById('connectionInfo').textContent = 'Unknown';
        }

        // Try to get IP (this won't work in most browsers due to privacy restrictions)
        document.getElementById('ipInfo').textContent = 'Protected by Browser';
        document.getElementById('protocolInfo').textContent = location.protocol.toUpperCase().replace(':', '');
        document.getElementById('portInfo').textContent = location.port || '80';
    }

    getPerformanceMetrics() {
        if (performance.timing) {
            const timing = performance.timing;
            const responseTime = timing.responseEnd - timing.requestStart;

            document.getElementById('responseTime').textContent = `${responseTime}ms`;

            // Update response status based on time
            const responseStatus = document.getElementById('responseStatus');
            const responseFill = document.getElementById('responseFill');

            if (responseTime < 100) {
                responseStatus.textContent = 'Excellent';
                responseStatus.className = 'metric-status good';
                responseFill.style.width = '95%';
            } else if (responseTime < 300) {
                responseStatus.textContent = 'Good';
                responseStatus.className = 'metric-status good';
                responseFill.style.width = '80%';
            } else if (responseTime < 1000) {
                responseStatus.textContent = 'Fair';
                responseStatus.className = 'metric-status warning';
                responseFill.style.width = '60%';
            } else {
                responseStatus.textContent = 'Slow';
                responseStatus.className = 'metric-status error';
                responseFill.style.width = '30%';
            }
        }

        // Memory info (limited in browsers)
        if (performance.memory) {
            const memory = performance.memory;
            const used = (memory.usedJSHeapSize / 1048576).toFixed(1); // MB
            const total = (memory.totalJSHeapSize / 1048576).toFixed(1); // MB

            document.getElementById('memoryUsage').textContent = `${used}/${total} MB`;
            document.getElementById('memoryDetail').textContent = `JS Heap usage`;

            const percentage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
            const memoryFill = document.getElementById('memoryFill');
            const memoryStatus = document.getElementById('memoryStatus');

            memoryFill.style.width = `${percentage}%`;

            if (percentage < 70) {
                memoryStatus.textContent = 'Optimal';
                memoryStatus.className = 'metric-status good';
            } else if (percentage < 85) {
                memoryStatus.textContent = 'Moderate';
                memoryStatus.className = 'metric-status warning';
            } else {
                memoryStatus.textContent = 'High';
                memoryStatus.className = 'metric-status error';
            }
        } else {
            document.getElementById('memoryUsage').textContent = 'N/A';
            document.getElementById('memoryDetail').textContent = 'Not available';
        }
    }

    simulateServerStats() {
        // Simulate CPU usage (random but realistic)
        const cpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%
        document.getElementById('cpuUsage').textContent = `${cpuUsage}%`;
        document.getElementById('cpuDetail').textContent = 'Estimated usage';

        // Fetch total RAM and used RAM
        // In a browser environment, we cannot access physical hardware directly.
        // We can only rely on navigator.deviceMemory which is a *hint* and not precise.
        const totalRam = navigator.deviceMemory || 'Unknown';
        // Simulate used RAM based on a fraction of total or a fixed value if total is unknown
        let usedRam = 'N/A';
        if (totalRam !== 'Unknown') {
            // Simulate used RAM to be around 20-50% of total for demonstration
            const ramPercentage = Math.random() * 0.3 + 0.2; // 20% to 50%
            usedRam = (totalRam * ramPercentage).toFixed(1);
        }

        document.getElementById('totalRam').textContent = `${totalRam} GB`;
        document.getElementById('usedRam').textContent = `${usedRam} GB`;
        document.getElementById('ramDetail').textContent = 'Device Memory Approximation';

        // Set language and framework info
        document.getElementById('languageInfo').textContent = 'JavaScript ES6+';
        document.getElementById('frameworkInfo').textContent = 'Vanilla JS + CSS3';
        document.getElementById('engineInfo').textContent = 'V8 Engine';
        document.getElementById('buildInfo').textContent = 'Development Mode';
    }

    updateLastCheck() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID');
        document.getElementById('lastCheck').textContent = timeString;
    }

    refreshUptimeStats() {
        // Show loading feedback
        this.showFeedback('🔄', 'Refreshing...', 'Memperbarui data server', true);

        // Add loading state
        document.getElementById('refreshStats').textContent = '🔄 Refreshing...';
        document.getElementById('refreshStats').disabled = true;

        setTimeout(() => {
            this.loadUptimeStats();
            document.getElementById('refreshStats').textContent = '🔄 Refresh Data';
            document.getElementById('refreshStats').disabled = false;
            this.showFeedback('✅', 'Updated!', 'Data server berhasil diperbarui', true);
        }, 1500);
    }

    async refreshBackgrounds() {
        this.showFeedback('🖼️', 'Memuat ulang...', 'Mendeteksi gambar background', true);
        await this.loadLocalBackgrounds();
        this.updateBackground();
        this.showFeedback('✅', 'Background Diperbarui!', `${this.animeBackgrounds.length} gambar tersedia`, true);
    }

    testConnection() {
        const startTime = Date.now();

        // Show testing feedback
        this.showFeedback('🧪', 'Testing...', 'Menguji koneksi server', true);

        // Add testing state
        document.getElementById('testConnection').textContent = '🧪 Testing...';
        document.getElementById('testConnection').disabled = true;

        // Simulate connection test
        fetch(window.location.href)
            .then(response => {
                const endTime = Date.now();
                const latency = endTime - startTime;

                document.getElementById('testConnection').textContent = '🧪 Test Connection';
                document.getElementById('testConnection').disabled = false;

                if (response.ok) {
                    this.showFeedback('✅', 'Connection OK!', `Latency: ${latency}ms`, true);
                    document.getElementById('healthStatus').textContent = `All Systems Operational (${latency}ms)`;
                } else {
                    this.showFeedback('⚠️', 'Connection Issues', 'Response tidak optimal', false);
                    document.getElementById('healthStatus').textContent = 'Some Issues Detected';
                }
            })
            .catch(error => {
                document.getElementById('testConnection').textContent = '🧪 Test Connection';
                document.getElementById('testConnection').disabled = false;

                this.showFeedback('❌', 'Connection Failed', error.message, false);
                document.getElementById('healthStatus').textContent = 'Connection Error';
            });
    }



    updateClock() {
        const now = new Date();

        // Format tanggal dalam bahasa Indonesia
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const dayName = days[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        // Format waktu
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Update tampilan dengan null checks
        const dateElement = document.getElementById('footerDate');
        const timeElement = document.getElementById('footerTime');

        if (dateElement) {
            dateElement.textContent = `${dayName}, ${day} ${month} ${year}`;
        }
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds} WIB`;
        }
    }

    // Website Settings Methods
    loadWebsiteSettings() {
        if (typeof websiteSettings !== 'undefined') {
            const websiteName = document.getElementById('websiteName');
            const websiteIcon = document.getElementById('websiteIcon');

            if (websiteName) {
                websiteName.value = websiteSettings.siteName;
            }
            if (websiteIcon) {
                websiteIcon.value = websiteSettings.siteIcon;
            }

            console.log('Website settings loaded to inputs');
        }
    }

    saveWebsiteSettings() {
        if (typeof websiteSettings !== 'undefined') {
            const websiteName = document.getElementById('websiteName');
            const websiteIcon = document.getElementById('websiteIcon');

            if (websiteName && websiteName.value.trim()) {
                websiteSettings.siteName = websiteName.value.trim();
            }
            if (websiteIcon && websiteIcon.value.trim()) {
                websiteSettings.siteIcon = websiteIcon.value.trim();
            }

            websiteSettings.save();
            this.showFeedback('💾', 'Berhasil Disimpan!', 'Pengaturan website telah diperbarui', true);
        } else {
            this.showFeedback('❌', 'Error!', 'settings.js tidak ditemukan', false);
        }
    }

    resetWebsiteSettings() {
        if (typeof websiteSettings !== 'undefined') {
            websiteSettings.reset();

            // Update input fields
            const websiteName = document.getElementById('websiteName');
            const websiteIcon = document.getElementById('websiteIcon');

            if (websiteName) {
                websiteName.value = websiteSettings.siteName;
            }
            if (websiteIcon) {
                websiteIcon.value = websiteSettings.siteIcon;
            }

            this.showFeedback('🔄', 'Reset Berhasil!', 'Pengaturan website dikembalikan ke default', true);
        } else {
            this.showFeedback('❌', 'Error!', 'settings.js tidak ditemukan', false);
        }
    }

    // Music Player Methods
    initMusicPlayer() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicToggle = document.getElementById('musicToggle');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.musicProgress = document.getElementById('musicProgress');
        this.progressTrack = document.getElementById('progressTrack');
        this.currentTimeElement = document.getElementById('currentTime');
        this.totalTimeElement = document.getElementById('totalTime');
        this.musicStatus = document.getElementById('musicStatus');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumePercent = document.getElementById('volumePercent');

        if (!this.backgroundMusic || !this.musicToggle) return;

        // Set initial volume and load first song
        this.backgroundMusic.volume = 0.5;
        this.loadCurrentSong();

        // Enhanced time update with better accuracy
        this.backgroundMusic.addEventListener('timeupdate', () => {
            this.updateMusicProgress();
        });

        // Initialize scrolling text
        this.initScrollingText();

        // Handle metadata loaded (duration available)
        this.backgroundMusic.addEventListener('loadedmetadata', () => {
            if (this.totalTimeElement && this.backgroundMusic.duration) {
                this.totalTimeElement.textContent = this.formatMusicTime(this.backgroundMusic.duration);
            }
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Ready';
                this.musicStatus.style.background = '#22c55e';
            }
        });

        // Handle loading start
        this.backgroundMusic.addEventListener('loadstart', () => {
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Loading';
                this.musicStatus.style.background = '#f59e0b';
            }
        });

        // Handle can play
        this.backgroundMusic.addEventListener('canplaythrough', () => {
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Ready';
                this.musicStatus.style.background = '#22c55e';
            }
        });

        // Handle music end
        this.backgroundMusic.addEventListener('ended', () => {
            this.nextSong();
        });

        // Handle loading errors
        this.backgroundMusic.addEventListener('error', (e) => {
            console.warn('Music loading failed:', e);
            this.musicToggle.disabled = true;
            this.musicToggle.querySelector('.music-icon').textContent = '❌';
            this.musicToggle.title = 'Music not available';
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Error';
                this.musicStatus.style.background = '#ef4444';
            }
        });

        // Handle audio buffer events
        this.backgroundMusic.addEventListener('waiting', () => {
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Buffering';
                this.musicStatus.style.background = '#f59e0b';
            }
        });

        this.backgroundMusic.addEventListener('playing', () => {
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Playing';
                this.musicStatus.style.background = '#10b981';
            }
        });

        this.backgroundMusic.addEventListener('pause', () => {
            if (this.musicStatus) {
                this.musicStatus.textContent = 'Paused';
                this.musicStatus.style.background = '#64748b';
            }
        });

        // Click on progress bar to seek
        if (this.progressTrack) {
            this.progressTrack.addEventListener('click', (e) => {
                if (this.backgroundMusic.duration) {
                    const rect = this.progressTrack.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * this.backgroundMusic.duration;
                    this.backgroundMusic.currentTime = newTime;
                }
            });
        }

        // Volume icon click to mute/unmute
        if (this.volumeIcon) {
            this.volumeIcon.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        // Set initial button state
        this.musicToggle.querySelector('.music-icon').textContent = '▶️';
        this.musicToggle.title = 'Play Music';

        // Load saved music settings
        const savedVolume = localStorage.getItem('musicVolume') || 50;
        if (this.volumeSlider) {
            this.volumeSlider.value = savedVolume;
            this.backgroundMusic.volume = savedVolume / 100;
            this.updateVolumeDisplay(savedVolume);
        }

        // Preload audio for better performance
        this.backgroundMusic.preload = 'auto';

        const musicEnabled = localStorage.getItem('musicEnabled');
        if (musicEnabled === 'true') {
            // Auto-play only works after user interaction
            this.enableAutoPlay();
        }

        console.log('🎵 Enhanced music player initialized');
    }

    loadCurrentSong() {
        const currentSong = this.musicLibrary[this.currentSongIndex];
        this.backgroundMusic.src = currentSong.file;

        // Update UI with current song info
        const songTitle = document.getElementById('songTitle');
        const songArtist = document.getElementById('songArtist');

        if (songTitle) songTitle.textContent = currentSong.title;
        if (songArtist) songArtist.textContent = currentSong.artist;

        // Update modal info too
        const modalMusicTitle = document.getElementById('modalMusicTitle');
        const modalMusicArtist = document.getElementById('modalMusicArtist');

        if (modalMusicTitle) modalMusicTitle.textContent = currentSong.title;
        if (modalMusicArtist) modalMusicArtist.textContent = currentSong.artist;

        this.backgroundMusic.load();
        this.initScrollingText();
    }

    nextSong() {
        // Sequential next song
        this.currentSongIndex = (this.currentSongIndex + 1) % this.musicLibrary.length;
        console.log(`🔁 Sequential mode: Playing song ${this.currentSongIndex}`);

        this.loadCurrentSong();

        if (this.isPlaying) {
            this.backgroundMusic.play().catch(error => {
                console.warn('Auto-play next song failed:', error);
            });
        }

        const currentSong = this.musicLibrary[this.currentSongIndex];
        this.showFeedback('🎵', 'Lagu Berikutnya', `${currentSong.title} - ${currentSong.artist}`, true);
    }

    previousSong() {
        // Sequential previous song
        this.currentSongIndex = this.currentSongIndex === 0 ?
            this.musicLibrary.length - 1 : this.currentSongIndex - 1;
        console.log(`🔁 Sequential previous: Playing song ${this.currentSongIndex}`);

        this.loadCurrentSong();

        if (this.isPlaying) {
            this.backgroundMusic.play().catch(error => {
                console.warn('Auto-play previous song failed:', error);
            });
        }

        const currentSong = this.musicLibrary[this.currentSongIndex];
        this.showFeedback('🎵', 'Lagu Sebelumnya', `${currentSong.title} - ${currentSong.artist}`, true);
    }

    seekForward() {
        if (!this.backgroundMusic || !this.backgroundMusic.duration) return;

        const newTime = Math.min(
            this.backgroundMusic.currentTime + 3,
            this.backgroundMusic.duration
        );
        this.backgroundMusic.currentTime = newTime;
        this.showFeedback('⏩', 'Maju 3 Detik', this.formatMusicTime(newTime), true);
    }

    seekBackward() {
        if (!this.backgroundMusic) return;

        const newTime = Math.max(this.backgroundMusic.currentTime - 3, 0);
        this.backgroundMusic.currentTime = newTime;
        this.showFeedback('⏪', 'Mundur 3 Detik', this.formatMusicTime(newTime), true);
    }

    selectSong(index) {
        this.currentSongIndex = index;
        this.loadCurrentSong();

        if (this.isPlaying) {
            this.backgroundMusic.play().catch(error => {
                console.warn('Auto-play selected song failed:', error);
            });
        }

        const currentSong = this.musicLibrary[this.currentSongIndex];
        this.showFeedback('🎵', 'Lagu Dipilih', `${currentSong.title} - ${currentSong.artist}`, true);
        this.hidePlaylist();
    }

    showPlaylist() {
        document.getElementById('playlistModal').classList.add('active');
        this.updatePlaylistModal();
    }

    hidePlaylist() {
        document.getElementById('playlistModal').classList.remove('active');
    }

    updatePlaylistModal() {
        const playlistContainer = document.getElementById('playlistContainer');
        if (!playlistContainer) return;

        playlistContainer.innerHTML = '';

        this.musicLibrary.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = `playlist-item ${index === this.currentSongIndex ? 'active' : ''}`;
            songItem.innerHTML = `
                <div class="song-number">${index + 1}</div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-actions">
                    <button class="play-song-btn" onclick="game.selectSong(${index})">
                        ${index === this.currentSongIndex && this.isPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            `;

            playlistContainer.appendChild(songItem);
        });

        // Update total songs count
        const totalSongsSpan = document.getElementById('totalSongs');
        if (totalSongsSpan) {
            totalSongsSpan.textContent = this.musicLibrary.length;
        }
    }

    getCurrentSongDetails() {
        return this.musicLibrary[this.currentSongIndex];
    }

    formatMusicTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateMusicProgress() {
        if (this.backgroundMusic.duration && !isNaN(this.backgroundMusic.duration)) {
            const progress = (this.backgroundMusic.currentTime / this.backgroundMusic.duration) * 100;
            if (this.musicProgress) {
                this.musicProgress.style.width = `${Math.min(progress, 100)}%`;
            }

            // Update time display with better formatting
            if (this.currentTimeElement) {
                this.currentTimeElement.textContent = this.formatMusicTime(this.backgroundMusic.currentTime);
            }

            if (this.totalTimeElement && this.backgroundMusic.duration) {
                this.totalTimeElement.textContent = this.formatMusicTime(this.backgroundMusic.duration);
            }

            // Update modal progress too
            this.updateModalMusicProgress();
        }
    }

    initScrollingText() {
        // Function removed - no more scrolling text animation
        // Text will use ellipsis for overflow instead
    }

    updateVolumeDisplay(volume) {
        if (this.volumePercent) {
            this.volumePercent.textContent = `${volume}%`;
        }

        if (this.volumeIcon) {
            if (volume == 0) {
                this.volumeIcon.textContent = '🔇';
            } else if (volume < 30) {
                this.volumeIcon.textContent = '🔈';
            } else if (volume < 70) {
                this.volumeIcon.textContent = '🔉';
            } else {
                this.volumeIcon.textContent = '🔊';
            }
        }
    }

    toggleMute() {
        if (!this.backgroundMusic || !this.volumeSlider) return;

        if (this.backgroundMusic.volume > 0) {
            this.lastVolume = this.volumeSlider.value;
            this.backgroundMusic.volume = 0;
            this.volumeSlider.value = 0;
            this.updateVolumeDisplay(0);
            this.showFeedback('🔇', 'Musik Dibisukan', '', true);
        } else {
            const restoreVolume = this.lastVolume || 50;
            this.backgroundMusic.volume = restoreVolume / 100;
            this.volumeSlider.value = restoreVolume;
            this.updateVolumeDisplay(restoreVolume);
            this.showFeedback('🔊', 'Musik Aktif', `${restoreVolume}%`, true);
        }
    }

    enableAutoPlay() {
        // Auto-play musik setelah interaksi user pertama
        const enableMusicAfterInteraction = () => {
            if (!this.isPlaying) {
                this.toggleMusic();
            }
            // Remove listener after first interaction
            document.removeEventListener('click', enableMusicAfterInteraction);
            document.removeEventListener('keydown', enableMusicAfterInteraction);
        };

        document.addEventListener('click', enableMusicAfterInteraction);
        document.addEventListener('keydown', enableMusicAfterInteraction);
    }

    toggleMusic() {
        if (!this.backgroundMusic) return;

        try {
            if (this.isPlaying) {
                this.backgroundMusic.pause();
                this.musicToggle.classList.remove('playing');
                this.musicToggle.querySelector('.music-icon').textContent = '▶️';
                this.musicToggle.title = 'Play Music';
                this.isPlaying = false;
                localStorage.setItem('musicEnabled', 'false');
                this.updateModalPlayButton();
                this.showFeedback('⏸️', 'Musik Dijeda', '', true);
            } else {
                // Show loading state
                if (this.musicStatus) {
                    this.musicStatus.textContent = 'Loading';
                    this.musicStatus.style.background = '#f59e0b';
                }

                // Ensure audio is ready
                this.backgroundMusic.preload = 'auto';

                const playPromise = this.backgroundMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.musicToggle.classList.add('playing');
                        this.musicToggle.querySelector('.music-icon').textContent = '⏸️';
                        this.musicToggle.title = 'Pause Music';
                        this.isPlaying = true;
                        localStorage.setItem('musicEnabled', 'true');
                        this.updateModalPlayButton();
                        this.showFeedback('🎵', 'Musik Berhasil Diputar', 'YOASOBI - Love Letter', true);

                        // Set proper volume and start progress updates
                        this.backgroundMusic.volume = this.volumeSlider ? this.volumeSlider.value / 100 : 0.5;

                        // Force update progress immediately
                        this.updateMusicProgress();

                        // Check scrolling text
                        this.initScrollingText();

                    }).catch(error => {
                        console.warn('Music play failed:', error);
                        this.showFeedback('🔇', 'Gagal Memutar Musik', 'Coba klik tombol play lagi', false);

                        if (this.musicStatus) {
                            this.musicStatus.textContent = 'Error';
                            this.musicStatus.style.background = '#ef4444';
                        }

                        // Reset button state
                        this.musicToggle.classList.remove('playing');
                        this.musicToggle.querySelector('.music-icon').textContent = '▶️';
                        this.isPlaying = false;
                    });
                }
            }
        } catch (error) {
            console.error('Music toggle error:', error);
            this.showFeedback('❌', 'Error Audio', 'Terjadi kesalahan sistem audio', false);
        }
    }

    setVolume(value) {
        if (!this.backgroundMusic) return;

        const volume = value / 100;
        this.backgroundMusic.volume = volume;
        localStorage.setItem('musicVolume', value);

        // Visual feedback for volume change
        if (volume === 0) {
            this.showFeedback('🔇', 'Suara Dimatikan', '', true);
        } else if (volume > 0.7) {
            this.showFeedback('🔊', 'Volume Tinggi', `${value}%`, true);
        } else {
            this.showFeedback('🔉', 'Volume Sedang', `${value}%`, true);
        }
    }

    showMusicPlayer() {
        const musicStatus = this.isPlaying ? 'sedang diputar' : 'dijeda';
        const currentTime = this.backgroundMusic ? this.formatMusicTime(this.backgroundMusic.currentTime) : '0:00';
        const totalTime = this.backgroundMusic ? this.formatMusicTime(this.backgroundMusic.duration || 0) : '0:00';
        const volume = this.volumeSlider ? this.volumeSlider.value : 50;

        this.showFeedback(
            '🎵',
            'Pemutar Musik',
            `Status: ${musicStatus} | Waktu: ${currentTime}/${totalTime} | Volume: ${volume}%`,
            true
        );

        // Auto toggle music if not playing
        if (!this.isPlaying) {
            setTimeout(() => {
                this.toggleMusic();
            }, 1500);
        }
    }

    showMusicPlayerModal() {
        document.getElementById('musicPlayerModal').classList.add('active');
        this.updateMusicModal();
    }

    hideMusicPlayerModal() {
        document.getElementById('musicPlayerModal').classList.remove('active');
    }

    updateMusicModal() {
        // Update play/pause button
        this.updateModalPlayButton();

        // Update volume
        const modalVolumeSlider = document.getElementById('modalVolumeSlider');
        if (modalVolumeSlider && this.volumeSlider) {
            modalVolumeSlider.value = this.volumeSlider.value;
            this.updateModalVolumeDisplay(this.volumeSlider.value);
        }

        // Update progress
        this.updateModalMusicProgress();
    }

    updateModalPlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const playFullscreenBtn = document.getElementById('playFullscreenBtn');

        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
            playPauseBtn.title = this.isPlaying ? 'Pause Music' : 'Play Music';
        }

        if (playFullscreenBtn) {
            playFullscreenBtn.innerHTML = this.isPlaying ?
                '<span class="btn-icon">⏸️</span> Jeda Musik' :
                '<span class="btn-icon">🎵</span> Putar Musik';
        }
    }

    updateModalVolumeDisplay(volume) {
        const modalVolumePercent = document.getElementById('modalVolumePercent');
        const modalVolumeIcon = document.getElementById('modalVolumeIcon');

        if (modalVolumePercent) {
            modalVolumePercent.textContent = `${volume}%`;
        }

        if (modalVolumeIcon) {
            if (volume == 0) {
                modalVolumeIcon.textContent = '🔇';
            } else if (volume < 30) {
                modalVolumeIcon.textContent = '🔈';
            } else if (volume < 70) {
                modalVolumeIcon.textContent = '🔉';
            } else {
                modalVolumeIcon.textContent = '🔊';
            }
        }

        // Also update main volume display
        this.updateVolumeDisplay(volume);
    }

    updateModalMusicProgress() {
        if (this.backgroundMusic && this.backgroundMusic.duration && !isNaN(this.backgroundMusic.duration)) {
            const progress = (this.backgroundMusic.currentTime / this.backgroundMusic.duration) * 100;

            // Update modal progress
            const modalMusicProgress = document.getElementById('modalMusicProgress');
            if (modalMusicProgress) {
                modalMusicProgress.style.width = `${Math.min(progress, 100)}%`;
            }

            // Update modal time display
            const modalCurrentTime = document.getElementById('modalCurrentTime');
            const modalTotalTime = document.getElementById('modalTotalTime');

            if (modalCurrentTime) {
                modalCurrentTime.textContent = this.formatMusicTime(this.backgroundMusic.currentTime);
            }

            if (modalTotalTime && this.backgroundMusic.duration) {
                modalTotalTime.textContent = this.formatMusicTime(this.backgroundMusic.duration);
            }
        }
    }

    showSongDetails() {
        document.getElementById('songDetailsModal').classList.add('active');
        this.updateSongDetailsModal();
    }

    hideSongDetails() {
        document.getElementById('songDetailsModal').classList.remove('active');
    }

    updateSongDetailsModal() {
        const currentSong = this.getCurrentSongDetails();
        const details = currentSong.details;

        // Update basic info
        document.getElementById('detailSongTitle').textContent = details.judul;
        document.getElementById('detailSongArtist').textContent = details.artis;

        // Update detailed information with new structure
        document.getElementById('detailRilisDigital').textContent = details.rilisDigital || details.rilis;
        document.getElementById('detailRilisCD').textContent = details.rilisCD || details.album;
        document.getElementById('detailAnime').textContent = details.anime || '🎌 Tidak terkait dengan anime';
        document.getElementById('detailInspirasi').textContent = details.inspirasi || '💡 Karya original';
        document.getElementById('detailMv').textContent = details.mv || '🎬 Official Music Video';
        document.getElementById('detailViews').textContent = details.views || '👀 Jutaan views';
        document.getElementById('detailPenghargaan').textContent = details.penghargaan || details.chart;
        document.getElementById('detailDurasi').textContent = details.durasi;
        document.getElementById('detailKey').textContent = details.key;
        document.getElementById('detailBpm').textContent = details.bpm;
        document.getElementById('detailGenre').textContent = details.genre;

        // Optional fields
        if (details.kolaborator) {
            document.getElementById('detailKolaborator').textContent = details.kolaborator;
            document.getElementById('detailKolaboratorRow').style.display = 'table-row';
        } else {
            document.getElementById('detailKolaboratorRow').style.display = 'none';
        }

        if (details.versiInggris) {
            document.getElementById('detailVersiInggris').textContent = details.versiInggris;
            document.getElementById('detailVersiInggrisRow').style.display = 'table-row';
        } else {
            document.getElementById('detailVersiInggrisRow').style.display = 'none';
        }
    }
}

// Global game variable
let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game = new TebakGambarGame();

    // Auto-update theme every hour for auto mode
    setInterval(() => {
        if (game.gameSettings.theme === 'auto') {
            game.updateTheme();
        }
    }, 3600000); // 1 hour
});