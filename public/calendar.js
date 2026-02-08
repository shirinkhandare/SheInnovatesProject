/*Calendar*/
const monthYearElement = document.getElementById('monthYear');
const dateElement = document.getElementById('dates');
const prevBtn = document.getElementById('prev-button');
const nextBtn = document.getElementById('next-button');

let currentDate = new Date();

// Modal elements
const logModal = document.getElementById('logModal');
const selectedDateText = document.getElementById('selectedDateText');
const periodCheck = document.getElementById('periodCheck');
const painInput = document.getElementById('painInput');
const painValue = document.getElementById('painValue');
const medInput = document.getElementById('medInput');
const saveLogBtn = document.getElementById('saveLogBtn');

// Store logs data
let logs = {};
let selectedDate = null;

// Update pain level display
painInput.addEventListener('input', () => {
    painValue.textContent = painInput.value;
});

// Open modal when clicking a date
function openModal(dateString) {
    selectedDate = dateString;
    selectedDateText.textContent = `Log for ${new Date(dateString).toLocaleDateString('default', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })}`;
    
    // Load existing log if it exists
    if (logs[dateString]) {
        periodCheck.checked = logs[dateString].period;
        painInput.value = logs[dateString].pain;
        painValue.textContent = logs[dateString].pain;
        medInput.value = logs[dateString].medication;
    } else {
        // Reset to defaults
        periodCheck.checked = false;
        painInput.value = 5;
        painValue.textContent = 5;
        medInput.value = '';
    }
    
    logModal.style.display = 'block';
}

// Close modal
function closeModel() {
    logModal.style.display = 'none';
}

// Save log
saveLogBtn.addEventListener('click', () => {
    if (selectedDate) {
        logs[selectedDate] = {
            period: periodCheck.checked,
            pain: painInput.value,
            medication: medInput.value
        };
        
        console.log('Log saved:', logs[selectedDate]);
        
        closeModel();
        updateCalendar();
    }
});

// Close modal when clicking outside
logModal.addEventListener('click', (e) => {
    if (e.target === logModal) {
        closeModel();
    }
});

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthYearString = currentDate.toLocaleString('default', {month: 'long', year: 'numeric'});
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';
    
    // Previous month's dates
    for(let i = firstDayIndex; i > 0; i--){
       const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
       datesHTML += '<div class="date inactive">' + prevDate.getDate() + '</div>'; 
    }
    
    // Current month's dates
    for(let i = 1; i <= totalDays; i++){
        const date = new Date(currentYear, currentMonth, i);
        const dateString = date.toDateString();
        const activeClass = dateString === new Date().toDateString() ? 'active' : '';
        const hasLog = logs[dateString] ? 'has-log' : '';
        
        // Add period-day class if period is checked for this date
        const periodClass = logs[dateString] && logs[dateString].period ? 'period-day' : '';
        
        datesHTML += `<div class="date ${activeClass} ${hasLog} ${periodClass}" data-date="${dateString}">${i}</div>`;
    }

    // Next month's dates
    for(let i = 1; i < 7 - lastDayIndex; i++){
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    dateElement.innerHTML = datesHTML;
    
    // Add click handlers to all current month dates
    document.querySelectorAll('.date:not(.inactive)').forEach(dateEl => {
        dateEl.addEventListener('click', () => {
            const dateString = dateEl.getAttribute('data-date');
            openModal(dateString);
        });
    });
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
})

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
})

updateCalendar();