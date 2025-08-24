
// Website Settings Configuration
const websiteSettings = {
    // Website Title/Name
    siteName: "Tebak Gambar",
    
    // Website Icon/Favicon
    siteIcon: "https://i.postimg.cc/jd2DDHJR/b306e87340b6ec34db1828deb534208b.jpg",
    
    // Apply settings to website
    apply: function() {
        // Update page title
        document.title = this.siteName;
        
        // Update favicon
        this.updateFavicon();
        
        // Update header title if exists
        const headerTitle = document.querySelector('.logo');
        if (headerTitle) {
            headerTitle.innerHTML = `🎯 ${this.siteName}`;
        }
        
        // Update game logo in main menu
        const gameLogoTitle = document.querySelector('.game-logo h2');
        if (gameLogoTitle) {
            gameLogoTitle.textContent = this.siteName;
        }
        
        // Update any other title elements
        const aboutTitle = document.querySelector('#aboutModal .about-section h4');
        if (aboutTitle && aboutTitle.textContent.includes('Tebak Gambar')) {
            aboutTitle.textContent = this.siteName;
        }
        
        console.log('Website settings applied:', {
            siteName: this.siteName,
            siteIcon: this.siteIcon
        });
    },
    
    // Update favicon
    updateFavicon: function() {
        // Remove existing favicon
        const existingFavicon = document.querySelector('link[rel="icon"]') || 
                              document.querySelector('link[rel="shortcut icon"]');
        if (existingFavicon) {
            existingFavicon.remove();
        }
        
        // Add new favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = this.siteIcon;
        document.head.appendChild(favicon);
        
        // Also add shortcut icon for better compatibility
        const shortcutIcon = document.createElement('link');
        shortcutIcon.rel = 'shortcut icon';
        shortcutIcon.href = this.siteIcon;
        document.head.appendChild(shortcutIcon);
    },
    
    // Save settings to localStorage
    save: function() {
        localStorage.setItem('websiteSettings', JSON.stringify({
            siteName: this.siteName,
            siteIcon: this.siteIcon
        }));
        this.apply();
    },
    
    // Load settings from localStorage
    load: function() {
        const saved = localStorage.getItem('websiteSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.siteName = settings.siteName || this.siteName;
                this.siteIcon = settings.siteIcon || this.siteIcon;
            } catch (error) {
                console.warn('Failed to load website settings:', error);
            }
        }
        this.apply();
    },
    
    // Reset to default settings
    reset: function() {
        this.siteName = "Tebak Gambar - Game Seru";
        this.siteIcon = "https://i.postimg.cc/jd2DDHJR/b306e87340b6ec34db1828deb534208b.jpg";
        this.save();
    }
};

// Auto-load settings when script loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => websiteSettings.load());
    } else {
        websiteSettings.load();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = websiteSettings;
}
