document.addEventListener('DOMContentLoaded', async () => {
   /*  const dataUrl =
     'https://script.google.com/macros/s/AKfycbw1KAhYbM4ZmOKAQjTlUxk5XrivtITa0pMM2ohChNpqvtkGHPoROFsTSphRPv3idbk4/exec' */
   const dataUrl = './scripts/data.json'
   const menu = document.querySelector('.iframe__nav')
   const seocontainer = document.querySelector('.seo__wrapper')
   const skeletonContainer = document.querySelector('.skeleton-container')
   const container = document.querySelector('.iframe__categorias-container')
   const template = document.querySelector('#producto-template')

   if (!container || !template) {
      console.error(
         'Error: No se encontró .iframe__categorias-container o el template'
      )
      return
   }

   const createSkeleton = () => {
      const skeleton = document.createElement('div')
      skeleton.classList.add('skeleton')
      skeleton.innerHTML = `
         <div class="skeleton-image"></div>
         <div class="skeleton-text"></div>
      `
      return skeleton
   }

   const showSkeletons = () => {
      const isMobile = window.innerWidth <= 768
      const count = isMobile ? 18 : 12
      skeletonContainer.innerHTML = ''
      for (let i = 0; i < count; i++) {
         skeletonContainer.appendChild(createSkeleton())
      }
   }

   const styleText = (text) => {
      return text.replace(
         /(\d+%|ofertas|\$\d{1,3}(\.\d{3})*(,\d+)?|\d+\s*(ml|ML)|ENVÍO\sGRATIS)/gi,
         (match) =>
            `<span class="iframe__categorias-span" style="font-weight: bold; color: red;">${match}</span>`
      )
   }

   const getEstadoStyles = (offerState) => {
      if (
         /SOLO X \d+ HORAS/i.test(offerState) ||
         offerState.toUpperCase() === 'AGOTADO'
      ) {
         return {
            borderColor: 'red',
            bgColor: 'red',
            textColor: 'white',
            text: offerState.toUpperCase(),
            borderWidth: '3px',
         }
      }
      if (offerState.toUpperCase() === 'LANZAMIENTO') {
         return {
            borderColor: '#aad500',
            bgColor: '#aad500',
            textColor: 'black',
            text: 'LANZAMIENTO',
            borderWidth: '3px',
         }
      }
      return {
         borderColor: 'rgb(223, 223, 223)',
         bgColor: 'transparent',
         textColor: 'black',
         text: '',
         borderWidth: '1px',
      }
   }

   const renderProductos = (productos) => {
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      container.innerHTML = ''
      const fragment = document.createDocumentFragment()

      const tieneSoloXHoras = productos.some((p) =>
         /SOLO X \d+ HORAS/i.test(p.offerState)
      )

      if (tieneSoloXHoras) {
         if (!document.querySelector('[data-category-name="SoloX"]')) {
            const nav = document.querySelector('.iframe__nav')
            const soloXItem = document.createElement('a')
            soloXItem.href = '#SoloX'
            soloXItem.className = 'iframe__nav-item'
            soloXItem.dataset.categoryName = 'SoloX'
            soloXItem.textContent = 'Solo X Horas'
            nav.appendChild(soloXItem)
         }
      }

      productos
         .filter((producto) => {
            const inicio = new Date(producto.startDate)
            const fin = new Date(producto.endDate)
            return !producto.isProductHidden && hoy >= inicio && hoy <= fin
         })
         .sort((a, b) => a.orden_sellout - b.orden_sellout)
         .forEach((producto) => {
            const estadoStyles = getEstadoStyles(producto.offerState)
            const productoClone = template.content.cloneNode(!0)
            const link = productoClone.querySelector('.iframe__categorias-link')
            const img = productoClone.querySelector('.iframe__categorias-image')
            const title = productoClone.querySelector(
               '.iframe__categorias-productTitle'
            )
            const tagDesktop = productoClone.querySelector('.iframe__tag--desk')
            const tagMobile = productoClone.querySelector(
               '.iframe__tag--mobile'
            )

            link.href = producto.urlProduct
            link.dataset.id = producto.id
            link.dataset.title = producto.title

            if (/SOLO X \d+ HORAS/i.test(producto.offerState)) {
               link.dataset.category = `${producto.category} SoloX`
            } else {
               link.dataset.category = producto.category
            }

            img.src = producto.urlImage
            img.alt = producto.title || 'Imagen de producto'
            img.style.border = `${estadoStyles.borderWidth} solid ${estadoStyles.borderColor}`
            title.innerHTML = styleText(producto.title || '')

            if (estadoStyles.text) {
               tagDesktop.style.backgroundColor = estadoStyles.bgColor
               tagDesktop.style.color = estadoStyles.textColor
               tagDesktop.innerHTML = `<b class="iframe__tag--bold">${estadoStyles.text}</b>`
               tagMobile.style.backgroundColor = estadoStyles.bgColor
               tagMobile.style.color = estadoStyles.textColor
               tagMobile.innerHTML = `<b class="iframe__tag--bold">${estadoStyles.text}</b>`
            } else {
               tagDesktop.remove()
               tagMobile.remove()
            }
            fragment.appendChild(productoClone)
         })

      container.appendChild(fragment)
      menu.style.opacity = '0'
      menu.style.display = 'flex'
      seocontainer.style.display = 'block'

      setTimeout(() => {
         container.classList.add('iframe__categorias-container--show')
         menu.style.transition = 'opacity 0.5s ease-in-out'
         menu.style.opacity = '1'
         const navCargadoEvent = new Event('navCargado')
         document.dispatchEvent(navCargadoEvent)
      }, 100)
   }

   const fetchData = async () => {
      try {
         showSkeletons()
         const response = await fetch(dataUrl)
         const data = await response.json()
         console.log(data)
         if (!data || !Array.isArray(data)) {
            console.error('Error: Datos no válidos', data)
            return
         }

         const timestamp = new Date().getTime()
         localStorage.setItem('productosData', JSON.stringify(data))
         localStorage.setItem('productosTimestamp', timestamp)
         skeletonContainer.style.display = 'none'
         renderProductos(data)
      } catch (error) {
         console.error('Error al cargar los datos:', error)
      }
   }

   const loadData = () => {
      const productosData = localStorage.getItem('productosData')
      const productosTimestamp = localStorage.getItem('productosTimestamp')
      const now = new Date().getTime()
      const fithteenMinutes = 5 * 60 * 1000
      /*     const fithteenMinutes = 1 */

      if (
         productosData &&
         productosTimestamp &&
         now - productosTimestamp < fithteenMinutes
      ) {
         const data = JSON.parse(productosData)
         skeletonContainer.style.display = 'none'
         renderProductos(data)
      } else {
         fetchData()
      }
   }

   loadData()
})
