// Custom form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('applicationForm');
    const statusDiv = document.getElementById('applicationStatus');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const location = document.getElementById('location').value.trim();
        const timezone = document.getElementById('timezone').value.trim();
        const nickname = document.getElementById('nickname').value.trim();
        const projects = document.getElementById('projects').value.trim();
        const reason = document.getElementById('reason').value.trim();

        // Validate fields
        let isValid = true;
        let errorMessage = '';

        if (name.length < 2) {
            isValid = false;
            errorMessage += 'Имя должно содержать минимум 2 символа.\n';
        }

        if (location.length < 2) {
            isValid = false;
            errorMessage += 'Укажите город или страну.\n';
        }

        if (timezone.length < 2) {
            isValid = false;
            errorMessage += 'Укажите ваш часовой пояс.\n';
        }

        if (nickname.length < 3) {
            isValid = false;
            errorMessage += 'Никнейм должен содержать минимум 3 символа.\n';
        }

        if (projects.length < 10) {
            isValid = false;
            errorMessage += 'Расскажите подробнее о вашем опыте на других проектах.\n';
        }

        if (reason.length < 20) {
            isValid = false;
            errorMessage += 'Пожалуйста, напишите более подробно о причинах вступления в семью.\n';
        }

        if (isValid) {
            // Prepare form data
            const formData = {
                name,
                location,
                timezone,
                nickname,
                projects,
                reason
            };

            // Show loading state
            statusDiv.innerHTML = '<div class="loading-message">Отправка заявки...</div>';

            // Send data to server
            fetch('https://application-mikaelson.onrender.com/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    statusDiv.innerHTML = '<div class="success-message">Спасибо! Ваша заявка успешно отправлена. Мы рассмотрим её в ближайшее время.</div>';
                    form.reset();
                } else if (response.status === 429) {
                    statusDiv.innerHTML = '<div class="error-message">Вы уже отправляли заявку за последние 24 часа. Пожалуйста, попробуйте позже.</div>';
                } else {
                    throw new Error('Ошибка сервера');
                }
            })
            .catch(error => {
                statusDiv.innerHTML = '<div class="error-message">Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.</div>';
                console.error('Error:', error);
            });
        } else {
            statusDiv.innerHTML = '<div class="error-message">' + errorMessage.replace(/\n/g, '<br>') + '</div>';
        }
    });

    // Add input validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(field.id) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                }
                break;
            case 'location':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Укажите город или страну';
                }
                break;
            case 'timezone':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Укажите ваш часовой пояс';
                }
                break;
            case 'nickname':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Никнейм должен содержать минимум 3 символа';
                }
                break;
            case 'projects':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Расскажите подробнее о вашем опыте';
                }
                break;
            case 'reason':
                if (value.length < 20) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, напишите более подробно';
                }
                break;
        }

        // Update field styling
        if (!isValid) {
            field.classList.add('error');
            field.setAttribute('title', errorMessage);
        } else {
            field.classList.remove('error');
            field.removeAttribute('title');
        }
    }
}); 