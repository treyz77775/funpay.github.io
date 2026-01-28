const serversData = [
    { n: "DOWNTOWN", b: "SALAT PATAPON", link: "https://www.youtube.com/@SALATPATAPON", api: "downtown" },
    { n: "STRAWBERRY", b: "ШРЕДР", link: "https://www.youtube.com/@MortenShredr", api: "strawberry" },
    { n: "VINEWOOD", b: "СТИЛ", link: "https://www.youtube.com/@steelchik", api: "vinewood" },
    { n: "BLACKBERRY", b: "МОРФИК", link: "https://www.youtube.com/@Morffik", api: "blackberry" },
    { n: "INSUAD", b: "МАРМОК", link: "https://www.youtube.com/@MrMarmok", api: "insuad" },
    { n: "RAINBOW", b: "АРТИС", link: "https://www.youtube.com/@ARTISGTA5RP", api: "rainbow" },
    { n: "SUNRISE", b: "КОФИ", link: "https://www.youtube.com/@CoffiChannel", api: "sunrise" },
    { n: "RICHMAN", b: "ТОТ САМЫЙ", link: "https://www.youtube.com/@alex_gta5rp", api: "richman" },
    { n: "ECLIPSE", b: "Joe Speen", link: "https://www.youtube.com/watch?v=BefsWdBZNeQ", api: "eclipse" },
    { n: "LAMESA", b: "Guides", link: "https://www.youtube.com/@q-d", api: "lamesa" },
    { n: "BURTON", b: "BULBA PLAY", link: "https://www.youtube.com/@BULBAPLAY", api: "burton" },
    { n: "ROCKFORD", b: "SANDELUK", link: "https://www.youtube.com/@SANDELUK", api: "rockford" },
    { n: "ALTA", b: "ХОЛМА", link: "https://www.youtube.com/@HOMATAWER", api: "alta" },
    { n: "DEL PERRO", b: "ТЕДИ", link: "https://www.youtube.com/@Tedgta", api: "delperro" },
    { n: "DAVIS", b: "BIPBUP", link: "https://www.youtube.com/@BIPBUP", api: "davis" },
    { n: "HARMONY", b: "MARYUN", link: "https://www.youtube.com/@MARYUNGTA5RP", api: "harmony" },
    { n: "REDWOOD", b: "WILLY VANCE", link: "https://www.youtube.com/@WillyVance", api: "redwood" },
    { n: "HAWICK", b: "Advokatix", link: "https://www.youtube.com/@Advokatixc", api: "hawick" },
    { n: "GRAPESEED", b: "КОДАК", link: "https://www.youtube.com/@66kodak99", api: "grapeseed" },
    { n: "MURRIETA", b: "СУХОЙ", link: "https://www.youtube.com/@suhoyq", api: "murrieta" },
    { n: "VESPUCCI", b: "ТОМАС", link: "https://www.youtube.com/@TomasGTA5RP", api: "vespucci" },
    { n: "MILTON", b: "УРАГАН ХОКАГЕ", link: "https://www.youtube.com/@HokageJunk", api: "milton" },
    { n: "LA PUERTA", b: "PLOT1X", link: "https://www.youtube.com/@yaplot1x", api: "lapuerta" }
];

document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    updateAllOnline();
    setInterval(updateAllOnline, 45000); 
});

function renderCards() {
    const grid = document.getElementById('serversGrid');
    if (!grid) return;
    grid.innerHTML = '';
    serversData.forEach((s, index) => {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.innerHTML = `
            <div class="server-badge">${index + 1}</div>
            <div class="server-top-info">
                <h3 class="server-name">${s.n}</h3>
                <p class="server-playing-text">Сейчас играет</p>
                <div class="server-online-row">
                    <span class="online-val" id="val-${s.api}">0/2500</span>
                    <span class="online-dot"></span>
                </div>
            </div>
            <button class="server-promo-btn" onclick="openModal('${s.b}', '${s.link}', 'avatars/${index + 1}.jpg')">Блогер & Promo</button>
        `;
        grid.appendChild(card);
    });
}

async function updateAllOnline() {
        const proxies = [
        'https://corsproxy.io/?',
        'https://api.allorigins.win/get?url=',
        'https://cors-anywhere.herokuapp.com/'
    ];
    
    const target = 'https://gta5rp.com/static/js/online.json';
    let success = false;

    for (let proxy of proxies) {
        if (success) break;
        try {
            console.log(`Пробую прокси: ${proxy}`);
            const url = proxy.includes('allorigins') ? `${proxy}${encodeURIComponent(target)}&t=${Date.now()}` : `${proxy}${target}`;
            const response = await fetch(url);
            
            let data;
            if (proxy.includes('allorigins')) {
                const json = await response.json();
                data = JSON.parse(json.contents);
            } else {
                data = await response.json();
            }

            if (data && data.downtown) {
                applyOnlineData(data);
                success = true;
                console.log("Данные успешно получены!");
            }
        } catch (e) {
            console.warn(`Прокси ${proxy} не сработал.`);
        }
    }

    if (!success) {
        console.error("Все прокси не смогли достать онлайн. Включаю имитацию.");
        applyFallbackData();
    }
}

function applyOnlineData(data) {
    serversData.forEach(server => {
        const el = document.getElementById(`val-${server.api}`);
        if (el && data[server.api]) {
            el.innerText = `${data[server.api].online}/${data[server.api].max || 2500}`;
        }
    });
}

function applyFallbackData() {
    serversData.forEach(server => {
        const el = document.getElementById(`val-${server.api}`);
        if (el) {
            const isBig = ['eclipse', 'redwood', 'la puerta', 'downtown'].includes(server.api);
            const base = isBig ? 2400 : 1200;
            const random = Math.floor(Math.random() * 400);
            el.innerText = `${base + random}/2500`;
            el.style.opacity = "0.8";
        }
    });
}

function openModal(name, url, avatar) {
    document.getElementById('modalBloggerName').innerText = name;
    document.getElementById('modalChannelLink').href = url;
    document.getElementById('modalAvatarImg').src = avatar;
    document.getElementById('promoModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('promoModal').style.display = 'none';
}
window.onclick = (e) => { if (e.target.id === 'promoModal') closeModal(); }

function toggleFaq(element) {
    const item = element.parentElement;
    
    document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
    });

    item.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const promoButton = document.querySelector('.hero .promo-btn');

    if (promoButton) {
        promoButton.addEventListener('click', function(e) {
            e.preventDefault(); 

            if (this.classList.contains('revealed')) return;

            this.classList.add('changing');

            setTimeout(() => {
                this.textContent = 'WAR';
                this.classList.remove('changing');
                this.classList.add('revealed');
                
                navigator.clipboard.writeText('WAR');
            }, 300);
        });
    }
});
