// Функционал таймлайна
function initTimeline() {
    const stages = [
        { 
            element: document.querySelector('.stages-step:nth-child(1)'),
            startDate: new Date(2024, 3, 8), // Месяцы в JavaScript начинаются с 0
            endDate: new Date(2024, 3, 24)
        },
        { 
            element: document.querySelector('.stages-step:nth-child(2)'),
            startDate: new Date(2024, 3, 25),
            endDate: new Date(2024, 4, 1)
        },
        { 
            element: document.querySelector('.stages-step:nth-child(3)'),
            startDate: new Date(2024, 4, 2),
            endDate: new Date(2024, 4, 9)
        },
        { 
            element: document.querySelector('.stages-step:nth-child(4)'),
            startDate: new Date(2024, 4, 10),
            endDate: new Date(2024, 4, 31)
        }
    ];
    
    function updateStages() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Сбрасываем время для корректного сравнения дат
        
        stages.forEach((stage, index) => {
            if (!stage.element) return;
            
            // Удаляем все классы состояния
            stage.element.classList.remove('enable', 'active', 'disable');
            
            // Сравниваем даты
            if (currentDate >= stage.startDate && currentDate <= stage.endDate) {
                // Текущий этап
                stage.element.classList.add('active');
            } else if (currentDate < stage.startDate) {
                // Будущий этап
                stage.element.classList.add('disable');
            } else {
                // Прошедший этап
                stage.element.classList.add('enable');
            }
            
            // Для последнего этапа после его окончания убираем линию
            if (index === stages.length - 1) {
                const line = stage.element.querySelector('.line');
                if (line) {
                    line.style.display = currentDate > stage.endDate ? 'none' : '';
                }
            }
        });
        
        // Обновляем подзаголовок
        updateSubtitle(currentDate);
    }
    
    function updateSubtitle(currentDate) {
        const subtitle = document.querySelector('.stages-subtitle-days');
        if (!subtitle) return;
        
        // Находим текущий или следующий этап
        const activeStage = stages.find(stage => 
            currentDate >= stage.startDate && currentDate <= stage.endDate
        );
        
        if (activeStage) {
            subtitle.textContent = 'Уже идет';
            return;
        }
        
        const nextStage = stages.find(stage => currentDate < stage.startDate);
        if (nextStage) {
            const daysLeft = Math.ceil((nextStage.startDate - currentDate) / (1000 * 60 * 60 * 24));
            subtitle.textContent = `Начнется через ${daysLeft} ${getDayEnding(daysLeft)}`;
        } else {
            subtitle.textContent = 'Уже завершился';
        }
    }
    
    function getDayEnding(number) {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'дней';
        }
        
        if (lastDigit === 1) {
            return 'день';
        }
        
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'дня';
        }
        
        return 'дней';
    }
    
    // Запускаем обновление статусов
    updateStages();
    
    // Обновляем каждый день в полночь
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToMidnight = tomorrow - now;
    
    setTimeout(() => {
        updateStages();
        // После первого обновления в полночь, устанавливаем интервал на каждые 24 часа
        setInterval(updateStages, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
}

// Функция для создания превью видео
function setupVideoThumbnails() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const videoUrl = container.dataset.videoUrl;
        if (!videoUrl) return;
        
        // Создаем превью для видео
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.style.backgroundImage = `url(${container.dataset.thumbnail || 'images/video-thumbnail.jpg'})`;
        
        // Добавляем кнопку воспроизведения
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        
        thumbnail.appendChild(playButton);
        container.appendChild(thumbnail);
        
        // Обработчик клика для воспроизведения видео
        thumbnail.addEventListener('click', () => {
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            container.innerHTML = '';
            container.appendChild(iframe);
        });
    });
}

// Запускаем инициализацию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    setupVideoThumbnails();
}); 