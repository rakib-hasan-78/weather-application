import './src/css/style.css';
import './src/image/summer.jpg';
import './src/image/winter.jpg';
import './src/image/rainy.jpg';
import './src/image/autumn.jpg';
import './src/image/spring.jpg';

const searchContainer = document.getElementById('search-container');
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (e)=>{      

    if (searchContainer.classList.contains('w-full')) {
        searchContainer.classList.remove('w-full');
        searchContainer.classList.add('w-16', 'h-16');
    } else {
        searchContainer.classList.remove('w-16','h-16');
        searchContainer.classList.add('w-full');
    
    }

});
