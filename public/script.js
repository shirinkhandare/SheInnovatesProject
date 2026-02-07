/*Button event listeners*/
const homebutton = document.getElementById('home-button');
homebutton.addEventListener('click', () => {
    window.location.href = 'index.html';
});//When user clicks home button, redirect to homepage

const profilebutton = document.getElementById('profile-button');
profilebutton.addEventListener('click', ()=>{
    window.location.href='profile-page.html';
}); 


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
        updateCalendar(); // Refresh calendar to show indicators
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
        
        datesHTML += `<div class="date ${activeClass} ${hasLog}" data-date="${dateString}">${i}</div>`;
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


/*===============================================
  MEDICATION SEARCH & DOSAGE FUNCTIONALITY
===============================================*/

// Medication data (will be fetched from database)
let medications = [];

// Dosage modal elements
const dosageModal = document.getElementById('dosageModal');
const selectedMedName = document.getElementById('selectedMedName');
const dosageAmount = document.getElementById('dosageAmount');
const dosageUnit = document.getElementById('dosageUnit');
const saveDosageBtn = document.getElementById('saveDosageBtn');
const medicationSearch = document.getElementById('medicationSearch');
const searchBtn = document.getElementById('searchBtn');
const medicationList = document.getElementById('medicationList');

let selectedMedication = null;
let userMedications = {};

// Fetch medications from MongoDB
async function fetchMedications() {
    try {
        const response = await fetch('http://localhost:5000');
        
        if (!response.ok) {
            throw new Error('Failed to fetch medications');
        }
        
        const data = await response.json();
        medications = data; // Already sorted from backend
        
        displayMedications(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        medicationList.innerHTML = '<p style="text-align: center; color: #999; padding: 2vh;">Failed to load medications. Please check if the server is running.</p>';
    }
}

// Display all medications
function displayMedications(meds) {
    medicationList.innerHTML = '';
    
    if (meds.length === 0) {
        medicationList.innerHTML = '<p style="text-align: center; color: #999; padding: 2vh;">No medications found.</p>';
        return;
    }
    
    meds.forEach(med => {
        const medItem = document.createElement('div');
        medItem.className = 'medication-item';
        medItem.textContent = med;
        medItem.addEventListener('click', () => openDosageModal(med));
        medicationList.appendChild(medItem);
    });
}

// Open dosage modal
function openDosageModal(medName) {
    selectedMedication = medName;
    selectedMedName.textContent = medName;
    
    if (userMedications[medName]) {
        dosageAmount.value = userMedications[medName].amount;
        dosageUnit.value = userMedications[medName].unit;
    } else {
        dosageAmount.value = '';
        dosageUnit.value = '';
    }
    
    dosageModal.style.display = 'block';
}

// Close dosage modal
function closeDosageModal() {
    dosageModal.style.display = 'none';
}

// Save dosage to database
async function saveDosageToDatabase(medication, amount, unit) {
    try {
        const response = await fetch('http://localhost:5000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                medication: medication,
                amount: amount,
                unit: unit,
                userId: 'current_user_id' // Replace with actual user ID from your auth system
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save medication');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving medication:', error);
        alert('Failed to save medication. Please try again.');
    }
}

// Save dosage
saveDosageBtn.addEventListener('click', async () => {
    if (selectedMedication && dosageAmount.value && dosageUnit.value) {
        userMedications[selectedMedication] = {
            amount: dosageAmount.value,
            unit: dosageUnit.value
        };
        
        // Save to database
        await saveDosageToDatabase(
            selectedMedication, 
            dosageAmount.value, 
            dosageUnit.value
        );
        
        console.log('Medication saved:', selectedMedication, userMedications[selectedMedication]);
        
        closeDosageModal();
    } else {
        alert('Please fill in all fields');
    }
});

// Search functionality
function searchMedications() {
    const searchTerm = medicationSearch.value.toLowerCase();
    const filtered = medications.filter(med => 
        med.toLowerCase().includes(searchTerm)
    );
    displayMedications(filtered);
}

medicationSearch.addEventListener('input', searchMedications);
searchBtn.addEventListener('click', searchMedications);

// Close modal when clicking outside
dosageModal.addEventListener('click', (e) => {
    if (e.target === dosageModal) {
        closeDosageModal();
    }
});

// Initialize - fetch medications when page loads
fetchMedications();