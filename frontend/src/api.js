const API_URL = "http://127.0.0.1:8000";


export async function evaluatePrompt(data){

    const response = await fetch(
        `${API_URL}/evaluate`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }
    );

    return await response.json();
}