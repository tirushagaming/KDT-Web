/**
 * NEXUS GAMES - CORE ENGINE
 * TABLE OF CONTENTS:
 * 1. Data Store (LocalStorage Interface)
 * 2. UI Rendering Components
 * 3. Admin Logic
 * 4. Integration Instructions (Comments)
 */

class Store {
    constructor() {
        this.initData();
    }

    initData() {
        const defaultGames = [
            {
                id: Date.now(),
                title: "Cyberpunk 2077: Phantom Liberty",
                category: "RPG",
                size: "70 GB",
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1605898835373-02f74bc99e59?auto=format&fit=crop&q=80&w=500",
                description: "A spy-thriller expansion for the open-world RPG.",
                links: { mirror1: "https://drive.google.com/..." },
                requirements: "i7-12700K, 16GB RAM, RTX 3080",
                isTrending: true
            },
            {
                id: Date.now() + 1,
                title: "Elden Ring",
                category: "Fantasy",
                size: "60 GB",
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80&w=500",
                description: "Rise, Tarnished, and be guided by grace to brandish the power.",
                links: { mirror1: "#" },
                requirements: "i5-8400, 12GB RAM, GTX 1060",
                isTrending: false
            }
        ];

        if (!localStorage.getItem('nexus_games')) {
            localStorage.setItem('nexus_games', JSON.stringify(defaultGames));
        }

        this.categories = [
            "All", "Mystery", "Action", "Fantasy", "Adventure", "SCI-Fi",
            "Indie", "RPG", "Arcade", "Survival", "Fighting", "Horror",
            "Racing", "Shooting", "Simulation", "Sports", "Strategy"
        ];
    }

    getGames() {
        return JSON.parse(localStorage.getItem('nexus_games'));
    }

    saveGame(game) {
        const games = this.getGames();
        if (game.id) {
            const idx = games.findIndex(g => g.id === game.id);
            games[idx] = game;
        } else {
            game.id = Date.now();
            games.push(game);
        }
        localStorage.setItem('nexus_games', JSON.stringify(games));
    }

    deleteGame(id) {
        const games = this.getGames().filter(g => g.id !== id);
        localStorage.setItem('nexus_games', JSON.stringify(games));
    }
}

class NexusApp {
    constructor() {
        this.store = new Store();
        this.currentCategory = "All";
        this.isAdmin = false;
        this.init();
    }

