document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dob');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result');

    calculateBtn.addEventListener('click', () => {
        const dobValue = dobInput.value;
        if (!dobValue) {
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = 'Please enter your date of birth.';
            return;
        }

        const birthDate = new Date(dobValue);
        const today = new Date();

        // Basic age calculation
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Summary calculations
        const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;

        // Next birthday calculation
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (today > nextBirthday) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        const timeToNextBirthday = nextBirthday.getTime() - today.getTime();
        const daysToNextBirthday = Math.ceil(timeToNextBirthday / (1000 * 60 * 60 * 24));

        let monthsToNext = 0;
        let daysToNext = 0;

        let tempDate = new Date(today);
        while(tempDate < nextBirthday) {
            let oldMonth = tempDate.getMonth();
            tempDate.setMonth(tempDate.getMonth() + 1);
            if(tempDate > nextBirthday) {
                tempDate.setMonth(oldMonth);
                break;
            }
            monthsToNext++;
        }
        daysToNext = Math.ceil((nextBirthday - tempDate) / (1000 * 60 * 60 * 24));


        // Display results
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <h3>Your Age</h3>
            <p>${years} years, ${months} months, and ${days} days</p>
            <hr>
            <h3>Summary</h3>
            <p><strong>Total Months:</strong> ${totalMonths}</p>
            <p><strong>Total Weeks:</strong> ${totalWeeks}</p>
            <p><strong>Total Days:</strong> ${totalDays}</p>
            <hr>
            <h3>Next Birthday</h3>
            <p>${monthsToNext} months and ${daysToNext} days away</p>
        `;
    });
});
