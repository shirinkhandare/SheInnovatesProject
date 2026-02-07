
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
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const monthJump = document.getElementById('monthJump');
    const yearJump = document.getElementById('yearJump');

    // 1. INITIALIZE THE CALENDAR
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: '' // We are using our own dropdowns instead
        },
        
        // This runs whenever the month/year changes (even via arrows)
        datesSet: function() {
            const currentViewDate = calendar.getDate();
            // Sync dropdowns to match the calendar's current view
            monthJump.value = currentViewDate.getMonth();
            yearJump.value = currentViewDate.getFullYear();
        },

        // Click a date to open the log form
        dateClick: function(info) {
            window.currentSelectedDate = info.dateStr;
            document.getElementById('selectedDateText').innerText = "Log for: " + info.dateStr;
            document.getElementById('logModal').style.display = 'block';
        }
    });

    calendar.render();

    // 2. DROPDOWN NAVIGATION LOGIC
    function jumpToDate() {
        const year = yearJump.value;
        const month = monthJump.value;
        // We use day '1' to avoid issues with months having different lengths
        calendar.gotoDate(new Date(year, month, 1));
    }

    monthJump.addEventListener('change', jumpToDate);
    yearJump.addEventListener('change', jumpToDate);

    // 3. SAVING DATA TO YOUR BACKEND (index.js)
    document.getElementById('saveLogBtn').addEventListener('click', () => {
        const logData = {
            date: window.currentSelectedDate,
            period: document.getElementById('periodCheck').checked,
            pain: document.getElementById('painInput').value,
            meds: document.getElementById('medInput').value
        };

        fetch('/save-period-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData)
        })
        .then(response => {
            if (response.ok) {
                alert("Log Saved Successfully!");
                document.getElementById('logModal').style.display = 'none';
                // Optional: You could refresh the calendar here to show the new log
            }
        })
        .catch(err => console.error("Error saving log:", err));
    });
});

  









