let seoButton=document.querySelector('.seo__toggle-btn')
seoButton.addEventListener('click',()=>{let seoContent=document.getElementById('seoContent')
if(seoContent.style.display==='none'||seoContent.style.display===''){seoContent.style.display='block'
seoButton.textContent='Ver menos'}else{seoContent.style.display='none'
seoButton.textContent='Ver más'}})