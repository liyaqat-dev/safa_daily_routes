        // -------------------------------------------------------------
        // Live Clock
        // -------------------------------------------------------------
        function updateClock() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('live-clock').textContent = timeString;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // -------------------------------------------------------------
        // Render 15 Fixed Rows
        // -------------------------------------------------------------
        const tableBody = document.getElementById('schedule-body');

        function getTypeBadge(typeStr) {
            if (!typeStr) return '<span class="badge-empty">-</span>';
            const clean = typeStr.trim().toUpperCase();
            if (clean.includes('ORDER')) {
                return `<span class="badge badge-order">ORDER</span>`;
            } else if (clean.includes('SUPP')) {
                return `<span class="badge badge-supply">SUPPLY</span>`;
            }
            return `<span class="badge badge-order">${clean}</span>`;
        }

        function formatDateLabel(dateStr) {
            if (!dateStr) return '-';
            const d = new Date(dateStr + 'T00:00:00'); // force local date mapping
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${days[d.getDay()]}`;
        }

        function renderRows(rows = []) {
            tableBody.innerHTML = '';

            // Update top header day labels if present in database
            if (rows.length > 0 && rows[0].assignments && rows[0].assignments.length > 0) {
                const a = rows[0].assignments;
                if (a[0]) document.getElementById('header-day-1').textContent = formatDateLabel(a[0].date);
                if (a[1]) document.getElementById('header-day-2').textContent = formatDateLabel(a[1].date);
                if (a[2]) document.getElementById('header-day-3').textContent = formatDateLabel(a[2].date);
            }

            // Always render EXACTLY 15 rows to maintain rigid TV layout
            for (let i = 0; i < 15; i++) {
                const item = rows[i];
                const tr = document.createElement('tr');

                if (item && item.assignments) {
                    const a1 = item.assignments[0] || {};
                    const a2 = item.assignments[1] || {};
                    const a3 = item.assignments[2] || {};

                    tr.innerHTML = `
                        <td class="cell-name">${item.name || '-'}</td>
                        <td class="cell-route day-divider-left">${a1.route || '-'}</td>
                        <td class="text-center">${getTypeBadge(a1.type)}</td>
                        <td class="cell-route day-divider-left">${a2.route || '-'}</td>
                        <td class="text-center">${getTypeBadge(a2.type)}</td>
                        <td class="cell-route day-divider-left">${a3.route || '-'}</td>
                        <td class="text-center">${getTypeBadge(a3.type)}</td>
                    `;
                } else {
                    // Empty row placeholder
                    tr.innerHTML = `
                        <td class="empty-row-text">-</td>
                        <td class="empty-row-text day-divider-left">-</td>
                        <td class="empty-row-text text-center">-</td>
                        <td class="empty-row-text day-divider-left">-</td>
                        <td class="empty-row-text text-center">-</td>
                        <td class="empty-row-text day-divider-left">-</td>
                        <td class="empty-row-text text-center">-</td>
                    `;
                }
                tableBody.appendChild(tr);
            }
        }

        // -------------------------------------------------------------
        // Sample Reference Data (matching user reference image structure)
        // -------------------------------------------------------------
        const defaultSampleData = [
            { id: 1, name: 'Aijil', assignments: [ {date: '2026-01-01', route: 'NTTIKA', type: 'ORDER'}, {date: '2026-01-02', route: 'NTTIKA', type: 'ORDER'}, {date: '2026-01-03', route: 'NTTIKA', type: 'ORDER'} ] },
            { id: 2, name: 'Mishun', assignments: [ {date: '2026-01-01', route: 'THRIUR', type: 'SUPPLY'}, {date: '2026-01-02', route: 'THRIUR', type: 'SUPPLY'}, {date: '2026-01-03', route: 'THRIUR', type: 'SUPPLY'} ] },
            { id: 3, name: 'AhDI', assignments: [ {date: '2026-01-01', route: 'CHETUA', type: 'ORDER'}, {date: '2026-01-02', route: 'CHETUA', type: 'ORDER'}, {date: '2026-01-03', route: 'CHETUA', type: 'ORDER'} ] },
            { id: 4, name: 'NOOERU', assignments: [ {date: '2026-01-01', route: 'PATTAMBI', type: 'SUPPLY'}, {date: '2026-01-02', route: 'PATTAMBI', type: 'SUPPLY'}, {date: '2026-01-03', route: 'PATTAMBI', type: 'SUPPLY'} ] },
            { id: 5, name: 'Athwaah', assignments: [ {date: '2026-01-01', route: 'EKM', type: 'ORDER'}, {date: '2026-01-02', route: 'EKM', type: 'ORDER'}, {date: '2026-01-03', route: 'EKM', type: 'ORDER'} ] },
            { id: 6, name: 'Shameer', assignments: [ {date: '2026-01-01', route: 'OLAVAKKOD', type: 'SUPPLY'}, {date: '2026-01-02', route: 'PALAKKAD', type: 'ORDER'}, {date: '2026-01-03', route: 'OLAVAKKOD', type: 'SUPPLY'} ] },
            { id: 7, name: 'Faisal', assignments: [ {date: '2026-01-01', route: 'CALICUT', type: 'ORDER'}, {date: '2026-01-02', route: 'KANNUR', type: 'SUPPLY'}, {date: '2026-01-03', route: 'CALICUT', type: 'ORDER'} ] },
            { id: 8, name: 'Jamsheer', assignments: [ {date: '2026-01-01', route: 'MALAPPURAM', type: 'SUPPLY'}, {date: '2026-01-02', route: 'WAYANAD', type: 'ORDER'}, {date: '2026-01-03', route: 'MALAPPURAM', type: 'SUPPLY'} ] },
            { id: 9, name: 'Rashid', assignments: [ {date: '2026-01-01', route: 'ALAPPUZHA', type: 'ORDER'}, {date: '2026-01-02', route: 'KOTTAYAM', type: 'SUPPLY'}, {date: '2026-01-03', route: 'ALAPPUZHA', type: 'ORDER'} ] },
            { id: 10, name: 'Niyas', assignments: [ {date: '2026-01-01', route: 'TRIVANDRUM', type: 'SUPPLY'}, {date: '2026-01-02', route: 'KOLLAM', type: 'ORDER'}, {date: '2026-01-03', route: 'TRIVANDRUM', type: 'SUPPLY'} ] },
            { id: 11, name: 'Suhail', assignments: [ {date: '2026-01-01', route: 'CHALAKUDY', type: 'ORDER'}, {date: '2026-01-02', route: 'ANGAMALY', type: 'SUPPLY'}, {date: '2026-01-03', route: 'CHALAKUDY', type: 'ORDER'} ] },
            { id: 12, name: 'Basheer', assignments: [ {date: '2026-01-01', route: 'GURUVAYUR', type: 'SUPPLY'}, {date: '2026-01-02', route: 'NATTIKA', type: 'ORDER'}, {date: '2026-01-03', route: 'GURUVAYUR', type: 'SUPPLY'} ] },
            { id: 13, name: 'Anas', assignments: [ {date: '2026-01-01', route: 'ALUVA', type: 'ORDER'}, {date: '2026-01-02', route: 'EDAPPALLY', type: 'SUPPLY'}, {date: '2026-01-03', route: 'ALUVA', type: 'ORDER'} ] },
            { id: 14, name: 'Haris', assignments: [ {date: '2026-01-01', route: 'VYTILA', type: 'SUPPLY'}, {date: '2026-01-02', route: 'AROOKUTTY', type: 'ORDER'}, {date: '2026-01-03', route: 'VYTILA', type: 'SUPPLY'} ] },
            { id: 15, name: 'Yoonus', assignments: [ {date: '2026-01-01', route: 'KASARAGOD', type: 'ORDER'}, {date: '2026-01-02', route: 'KANNUR', type: 'SUPPLY'}, {date: '2026-01-03', route: 'KASARAGOD', type: 'ORDER'} ] }
        ];

        // -------------------------------------------------------------
        // Supabase Live Client Configuration
        // -------------------------------------------------------------
        const SUPABASE_URL = 'https://yhtgycnynpinnopbsyhk.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodGd5Y255bnBpbm5vcGJzeWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ3OTgsImV4cCI6MjEwMzU4MDc5OH0.JPZQ849JWqTiw07VvZEvMXJJHHPLQimSvLalEhS9nro';

        let supabaseClient = null;

        if (SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
            try {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } catch (err) {
                console.error("Supabase init error:", err);
            }
        }

        async function fetchSupabaseSchedule() {
            if (!supabaseClient) {
                renderRows(defaultSampleData);
                document.getElementById('connection-status').textContent = 'Demo Mode (No Keys)';
                document.getElementById('connection-dot').classList.add('offline');
                return;
            }

            try {
                const { data, error } = await supabaseClient
                    .from('safa_schedule_v2')
                    .select('*')
                    .order('id', { ascending: true })
                    .limit(15);

                if (error) throw error;

                if (data && data.length > 0) {
                    renderRows(data);
                } else {
                    // Fallback to sample data preview if table has 0 rows currently
                    renderRows(defaultSampleData);
                }

                document.getElementById('connection-status').textContent = 'Live (Realtime)';
                document.getElementById('connection-dot').classList.remove('offline');
            } catch (err) {
                console.warn('Could not fetch remote table, rendering sample layout:', err);
                renderRows(defaultSampleData);
                document.getElementById('connection-status').textContent = 'Live Fallback';
                document.getElementById('connection-dot').classList.remove('offline');
            }
        }

        // Initial Data Fetch
        fetchSupabaseSchedule();

        // Realtime Subscription
        if (supabaseClient) {
            supabaseClient
                .channel('safa-realtime-channel')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'safa_schedule_v2' }, (payload) => {
                    console.log('Realtime change detected:', payload);
                    fetchSupabaseSchedule();
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        document.getElementById('connection-status').textContent = 'Live (Realtime)';
                        document.getElementById('connection-dot').classList.remove('offline');
                    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                        document.getElementById('connection-status').textContent = 'Connecting...';
                        document.getElementById('connection-dot').classList.add('offline');
                    }
                });
        }
