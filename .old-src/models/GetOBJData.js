async function getData() {
    const data = ReadFile();
}

async function ReadFile() {
    const response = await fetch("./models/google_cat/Mesh_Cat.obj")
    return await response.text();    
}

export {getData};