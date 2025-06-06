document.addEventListener('navCargado',()=>{const nav=document.querySelector('.iframe__nav')
   const navItems=document.querySelectorAll('.iframe__nav-item')
   const products=document.querySelectorAll('.iframe__categorias-link')
   const banner=document.querySelector('.iframe__banner')
   const verTodoBtn=document.querySelector('[data-category-name="VerTodo"]')
   let activeCategory='VerTodo'
   const mostrarTodosLosProductos=()=>{products.forEach((product)=>(product.style.display='block'))}
   const filtrarPorCategoria=(categoria)=>{products.forEach((product)=>{const productCategory=product.getAttribute('data-categoria')||''
   const categoriasProducto=productCategory.split(' ')
   product.style.display=categoriasProducto.includes(categoria)?'block':'none'})}
   mostrarTodosLosProductos()
   navItems.forEach((item)=>{item.addEventListener('click',function(event){event.preventDefault()
   const dataCategory=item.getAttribute('data-category-name')
   navItems.forEach((nav)=>nav.classList.remove('selected','ver-todo-active'))
   if(dataCategory==='VerTodo'){activeCategory='VerTodo'
   mostrarTodosLosProductos()
   item.classList.add('ver-todo-active')}else{activeCategory=dataCategory
   filtrarPorCategoria(dataCategory)}
   item.classList.add('selected')
   nav.scrollTo({left:item.offsetLeft-nav.offsetLeft,behavior:'smooth',})})})
   banner.addEventListener('click',()=>{activeCategory='VerTodo'
   mostrarTodosLosProductos()
   navItems.forEach((nav)=>nav.classList.remove('selected','ver-todo-active'))
   verTodoBtn.classList.add('selected','ver-todo-active')
   nav.scrollTo({left:verTodoBtn.offsetLeft-nav.offsetLeft,behavior:'smooth',})})})