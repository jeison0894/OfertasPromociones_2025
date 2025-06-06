document.addEventListener('navCargado', () => {
   async function trackProductClick(productId, productName, productCategory) {
      const today = new Date().toLocaleDateString('en-CA')

      const { data, error: fetchError } = await supabase
         .from('conteo_clics_productos')
         .select('clics')
         .eq('id', productId)
         .eq('llamado', productName)
         .eq('categoria', productCategory)
         .eq('fecha', today)
         .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
         console.error('Error al obtener datos:', fetchError)
         return
      }

      const { error: upsertError } = await supabase
         .from('conteo_clics_productos')
         .upsert([
            {
               id: productId,
               llamado: productName,
               categoria: productCategory,
               fecha: today,
               clics: data ? data.clics + 1 : 1,
            },
         ])

      if (upsertError) {
         console.error('Error en upsert:', upsertError)
      } else {
       /*   console.log(
            `Clic registrado para Producto ID: ${productId}, Llamado: ${productName}, Categoría: ${productCategory} en ${today}`
         ) */
      }
   }

   document.querySelectorAll('.iframe__categorias-link').forEach((item) => {
      item.addEventListener('click', (event) => {
         const productId = event.currentTarget.dataset.id
         const productName = event.currentTarget.dataset.llamado
         const productCategory = event.currentTarget.dataset.categoria

         if (productId && productName && productCategory) {
            trackProductClick(productId, productName, productCategory)
         }
      })
   })
})
