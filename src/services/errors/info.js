export const generateUserErrorInfo = user => {
    return `
    Una o mas propiedades estan incompletas o son invalidas
    Lista de propiedades obligatorias:
    -first_name: Must be a string (${user?.first_name})
    -last_name: Must be a string(${user?.last_name})
    -email: Must be a string (${user?.email})
    -password: Must be a string
    -age: Must be a number (${user?.age})
    `
}

export const generateProductErrorInfo = product => {
    return `
    Una o mas propiedades estan incompletas o son invalidas
    Lista de propiedades obligatorias:
    -title: Must be a string (${product?.title})
    -description: Must be a string (${product?.description})
    -price: Must be a number (${product?.price})
    -stock: Must be a number (${product?.stock})
    -category: Must be a string (${product.category})
    `
}