export default function WebParam(){
    const url = document.location.href
    const parsedUrl = new URL(url);   
    const params = parsedUrl.searchParams;
    const jsonParams = {};
    params.forEach((value, key) => {
        jsonParams[key] = value;
    });
    return jsonParams
}