// function to convert kebab case to camel case
export const kebabToCamel = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}