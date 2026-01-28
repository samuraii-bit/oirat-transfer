document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    const phoneElement = document.getElementById('phone');
    if (phoneElement) {
        IMask(phoneElement, { mask: '+{7} (000) 000-00-00' });
    }

    // Находим форму и кнопку
    const form = document.getElementById('bookingForm');
    const btn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const phoneInput = document.getElementById('phone');
        // Удаляем всё, кроме цифр, чтобы проверить длину
        const cleanPhone = phoneInput.value.replace(/\D/g, '');

        if (cleanPhone.length < 11) {
            alert("Пожалуйста, введите полный номер телефона (11 цифр).");
            phoneInput.focus();
            return; // Прекращаем выполнение, заявка не уйдет
        }
        
        // Блокируем кнопку
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerText = "Отправка...";

        const formData = new FormData(form);
        const params = new URLSearchParams();

        // Явно перебираем данные из формы, чтобы ничего не потерять
        formData.forEach((value, key) => {
            params.append(key, value);
        });

        fetch(`${CONFIG.API_URL}?${params.toString()}`, {
            method: 'GET', // Google Apps Script лучше всего работает с GET для doGet
            mode: 'no-cors' 
        })
        .then(() => {
            alert("✅ Заявка отправлена! Проверьте Telegram.");
            form.reset();
        })
        .catch(err => {
            console.error("Ошибка:", err);
            alert("❌ Ошибка при отправке.");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = "Отправить";
        });
    });

    setTimeout(() => {
        const toast = document.createElement('div');
        toast.innerHTML = 'Привет!';
        toast.className = 'fixed top-6 right-4 md:right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] backdrop-blur-md border border-white/20 transition-all duration-500 ease-out max-w-sm text-sm md:text-base';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }, 1000);
});

function copyRekvizity() {
    const rekv = 'СБП / Карта предоплаты Oirat-Transfer\nКарта: 2202 2000 0000 0001\nСБП: +7(900) 123-45-67';
    navigator.clipboard.writeText(rekv);
    alert('Реквизиты скопированы! 💳');
}