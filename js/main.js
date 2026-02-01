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

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Правильно собираем все поля
            const formData = {
                customerName: document.getElementById('customerName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                departure: document.getElementById('departure').value,
                destination: document.getElementById('destination').value,
                date: document.getElementById('date').value,
                serviceClass: document.getElementById('serviceClass').value,
                passengers: document.getElementById('passengers').value,
                message: document.getElementById('message').value.trim(),
                pickupAddress: document.getElementById('departure').value // дублируем departure
            };

            // Валидация
            const cleanPhone = formData.phone.replace(/\D/g, '');
            if (cleanPhone.length < 11) {
                alert("Пожалуйста, введите полный номер телефона (11 цифр).");
                return;
            }

            // Блокируем кнопку
            btn.disabled = true;
            btn.innerHTML = 'Отправка...';

            try {
                // Отправляем POST запрос
                const response = await fetch(CONFIG.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString()
                });

                const result = await response.json();
                
                if (result.status === "success") {
                    alert(`✅ Заявка #${result.id} отправлена! Мы свяжемся с вами.`);
                    form.reset();
                } else {
                    alert("❌ Ошибка: " + (result.message || "Не удалось отправить заявку"));
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert("❌ Ошибка сети. Попробуйте позвонить: +7 909 893 0000");
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Отправить заявку';
            }
        });
    }

    // form.addEventListener('submit', function(e) {
    //     e.preventDefault();

    //     const formData = new FormData(form);
    //     const params = new URLSearchParams();

    //     // Собираем ВСЕ данные из полей формы
    //     params.append('customerName', document.getElementById('name').value);
    //     params.append('phone', document.getElementById('phone').value);
    //     params.append('departure', document.getElementById('departure').value);
    //     params.append('destination', document.getElementById('destination').value);
    //     params.append('date', document.getElementById('date').value);
    //     params.append('message', document.getElementById('message').value);
        
    //     // ВОТ ЭТИ ДВА ПОЛЯ МЫ ТЕРЯЛИ:
    //     params.append('serviceClass', document.getElementById('serviceClass').value);
    //     params.append('passengers', document.getElementById('passengers').value);

    //     // Отправка (API_URL берется из config.js)
    //     fetch(`${CONFIG.API_URL}?${params.toString()}`, {
    //         method: 'GET',
    //         mode: 'no-cors'
    //     })
    //     .then(() => {
    //         alert("✅ Заявка отправлена!");
    //         form.reset();
    //     })
    //     .catch(err => console.error("Ошибка:", err));
    // });
    
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