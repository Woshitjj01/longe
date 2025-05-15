document.addEventListener("DOMContentLoaded", function() {
    // 幻灯片功能
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.setAttribute('aria-hidden', i !== index);
            if (i === index) {
                slide.setAttribute('aria-live', 'polite');
            } else {
                slide.removeAttribute('aria-live');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
    });
    // 鼠标悬停时暂停自动播放
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
    slider.addEventListener('focusin', stopSlider);
    slider.addEventListener('focusout', startSlider);

    // 触摸设备支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlider();
    }, {passive: true});
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlider();
    }, {passive: true});

    function handleSwipe() {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > threshold) {
            prevSlide();
        }
    }

    // 响应式调整
    function handleResize() {
        const sliderHeight = window.innerWidth < 768 ? 
            (window.innerWidth < 480 ? 300 : 400) : 500;
        document.querySelector('.slider').style.height = `${sliderHeight}px`;
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // 初始化轮播
    showSlide(0);
    startSlider();

    // 为幻灯片添加ARIA角色
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    });

    // 交换出发地和目的地
    const swapButton = document.querySelector('.swap-btn');
    const departureInput = document.getElementById('departure');
    const arrivalInput = document.getElementById('arrival');

    swapButton.addEventListener('click', function() {
        const temp = departureInput.value;
        departureInput.value = arrivalInput.value;
        arrivalInput.value = temp;
    });

    // 乘客人数计数器
    const passengerSelector = document.querySelector('.passenger-selector');
    const passengerInput = document.getElementById('passengers');
    const passengerDropdown = document.querySelector('.passenger-dropdown');
    const counters = document.querySelectorAll('.counter');

    passengerSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        passengerDropdown.style.display = passengerDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function() {
        passengerDropdown.style.display = 'none';
    });

    counters.forEach(counter => {
        const decrementButton = counter.querySelector('.decrement');
        const incrementButton = counter.querySelector('.increment');
        const countDisplay = counter.querySelector('.count');

        decrementButton.addEventListener('click', (e) => {
            e.stopPropagation();
            let count = parseInt(countDisplay.textContent, 10);
            if (count > 0) {
                count--;
                countDisplay.textContent = count;
                updatePassengerInput();
            }
        });

        incrementButton.addEventListener('click', (e) => {
            e.stopPropagation();
            let count = parseInt(countDisplay.textContent, 10);
            count++;
            countDisplay.textContent = count;
            updatePassengerInput();
        });
    });

    function updatePassengerInput() {
        const adultCount = parseInt(document.querySelector('.passenger-type:nth-child(1) .count').textContent);
        const childCount = parseInt(document.querySelector('.passenger-type:nth-child(2) .count').textContent);
        const infantCount = parseInt(document.querySelector('.passenger-type:nth-child(3) .count').textContent);
        
        let passengerText = '';
        if (adultCount > 0) passengerText += `${adultCount} 成人`;
        if (childCount > 0) passengerText += `${passengerText ? '，' : ''}${childCount} 儿童`;
        if (infantCount > 0) passengerText += `${passengerText ? '，' : ''}${infantCount} 婴儿`;
        
        passengerInput.value = passengerText || '1 成人';
    }

    // 返程选项切换
    const returnOption = document.getElementById('return-option');
    const returnDateGroup = document.querySelector('.return-date-group');

    returnOption.addEventListener('change', function() {
        if (this.value === 'round-trip') {
            returnDateGroup.style.display = 'block';
            document.getElementById('return-date').required = true;
        } else {
            returnDateGroup.style.display = 'none';
            document.getElementById('return-date').required = false;
        }
    });

    // 搜索表单提交
    const searchForm = document.getElementById('search-form');
    const resultsSection = document.getElementById('results');
    const outboundResults = document.getElementById('outbound-results');
    const returnResults = document.getElementById('return-results');
    const returnTab = document.querySelector('.tab-btn[data-type="return"]');
    const bookingSummary = document.getElementById('booking-summary');
    const summaryContent = document.querySelector('.summary-content');

    // 动态生成票务数据
    function generateTicketData(from, to, type) {

        const baseData = {
    "北京-上海": [
        { departTime: "08:00", arriveTime: "10:30", airline: "中国航空", flightNo: "CA1234", type: "经济舱", price: 600 },
        { departTime: "12:00", arriveTime: "14:30", airline: "东方航空", flightNo: "MU5678", type: "商务舱", price: 1200 }
    ]
};
const trainBaseData = {
    "北京-上海": [
        { departTime: "09:00", arriveTime: "11:30", trainNo: "G101", type: "二等座", price: 500 },
        { departTime: "13:00", arriveTime: "15:30", trainNo: "G103", type: "一等座", price: 900 }
    ]
};

        const routeKey = `${from}-${to}`;
        const data = type === 'flight' ? baseData : trainBaseData;
        
        if (!data[routeKey]) {
            return [
                {
                    from: from,
                    to: to,
                    departTime: '08:00', 
                    arriveTime: '10:30', 
                    type: type === 'flight' ? '经济舱' : '二等座', 
                    price: type === 'flight' ? 600 : 500,
                    [type === 'flight' ? 'airline' : 'trainNo']: type === 'flight' ? '中国航空 CA1234' : 'G101'
                },
                {
                    from: from,
                    to: to,
                    departTime: '12:00', 
                    arriveTime: '14:30', 
                    type: type === 'flight' ? '商务舱' : '一等座', 
                    price: type === 'flight' ? 1200 : 900,
                    [type === 'flight' ? 'airline' : 'trainNo']: type === 'flight' ? '东方航空 MU5678' : 'G103'
                }
            ];
        }
        
        return data[routeKey].map(item => ({
            from: from,
            to: to,
            ...item
        }));
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const departure = departureInput.value.trim();
        const arrival = arrivalInput.value.trim();
        const departDate = document.getElementById('depart-date').value;
        const isRoundTrip = returnOption.value === 'round-trip';
        const returnDate = isRoundTrip ? document.getElementById('return-date').value : null;
        const travelType = document.getElementById('travel-type').value;
        const passengers = passengerInput.value;
        
        // 验证输入
        if (!departure || !arrival) {
            alert('Please enter the departure and destination.');
            return;
        }
        
        // 显示搜索结果区域
        resultsSection.style.display = 'block';
        outboundResults.innerHTML = '';
        returnResults.innerHTML = '';
        bookingSummary.style.display = 'none';
        
        // 根据用户输入动态生成票务数据
        const data = generateTicketData(departure, arrival, travelType);
        
        // 生成去程票务
        data.forEach(item => {
            const ticketElement = createTicketElement(item, travelType);
            outboundResults.appendChild(ticketElement);
        });
        
        // 如果是往返，显示返程标签
        returnTab.style.display = isRoundTrip ? 'block' : 'none';
        
        // 滚动到搜索结果
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // 创建票务元素
    function createTicketElement(item, type) {
        const ticket = document.createElement('div');
        ticket.className = 'ticket-item';
        
        const icon = type === 'flight' ? '<i class="fas fa-plane"></i>' : '<i class="fas fa-train"></i>';
        
        ticket.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-route">
                    <span class="ticket-city">${item.from}</span>
                    ${icon}
                    <span class="ticket-city">${item.to}</span>
                </div>
                <div class="ticket-time">${item.departTime} - ${item.arriveTime}</div>
                <div class="ticket-type">${type === 'flight' ? item.airline + ' ' + item.flightNo : '高铁 ' + item.trainNo} · ${item.type}</div>
            </div>
            <div class="ticket-price">¥${item.price}</div>
            <button class="ticket-select">choose</button>
        `;
        
        // 添加选择按钮事件
        const selectBtn = ticket.querySelector('.ticket-select');
        selectBtn.addEventListener('click', function() {
            const tabType = document.querySelector('.tab-btn.active').dataset.type;
            const summaryType = tabType === 'outbound' ? '去程' : '返程';
            
            // 添加到预订摘要
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.dataset.type = tabType;
            summaryItem.innerHTML = `
                <span>${summaryType}: ${item.from} → ${item.to}</span>
                <span>¥${item.price}</span>
            `;
            summaryContent.appendChild(summaryItem);
            
            // 显示预订摘要
            bookingSummary.style.display = 'block';
            
            // 如果是去程且选择了往返，切换到返程标签
            if (tabType === 'outbound' && returnTab.style.display === 'block') {
                document.querySelector('.tab-btn[data-type="return"]').click();
                
                // 生成返程票务
                const departure = document.getElementById('departure').value.trim();
                const arrival = document.getElementById('arrival').value.trim();
                const travelType = document.getElementById('travel-type').value;
                const returnData = generateTicketData(arrival, departure, travelType);
                
                returnResults.innerHTML = '';
                returnData.forEach(item => {
                    const returnTicket = createTicketElement(item, travelType);
                    returnResults.appendChild(returnTicket);
                });
            } else {
                // 滚动到预订摘要
                bookingSummary.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        return ticket;
    }

    // 标签切换功能
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const type = this.dataset.type;
            document.querySelectorAll('.results-grid').forEach(grid => {
                grid.style.display = 'none';
            });
            
            document.getElementById(`${type}-results`).style.display = 'grid';
        });
    });

    // 确认预订按钮
    document.querySelector('.confirm-btn').addEventListener('click', function() {
        const isRoundTrip = document.getElementById('return-option').value === 'round-trip';
        const hasOutbound = document.querySelector('.summary-item[data-type="outbound"]');
        const hasReturn = document.querySelector('.summary-item[data-type="return"]');
        
        if (isRoundTrip && !hasReturn) {
            alert('您还没有选择返程票');
            return;
        }
        
        // 清空表单和搜索结果
        document.getElementById('search-form').reset();
        resultsSection.style.display = 'none';
        bookingSummary.style.display = 'none';
        summaryContent.innerHTML = '';
        
        // 显示成功消息
        alert('have a nice trip!');
        
        // 重置乘客计数器
        document.querySelectorAll('.count').forEach((count, index) => {
            count.textContent = index === 0 ? '1' : '0';
        });
        document.getElementById('passengers').value = '1 成人';
    });
// 视频推荐功能

    const allVideos = [ { src: './assets/video/beijin.mp4', title: 'Beijing', description: 'Under the royal city, clouds gather; the alleyways harbor ancient and modern flavors.' }, { src: './assets/video/shanghai.mp4', title: 'Shanghai', description: 'Neon lights illuminate the Bund, savor the local life in Shikumen.' }, { src: './assets/video/lianyungang.mp4', title: 'Lianyungang', description: 'Western Journey through mountains and seas, a land bridge connecting Asia and Europe.' }, { src: './assets/video/chengdu.mp4', title: 'Chengdu', description: 'Leisurely experiences in Kuan Zhai Alley; the city of Chengdu has a history spanning three thousand years.' }, { src: './assets/video/shenzhen.mp4', title: 'Shenzhen', description: 'Reform speed paves the future; mountains and seas connect the city with new trends.' }, { src: './assets/video/suzhou.mp4', title: 'Suzhou', description: 'Small bridges and flowing water allow for peaceful slumber, painting brings life to the white walls and black tiles.' }, { src: './assets/video/nanjing.mp4', title: 'Nanjing', description: 'Within the sycamore trees lies imperial power; Nanjing is half a history of Jinling.' }, { src: './assets/video/nanchang.mp4', title: 'Nanchang', description: 'The red former capital shines through time, the banks of Gan River radiate new brilliance.' }, { src: './assets/video/changsha.mp4', title: 'Changsha', description: 'The birthplace of Huxiang culture, a metropolis of modern entertainment.' }, { src: './assets/video/guangzhou.mp4', title: 'Guangzhou', description: 'Morning tea wafts fragrant, the Pearl River surges as a window to the world.' } ];

        // 初始化当前展示的视频索引
        let currentVideoIndex = 0;

function createVideoElement(video) {
    const videoItem = document.createElement('div');
    videoItem.className = 'recommendation-item';
    videoItem.innerHTML = `
        <div class="video-container">
            <video muted loop>
              <source src="${video.src}" type="video/mp4">
            </video>
        </div>
        <div class="info">
        <h3>${video.title}</h3>
        <p>${video.description}</p>
        </div>
    `;
    // 添加播放控制
    const videoEl = videoItem.querySelector('video');
    const playBtn = videoItem.querySelector('.play-btn');
    
    videoItem.addEventListener('mouseenter', () => {
        videoEl.play().catch(e => console.error("播放失败:", e));
    });

    videoItem.addEventListener('mouseleave', () => {
        videoEl.pause();
    });
    return videoItem;
}
// 展示视频的函数
function showVideos() {
    const recommendationGrid = document.getElementById('recommendation-grid');
    recommendationGrid.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const index = (currentVideoIndex + i) % allVideos.length;
        const video = allVideos[index];
        const videoElement = createVideoElement(video);
        recommendationGrid.appendChild(videoElement);
    }
}

// 换一批按钮的点击事件处理函数
function shuffleVideos() {
    currentVideoIndex = (currentVideoIndex + 5) % allVideos.length;
    showVideos();
}

// 页面加载完成后初始化视频展示
window.addEventListener('load', function() {
    showVideos();
    const shuffleBtn = document.getElementById('shuffle-btn');
    shuffleBtn.addEventListener('click', shuffleVideos);
});



    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('depart-date').value = today;
    document.getElementById('depart-date').min = today;
    
    // 设置返回日期最小值为出发日期
    document.getElementById('depart-date').addEventListener('change', function() {
        document.getElementById('return-date').min = this.value;
    });
});