    init() {
        this.navigate('home');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            document.body.dataset.theme = theme;
        });
    }

    // --- VIEW ROUTING ---
    navigate(view, data = null) {
        const main = document.getElementById('main-content');
        window.scrollTo(0, 0);

        if (view === 'home') {
            main.innerHTML = `
                        <section class="hero">
                            <div style="max-width: 600px;">
                                <h1 style="font-size: 3rem; margin-bottom: 20px; color: #fff;">UNLEASH YOUR GAMING POTENTIAL</h1>
                                <p style="margin-bottom: 30px; font-size: 1.1rem; opacity: 0.9;">Download thousands of premium PC games for free. High-speed mirrors, verified files, and one-click installs.</p>
                                <button class="btn btn-primary" onclick="app.handleSearch('Action')">Explore Library</button>
                            </div>
                        </section>
                        
                        <div class="category-scroll">
                            ${this.store.categories.map(cat => `
                                <div class="cat-tag ${this.currentCategory === cat ? 'active' : ''}" 
                                     onclick="app.filterCat('${cat}')">${cat}</div>
                            `).join('')}
                        </div>

                        <h2 style="padding: 20px 5%; color: var(--primary);">Popular Downloads</h2>
                        <div class="grid-container" id="game-grid">
                            ${this.renderGameCards(this.store.getGames())}
                        </div>
                    `;
        } else if (view === 'game-detail') {
            this.renderGameDetail(data);
        }
    }

    renderGameCards(games) {
        if (games.length === 0) return `<p style="padding: 20px;">No games found in this category.</p>`;
        return games.map(game => `
                    <div class="game-card">
                        <img src="${game.image}" class="card-img" alt="${game.title}" loading="lazy">
                        <div class="card-body">
                            <div class="card-meta">
                                <span><i class="fas fa-folder"></i> ${game.category}</span>
                                <span><i class="fas fa-star"></i> ${game.rating}</span>
                            </div>
                            <h3 style="margin-bottom: 10px; font-size: 1.1rem;">${game.title}</h3>
                            <p style="font-size: 0.85rem; opacity: 0.7; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${game.description}
                            </p>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size: 0.8rem; font-weight: bold;">${game.size}</span>
                                <button class="btn btn-primary" onclick="app.navigate('game-detail', ${game.id})">Details</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    renderGameDetail(id) {
        const game = this.store.getGames().find(g => g.id === id);
        const main = document.getElementById('main-content');
        main.innerHTML = `
                    <div style="padding: 40px 5%; max-width: 1200px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 40px;">
                            <img src="${game.image}" style="width: 100%; border-radius: 15px; box-shadow: var(--accent-glow);">
                            <div>
                                <h1 style="font-size: 2.5rem; color: var(--primary);">${game.title}</h1>
                                <p style="margin: 20px 0; line-height: 1.8;">${game.description}</p>
                                
                                <div style="background: var(--card-bg); padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                                    <h3>System Requirements</h3>
                                    <p style="margin-top: 10px; opacity: 0.8;">${game.requirements}</p>
                                </div>

                                <div style="display:flex; gap: 20px;">
                                    <a href="${Object.values(game.links)[0]}" class="btn btn-primary" style="padding: 15px 40px;">
                                        <i class="fas fa-download"></i> DOWNLOAD NOW (${game.size})
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }

    // --- SEARCH & FILTER ---
    handleSearch(query) {
        const games = this.store.getGames().filter(g =>
            g.title.toLowerCase().includes(query.toLowerCase()) ||
            g.category.toLowerCase().includes(query.toLowerCase())
        );
        const grid = document.getElementById('game-grid');
        if (grid) grid.innerHTML = this.renderGameCards(games);
    }

    filterCat(cat) {
        this.currentCategory = cat;
        const games = cat === "All" ? this.store.getGames() : this.store.getGames().filter(g => g.category === cat);
        this.navigate('home');
        document.getElementById('game-grid').innerHTML = this.renderGameCards(games);
    }

    // --- ADMIN LOGIC ---
    showLogin() {
        const pass = prompt("Enter Admin Password (Hint: admin):");
        if (pass === 'admin.tirusha') { // 1. HOW TO CHANGE ADMIN PASSWORD: Change this string
            this.isAdmin = true;
            this.showAdmin();
            this.notify("Welcome back, Commander.", "success");
        }
    }

    showAdmin() {
        document.getElementById('admin-panel').style.display = 'grid';
        this.showAdminSection('manage-games');
    }

    showAdminSection(section) {
        const area = document.getElementById('admin-view-area');
        if (section === 'add-game') {
            area.innerHTML = `
                        <h2>Add New PC Game</h2>
                        <form id="game-form" onsubmit="app.handleGameSubmit(event)" style="margin-top:20px;">
                            <div class="form-group">
                                <label>Game Title</label>
                                <input type="text" id="form-title" required>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                                <div class="form-group">
                                    <label>Category</label>
                                    <select id="form-category">
                                        ${this.store.categories.map(c => `<option>${c}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>File Size (e.g. 15 GB)</label>
                                    <input type="text" id="form-size" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Thumbnail URL (Firebase/Cloudinary Link)</label>
                                <input type="url" id="form-image" required>
                            </div>
                            <div class="form-group">
                                <label>Download Link (Google Drive / Mega)</label>
                                <input type="url" id="form-link" required>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="form-desc" rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label>System Requirements</label>
                                <textarea id="form-req" rows="2"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Publish Game to Live Site</button>
                        </form>
                    `;
        } else if (section === 'manage-games') {
            area.innerHTML = `
                        <h2>Inventory Management</h2>
                        <table style="width:100%; margin-top:20px; border-collapse: collapse;">
                            <thead>
                                <tr style="text-align:left; border-bottom: 2px solid var(--glass);">
                                    <th style="padding:10px;">Game</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.store.getGames().map(g => `
                                    <tr style="border-bottom: 1px solid var(--glass);">
                                        <td style="padding:10px;">${g.title}</td>
                                        <td>${g.category}</td>
                                        <td>
                                            <button onclick="app.store.deleteGame(${g.id}); app.showAdminSection('manage-games');" style="color:#ff4444; background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
        }
    }

    handleGameSubmit(e) {
        e.preventDefault();
        const newGame = {
            title: document.getElementById('form-title').value,
            category: document.getElementById('form-category').value,
            size: document.getElementById('form-size').value,
            image: document.getElementById('form-image').value,
            description: document.getElementById('form-desc').value,
            requirements: document.getElementById('form-req').value,
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            links: { mirror1: document.getElementById('form-link').value }
        };
        this.store.saveGame(newGame);
        this.notify("Game added successfully!", "success");
        this.showAdminSection('manage-games');
    }

    logoutAdmin() {
        this.isAdmin = false;
        document.getElementById('admin-panel').style.display = 'none';
        this.navigate('home');
    }

    notify(msg, type) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--primary)"></i> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

const app = new NexusApp();

/**
 * --- DOCUMENTATION & INTEGRATION GUIDES ---
 * * 3. HOW TO CONNECT FIREBASE STORAGE:
 * - Go to Firebase Console > Storage. 
 * - Upload your game zip. 
 * - Copy the "Download URL".
 * - Paste it into the "Download Link" field in the Admin Dashboard.
 * * 4. HOW TO CONNECT SUPABASE STORAGE:
 * - Create a Bucket in Supabase > Storage.
 * - Set Bucket to "Public".
 * - Upload file and copy the "Public URL".
 * * 5. HOW TO ADD NEW CATEGORIES:
 * - Go to the 'Store' class in this file.
 * - Edit the 'this.categories' array.
 * * 6. DEPLOYMENT INSTRUCTIONS:
 * - GITHUB PAGES: Push this file as 'index.html' to a repo, enable Pages in settings.
 * - NETLIFY/VERCEL: Drag and drop this file into the deployment window.
 * * 7. STORING LARGE FILES:
 * - Use Backblaze B2 + Cloudflare (Bandwidth Alliance) for $0 egress fees.
 * - Or use Google Drive (Direct Link Generator tools) for small indie games.
 * * 8. OPTIMIZATION:
 * - Compress thumbnails using TinyJPG before uploading to keep page load fast.
 */