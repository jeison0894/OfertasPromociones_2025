/* const supabaseUrl = 'https://pwnysdqtryhpsxbwduxx.supabase.co'
const supabaseKey =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bnlzZHF0cnlocHN4YndkdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTgxMDgsImV4cCI6MjA1NTgzNDEwOH0.fdasu8s64B9wN9sh6zTQ3WLwX-4d_sfAMzMODMfDF1o'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey) */

async function trackCategoryClick(category) {
   const today = new Date().toLocaleDateString('en-CA')
   const { data, error: fetchError } = await supabase
      .from('conteo_clics_categorias')
      .select('clics')
      .eq('categoria', category)
      .eq('fecha', today)
      .single()
   if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error al obtener datos:', fetchError)
      return
   }
   const { error: upsertError } = await supabase
      .from('conteo_clics_categorias')
      .upsert([
         {
            categoria: category,
            fecha: today,
            clics: data ? data.clics + 1 : 1,
         },
      ])
   if (upsertError) {
      console.error('Error en upsert:', upsertError)
   } else {
      /* console.log(`Clic registrado para ${category} en ${today}`) */
   }
}
document.querySelectorAll('.iframe__nav-item').forEach((item) => {
   item.addEventListener('click', (event) => {
      const category = event.target.dataset.categoryName
      if (category) {
         trackCategoryClick(category)
      }
   })
})
