
const checkAdObject = ad => {
  let result = true
  const keys = ['name', 'price', 'description']
  Object.entries(ad).forEach(([key, value], index) => {
    if (!keys.includes(key)) {
      result = false
    }
    if ((key === 'name' || key === 'description') && typeof value !== 'string') {
      result = false
    }
    if (key === 'price' && typeof value !== 'number') {
      result = false
    }
  })
  return result
  
}

module.exports = { checkAdObject }