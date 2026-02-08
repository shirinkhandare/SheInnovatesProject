/*===============================================
  MY MEDICATIONS - Display user's saved medications
===============================================*/

const medicationCardsGrid = document.querySelector('.cards-grid');

// Fetch user's medications from database
async function fetchUserMedications() {
    try {
        const response = await fetch('http://localhost:3000/api/user-medications');
        
        if (!response.ok) {
            if (response.status === 302 || response.status === 401) {
                // User not logged in
                window.location.href = '/login';
                return;
            }
            throw new Error('Failed to fetch medications');
        }
        
        const medications = await response.json();
        console.log('Fetched medications:', medications);
        
        displayMedications(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        medicationCardsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4vh;">
                <h3 style="color: #ff5869; margin-bottom: 2vh;">❌ Error Loading Medications</h3>
                <p style="color: #666;">Make sure the server is running and you're logged in.</p>
                <button onclick="location.href='/login'" style="
                    margin-top: 2vh;
                    padding: 1.5vh 3vw;
                    background-color: #ff5869;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1em;
                ">Go to Login</button>
            </div>
        `;
    }
}

// Display medications as cards
function displayMedications(medications) {
    if (!medications || medications.length === 0) {
        medicationCardsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4vh;">
                <h3 style="color: #666; margin-bottom: 2vh;">📋 No Medications Yet</h3>
                <p style="color: #999; margin-bottom: 2vh;">You haven't added any medications yet.</p>
                <button onclick="location.href='/searchmed'" style="
                    padding: 1.5vh 3vw;
                    background-color: #ff5869;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    transition: all 0.3s ease;
                " onmouseover="this.style.backgroundColor='#ff4056'" 
                   onmouseout="this.style.backgroundColor='#ff5869'">
                    + Search Medications
                </button>
            </div>
        `;
        return;
    }
    
    // Clear existing cards
    medicationCardsGrid.innerHTML = '';
    
    // Create a card for each medication
    medications.forEach(med => {
        const card = createMedicationCard(med);
        medicationCardsGrid.appendChild(card);
    });
}

// Create a medication card
function createMedicationCard(medication) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.position = 'relative';
    
    // Get first letter for monogram
    const firstLetter = medication.medication.charAt(0).toUpperCase();
    
    card.innerHTML = `
        <div class="content">
            <div class="monogram" style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #ff5869, #ff8a94);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 1vh;
            ">
                ${firstLetter}
            </div>
            <div class="text">
                <div class="title" style="
                    font-size: 1.3em;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 1vh;
                ">${medication.medication}</div>
                <div class="description" style="
                    color: #666;
                    line-height: 1.6;
                ">
                    <strong>Dosage:</strong> ${medication.amount}${medication.unit}<br>
                    <strong>Frequency:</strong> ${medication.frequency}
                </div>
            </div>
            <button class="delete-btn" data-id="${medication._id}" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff5869;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 1.2em;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            " onmouseover="this.style.backgroundColor='#ff4056'; this.style.transform='scale(1.1)'" 
               onmouseout="this.style.backgroundColor='#ff5869'; this.style.transform='scale(1)'">
                ×
            </button>
        </div>
    `;
    
    // Add delete functionality
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteMedication(medication._id, medication.medication));
    
    return card;
}

// Delete medication
async function deleteMedication(medicationId, medicationName) {
    const confirmed = confirm(`Are you sure you want to delete ${medicationName}?`);
    
    if (!confirmed) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/user-medications/${medicationId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete medication');
        }
        
        console.log('Medication deleted:', medicationName);
        
        // Refresh the list
        fetchUserMedications();
        
        // Show success message
        showNotification(`✅ ${medicationName} deleted successfully`);
        
    } catch (error) {
        console.error('Error deleting medication:', error);
        alert('❌ Failed to delete medication. Please try again.');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 1.5vh 2vw;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize - fetch medications when page loads
console.log('🔄 Loading your medications...');
fetchUserMedications();

// Refresh every 30 seconds to catch any updates
setInterval(fetchUserMedications, 30000);