document.addEventListener("DOMContentLoaded", function() {
    // 幻灯片功能
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
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

    startSlider();

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

    // 模拟票务数据
    const flightData = [
        { from: '北京', to: '上海', departTime: '08:00', arriveTime: '10:30', type: '经济舱', price: 580, airline: '中国航空', flightNo: 'CA1234' },
        { from: '北京', to: '上海', departTime: '10:30', arriveTime: '13:00', type: '商务舱', price: 1200, airline: '东方航空', flightNo: 'MU5678' },
        { from: '北京', to: '上海', departTime: '14:00', arriveTime: '16:30', type: '经济舱', price: 650, airline: '南方航空', flightNo: 'CZ9012' },
        { from: '北京', to: '上海', departTime: '18:00', arriveTime: '20:30', type: '头等舱', price: 1800, airline: '海南航空', flightNo: 'HU3456' }
    ];

    const trainData = [
        { from: '北京', to: '上海', departTime: '07:00', arriveTime: '12:30', type: '二等座', price: 553, trainNo: 'G101' },
        { from: '北京', to: '上海', departTime: '09:00', arriveTime: '14:30', type: '一等座', price: 933, trainNo: 'G103' },
        { from: '北京', to: '上海', departTime: '11:00', arriveTime: '16:30', type: '商务座', price: 1748, trainNo: 'G105' },
        { from: '北京', to: '上海', departTime: '13:00', arriveTime: '18:30', type: '二等座', price: 553, trainNo: 'G107' }
    ];

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const departure = departureInput.value;
        const arrival = arrivalInput.value;
        const departDate = document.getElementById('depart-date').value;
        const isRoundTrip = returnOption.value === 'round-trip';
        const returnDate = isRoundTrip ? document.getElementById('return-date').value : null;
        const travelType = document.getElementById('travel-type').value;
        const passengers = passengerInput.value;
        
        // 显示搜索结果区域
        resultsSection.style.display = 'block';
        outboundResults.innerHTML = '';
        returnResults.innerHTML = '';
        bookingSummary.style.display = 'none';
        
        // 根据选择的交通方式获取数据
        const data = travelType === 'flight' ? flightData : trainData;
        
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
            <button class="ticket-select">选择</button>
        `;
        
        // 添加选择按钮事件
        const selectBtn = ticket.querySelector('.ticket-select');
        selectBtn.addEventListener('click', function() {
            const tabType = document.querySelector('.tab-btn.active').dataset.type;
            const summaryType = tabType === 'outbound' ? '去程' : '返程';
            
            // 添加到预订摘要
            summaryContent.innerHTML += `
                <div class="summary-item">
                    <span>${summaryType}: ${item.from} → ${item.to}</span>
                    <span>¥${item.price}</span>
                </div>
            `;
            
            // 显示预订摘要
            bookingSummary.style.display = 'block';
            
            // 如果是去程且选择了往返，切换到返程标签
            if (tabType === 'outbound' && returnTab.style.display === 'block') {
                document.querySelector('.tab-btn[data-type="return"]').click();
                
                // 生成返程票务
                trainData.forEach(item => {
                    const returnTicket = createTicketElement(item, type);
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

    // 热门推荐视频播放控制
    document.querySelectorAll('.video-container').forEach(container => {
        const video = container.querySelector('video');
        const playBtn = container.querySelector('.play-btn');
        
        container.addEventListener('mouseenter', function() {
            video.play();
            playBtn.style.opacity = '0';
        });
        
        container.addEventListener('mouseleave', function() {
            video.pause();
            playBtn.style.opacity = '1';
        });
        
        playBtn.addEventListener('click', function() {
            video.play();
            playBtn.style.opacity = '0';
        });
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